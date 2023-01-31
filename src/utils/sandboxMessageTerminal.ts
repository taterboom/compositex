import { MESSAGE_TYPE, MESSAGE_TYPE_PREFIX } from "@/constants/message.js"
import { Parser } from "acorn"
import { OSSUpload } from "./alioss.js"
import { sendBackMessage } from "./sandboxMessage"

export type StatusMessage = {
  result?: any
  error?: any
}

export type FetchResult = {
  ok: boolean
  status: number
  data: any
}

export function checkMessageValid(event: MessageEvent) {
  return (
    event.source &&
    (event.source as WindowProxy).window &&
    event.data?.type?.startsWith?.(MESSAGE_TYPE_PREFIX)
  )
}

export function initFetchTerminal() {
  window.addEventListener("message", async (event) => {
    if (!checkMessageValid(event)) {
      return
    }
    if (event.data.type === MESSAGE_TYPE.Fetch) {
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
        const resultPayload: StatusMessage = {
          result: res.ok ? fetchResult : undefined,
          error: res.ok ? undefined : fetchResult,
        }
        sendBackMessage(event, MESSAGE_TYPE.FetchRes, resultPayload)
      } catch (error) {
        const resultPayload: StatusMessage = {
          error,
        }
        sendBackMessage(event, MESSAGE_TYPE.FetchRes, resultPayload)
      }
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
      uploader
        .run(event.data.payload.file)
        .then((res) => {
          const resultPayload: StatusMessage = {
            result: res.url,
          }
          sendBackMessage(event, MESSAGE_TYPE.AliossRes, resultPayload)
        })
        .catch((error) => {
          const resultPayload: StatusMessage = {
            error,
          }
          sendBackMessage(event, MESSAGE_TYPE.AliossRes, resultPayload)
        })
    }
  })
}

function traverse(node: any): Array<string | string[]> {
  console.log(node)
  if (node.type === "Program") {
    return traverse(node.body[0])
  }
  if (node.type === "ExpressionStatement") {
    return [...traverse(node.expression)]
  }
  if (node.type === "MemberExpression") {
    return [...traverse(node.object), ...traverse(node.property)]
  }
  if (node.type === "CallExpression") {
    return [...traverse(node.callee), node.arguments.map(traverse).flat()]
  }
  if (node.type === "Identifier") {
    return [node.name]
  }
  if (node.type === "Literal") {
    return [node.value]
  }
  return []
}

const ERROR_PREFIX = "__COMPOSITEX___ERROR"

function execInMainWorld(chunks: Array<string | string[]>) {
  try {
    const result = chunks.reduce(
      (res: { pre: any; current: any }, chunk) => {
        if (Array.isArray(chunk)) {
          const currentResult = res.current.apply(res.pre, chunk)
          return {
            pre: res.current,
            current: currentResult,
          }
        } else {
          return {
            pre: res.current,
            current: res.current[chunk],
          }
        }
      },
      {
        pre: null,
        current: window,
      }
    )
    return result.current
  } catch (error) {
    // "__COMPOSITEX___ERROR" should be literal here
    // @ts-ignore
    return "__COMPOSITEX___ERROR" + error?.message
  }
}

function initFetchMainWorld() {
  window.addEventListener("message", async (event) => {
    if (!checkMessageValid(event)) {
      return
    }
    if (event.data.type === MESSAGE_TYPE.MainWorld) {
      if (event.data.payload?.expression === undefined) return
      try {
        const res = await chrome.tabs.query({ currentWindow: true, active: true })
        const activeTabId = res[0]?.id
        if (!activeTabId) return
        const chunks = traverse(Parser.parse(event.data.payload.expression, { ecmaVersion: 2020 }))
        const execResult = await chrome.scripting.executeScript({
          target: { tabId: activeTabId },
          func: execInMainWorld,
          args: [chunks],
        })
        if (execResult[0]) {
          const result = execResult[0].result
          if (result?.startsWith?.(ERROR_PREFIX)) {
            throw new Error(result.slice(ERROR_PREFIX.length))
          }
          const resultPayload: StatusMessage = {
            result,
          }
          sendBackMessage(event, MESSAGE_TYPE.MainWorldRes, resultPayload)
        }
      } catch (error) {
        const resultPayload: StatusMessage = {
          error,
        }
        sendBackMessage(event, MESSAGE_TYPE.MainWorldRes, resultPayload)
      }
    }
  })
}

export function initTerminals() {
  initFetchTerminal()
  initAliossTerminal()
  initFetchMainWorld()
}
