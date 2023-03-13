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
  statusText: string
  headers: Record<string, string>
  body: ArrayBuffer
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
        const arrayBuffer = await res.arrayBuffer()
        const fetchResult: FetchResult = {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries([...res.headers.entries()]),
          body: arrayBuffer,
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

async function serializeRequestObject(requestObject: Request) {
  const url = requestObject.url
  const method = requestObject.method
  const credentials = requestObject.credentials
  const mode = requestObject.mode
  const keepalive = requestObject.keepalive
  const headers = Object.fromEntries([...requestObject.headers.entries()])
  const body = await requestObject.arrayBuffer()
  return [
    url,
    {
      method,
      headers,
      body,
      credentials,
      mode,
      keepalive,
    },
  ]
}

const sendMessage = generateMessageSender(window.parent)

const FetchPlugin: Plugin = {
  name: NAME,
  terminal: initFetchTerminal,
  context: () => {
    const mockFetch = async (..._args: any[]) => {
      let args
      if (_args[0] instanceof Request) {
        args = await serializeRequestObject(_args[0])
      } else {
        args = _args
      }
      return sendMessage<FetchResult>(MESSAGE_TYPE_SEND, args, { echo: true }).then((res) => {
        const { body, ...options } = res
        return new Response(body, options)
      })
    }
    window.fetch = mockFetch
    return mockFetch
  },
  contextType: {
    context: `typeof fetch`,
  },
}

export default FetchPlugin
