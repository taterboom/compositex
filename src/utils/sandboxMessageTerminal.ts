import { MESSAGE_TYPE, MESSAGE_TYPE_PREFIX } from "@/constants/message.js"
import { OSSUpload } from "./alioss.js"
import { sendMessage } from "./sandboxMessage"

function checkMessageValid(event: MessageEvent) {
  return (
    event.source &&
    (event.source as WindowProxy).window &&
    event.data?.type?.startsWith?.(MESSAGE_TYPE_PREFIX)
  )
}

export function initFetchTerminal() {
  window.addEventListener("message", (event) => {
    if (!checkMessageValid(event)) {
      return
    }
    if (event.data.type === MESSAGE_TYPE.Fetch) {
      fetch(...(event.data.payload as [any]))
        .then((res) => {
          console.log(res)
          const contentType = res.headers.get("content-type")
          console.log(contentType)
          if (contentType?.includes("json")) {
            return res.json()
          }
          if (contentType?.includes("image")) {
            return res.blob()
          }
          return res.text()
        })
        .then((res) => {
          sendMessage(event, MESSAGE_TYPE.FetchRes, res)
        })
    }
  })
}

function initAliossTerminal() {
  window.addEventListener("message", (event) => {
    if (!checkMessageValid(event)) {
      return
    }
    if (event.data.type === MESSAGE_TYPE.Alioss) {
      const uploader = new OSSUpload({
        service: event.data.payload.service,
      })
      uploader.run(event.data.payload.file).then((res) => {
        sendMessage(event, MESSAGE_TYPE.AliossRes, res.url)
      })
    }
  })
}

export function initTerminals() {
  initFetchTerminal()
  initAliossTerminal()
}
