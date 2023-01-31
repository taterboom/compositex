import { MESSAGE_TYPE_PREFIX } from "@/constants/message"
import { v4 as uuidv4 } from "uuid"
import { initTerminals } from "./sandboxMessageTerminal"

initTerminals()

type Payload = Record<string, any> | Record<string, any>[]

let iframeEl: HTMLIFrameElement
let loaded = false
async function getIframe() {
  if (!iframeEl) {
    return new Promise<HTMLIFrameElement>((resolve) => {
      iframeEl = document.createElement("iframe")
      iframeEl.src = "./sandbox.html"
      iframeEl.style.display = "none"
      // iframeEl.setAttribute("sandbox", "allow-same-origin")
      iframeEl.addEventListener("load", () => {
        console.log("sandbox inited")
        loaded = true
        resolve(iframeEl)
      })
      document.body.appendChild(iframeEl)
    })
  }
  if (!loaded) {
    return new Promise<HTMLIFrameElement>((resolve) => {
      iframeEl.addEventListener("load", () => {
        resolve(iframeEl)
      })
    })
  }
  return iframeEl
}

export function sendBackMessage(event: MessageEvent, type: string, payload: Payload) {
  ;(event.source as WindowProxy).window.postMessage(
    generateMessage(type, payload, event.data.id),
    event.origin === "null" ? "*" : event.origin
  )
}

function formatMessagePayload(payload: Payload) {
  // if (typeof payload === "object") {
  //   return payload
  // }

  // return JSON.parse(JSON.stringify(payload))
  return payload
}

export function generateMessage(type: string, payload: Payload, id = uuidv4()) {
  return {
    id,
    type,
    timestamp: Date.now(),
    payload: formatMessagePayload(payload),
  }
}

export function generateMessageTools(type: string, payload: Payload) {
  const message = generateMessage(type, payload)
  console.log("[Send]", message)
  const onReceive = (resolve: any) => (event: MessageEvent) => {
    if (event.data?.type?.startsWith?.(MESSAGE_TYPE_PREFIX) && event.data?.id === message.id) {
      console.log("[Receive]", event)
      resolve(event.data.payload)
    }
  }
  return {
    message,
    onReceive,
  }
}

export function generateMessageSender(endpoint: Window) {
  return <T>(type: string, payload: any, options: { once?: boolean } = {}) => {
    return new Promise<T>((resolve) => {
      const { once = false } = options
      const { message, onReceive } = generateMessageTools(type, payload)
      if (once) {
        const listener = onReceive((data: any) => {
          window.removeEventListener("message", listener)
          resolve(data)
        })
        window.addEventListener("message", listener)
      }
      endpoint.postMessage(message, "*")
    })
  }
}

export async function requestSandbox<T>(type: string, payload: Record<string, any>) {
  const iframe = await getIframe()
  if (!iframe.contentWindow) {
    throw new Error("iframe.contentWindow not found")
  }
  const sendMessage = generateMessageSender(iframe.contentWindow)
  return sendMessage<T>(type, payload, { once: true })
}
