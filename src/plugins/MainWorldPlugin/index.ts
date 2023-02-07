import {
  checkMessageValid,
  generateMessageSender,
  generateMessageType,
  sendBackMessage,
  StatusMessage,
} from "@/utils/sandboxMessage"
import { Parser } from "acorn"
import { Plugin } from "../type"

/**
 * 1. setup terminal in extension pages
 * 2. setup context in sandbox run function
 * 3. built-in MetaNode
 */

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
          const currentResult = res.current.apply(
            res.pre,
            chunk.map((str) => (str === "window" ? window : str))
          )
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

function evalInMainWorld(code: string) {
  return eval(code)
}

const NAME = "mainWorld"
const MESSAGE_TYPE_SEND = generateMessageType(NAME, "SEND")
const MESSAGE_TYPE_RES = generateMessageType(NAME, "RES")

function initFetchMainWorld() {
  window.addEventListener("message", async (event) => {
    if (!checkMessageValid(event)) {
      return
    }
    if (event.data.type === MESSAGE_TYPE_SEND) {
      if (event.data.payload?.expression === undefined) return
      try {
        const res = await chrome.tabs.query({ currentWindow: true, active: true })
        const activeTabId = res[0]?.id
        if (!activeTabId) return
        const { type = "eval" } = event.data.payload?.options ?? {}
        let execResult
        if (type === "eval") {
          execResult = await chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: evalInMainWorld,
            args: [event.data.payload.expression],
            world: "MAIN",
          })
        } else {
          const chunks = traverse(
            Parser.parse(event.data.payload.expression, { ecmaVersion: 2020 })
          )
          execResult = await chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: execInMainWorld,
            args: [chunks],
          })
        }
        if (execResult[0]) {
          const result = execResult[0].result
          if (result?.startsWith?.(ERROR_PREFIX)) {
            throw new Error(result.slice(ERROR_PREFIX.length))
          }
          const resultPayload: StatusMessage = {
            ok: true,
            data: result,
          }
          sendBackMessage(event, MESSAGE_TYPE_RES, resultPayload)
        }
      } catch (error) {
        console.log("errpr", event)
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

const MainWorldMetaNode = {
  id: `${NAME}`,
  _raw: String.raw`(function () {
    /** @type {CompositeX.MetaNodeConfig} */
    const nodeConfig = {
      config: {
        name: "MainWorld",
        desc: "Get main world info",
        input: { type: "string" },
        output: { type: "any" },
        options: [
          { name: "expression", type: "string" },
          { 
            name: "type",
            desc: "choose eval if website support it or choose exec which has limits",
            type: "enum",
            enumItems: [{ name: "eval", value: "eval"}, { name: "exec", value: "exec" }],
            default: "eval",
          }
        ],
      },
      run(input, options, context) {
        return context.${NAME}(input || options.expression, { type: options.type })
      },
    }
    return nodeConfig
  })()`,
}

const mainWorld: Plugin = {
  name: NAME,
  terminal: initFetchMainWorld,
  context: (expression: string, options?: { type: "eval" | "exec" }) =>
    sendMessage(MESSAGE_TYPE_SEND, { expression, options }, { echo: true }),
  contextType: {
    context: `(expression: string, options?: { type: 'eval' | 'exec' }) => Promise<any>`,
  },
  metaNodes: [MainWorldMetaNode],
}

export default mainWorld
