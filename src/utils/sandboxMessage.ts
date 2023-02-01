import { MESSAGE_TYPE_PREFIX } from "@/constants/message"
import { v4 as uuidv4 } from "uuid"

export type StatusMessage<T = any> = {
  ok: boolean
  data: T
}

export function checkMessageValid(event: MessageEvent) {
  return (
    event.source &&
    (event.source as WindowProxy).window &&
    event.data?.type?.startsWith?.(MESSAGE_TYPE_PREFIX)
  )
}

export function generateMessageType(name: string, type: string) {
  return `${MESSAGE_TYPE_PREFIX}PLUGIN_${name}_${type}`
}

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
  return <Success>(type: string, payload: Payload, options: { echo?: boolean } = {}) => {
    return new Promise<Success>((resolve, reject) => {
      const { echo = false } = options
      const { message, onReceive } = generateMessageTools(type, payload)
      if (echo) {
        const listener = onReceive((data: StatusMessage) => {
          window.removeEventListener("message", listener)
          if (data.ok) {
            resolve(data.data)
          } else {
            reject(data.data)
          }
        })
        window.addEventListener("message", listener)
      } else {
        // never
        // @ts-ignore
        resolve()
      }
      endpoint.postMessage(message, "*")
    })
  }
}

export async function requestSandbox<T>(type: string, payload: Payload) {
  const iframe = await getIframe()
  if (!iframe.contentWindow) {
    throw new Error("iframe.contentWindow not found")
  }
  const sendMessage = generateMessageSender(iframe.contentWindow)
  return sendMessage<T>(type, payload, { echo: true })
}
