import { MESSAGE_TYPE, MESSAGE_TYPE_PREFIX } from "@/constants/message.js"
import { Parser } from "acorn"
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

function execInMainWorld(chunks: Array<string | string[]>) {
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
}

function initFetchMainWorld() {
  window.addEventListener("message", (event) => {
    if (!checkMessageValid(event)) {
      return
    }
    if (event.data.type === MESSAGE_TYPE.MainWorld) {
      if (event.data.payload?.expression === undefined) return
      chrome.tabs.query({ currentWindow: true, active: true }).then((res) => {
        const activeTabId = res[0]?.id
        if (!activeTabId) return
        const chunks = traverse(Parser.parse(event.data.payload.expression, { ecmaVersion: 2020 }))
        console.log("!!!", chunks)
        chrome.scripting
          .executeScript({
            target: { tabId: activeTabId },
            func: execInMainWorld,
            args: [chunks],
          })
          .then((res) => {
            if (res[0]) {
              sendMessage(event, MESSAGE_TYPE.MainWorldRes, res[0].result)
            }
          })
      })
    }
  })
}

export function initTerminals() {
  initFetchTerminal()
  initAliossTerminal()
  initFetchMainWorld()
}
