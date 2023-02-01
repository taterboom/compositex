import {
  checkMessageValid,
  generateMessageSender,
  generateMessageType,
  sendBackMessage,
  StatusMessage,
} from "@/utils/sandboxMessage"
import { Plugin } from "../type"

type FetchResult = {
  ok: boolean
  status: number
  data: any
}

const NAME = "fetch"
const MESSAGE_TYPE_SEND = generateMessageType(NAME, "SEND")
const MESSAGE_TYPE_RES = generateMessageType(NAME, "RES")

export function initFetchTerminal() {
  window.addEventListener("message", async (event) => {
    if (!checkMessageValid(event)) {
      return
    }
    if (event.data.type === MESSAGE_TYPE_SEND) {
      try {
        const res = await fetch(...(event.data.payload as [any]))
        let data
        const contentType = res.headers.get("content-type")
        if (contentType?.includes("json")) {
          data = await res.json()
        } else if (contentType?.includes("image")) {
          data = await res.blob()
        } else {
          data = await res.text()
        }
        const fetchResult: FetchResult = {
          ok: res.ok,
          status: res.status,
          data,
        }
        const resultPayload: StatusMessage<FetchResult> = {
          ok: fetchResult.ok,
          data: fetchResult,
        }
        sendBackMessage(event, MESSAGE_TYPE_RES, resultPayload)
      } catch (error) {
        const resultPayload: StatusMessage = {
          ok: false,
          data: error,
        }
        sendBackMessage(event, MESSAGE_TYPE_RES, resultPayload)
      }
    }
  })
}

const sendMessage = generateMessageSender(window.parent)

const FetchPlugin: Plugin = {
  name: NAME,
  terminal: initFetchTerminal,
  context: (...args: any[]) => sendMessage<FetchResult>(MESSAGE_TYPE_SEND, args, { echo: true }),
  contextType: {
    global: `type FetchResult = {
    ok: boolean
    status: number
    data: any
}`,
    context: `(...args[]) => Promise<FetchResult>`,
  },
}

export default FetchPlugin
