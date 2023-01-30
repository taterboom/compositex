import { MESSAGE_TYPE, MESSAGE_TYPE_PREFIX } from "@/constants/message"
import { BundledPipeline, MetaNode, RunningContext } from "@/store/type"
import { generateMessageTools, sendMessage } from "@/utils/sandboxMessage"
import { v4 as uuidv4 } from "uuid"

const context = {
  fetch: (...args: any[]) =>
    new Promise((res) => {
      const { message, onReceive } = generateMessageTools(MESSAGE_TYPE.Fetch, args)
      window.addEventListener("message", onReceive(res))
      window.parent.postMessage(message, "*")
    }),
  alioss: (payload: { file: File; service: string }) =>
    new Promise((res) => {
      const { message, onReceive } = generateMessageTools(MESSAGE_TYPE.Alioss, payload)
      window.addEventListener("message", onReceive(res))
      window.parent.postMessage(message, "*")
    }),
  mainWorld: (expression: string) =>
    new Promise((res) => {
      const { message, onReceive } = generateMessageTools(MESSAGE_TYPE.MainWorld, { expression })
      window.addEventListener("message", onReceive(res))
      window.parent.postMessage(message, "*")
    }),
}

class MetaNodeShell {
  id: string
  _raw: string
  _evaled: any
  constructor(code: string, id: string = uuidv4()) {
    try {
      this._raw = code
      eval(`this._evaled=${code}`)
    } catch (err) {
      console.log(err)
      throw new Error("Node initial error")
    }
    this.id = id
  }
  toJSON() {
    return {
      _raw: this._raw,
      id: this.id,
      config: {
        ...this._evaled.config,
        name: this._evaled.config?.name || `Node${this.id}`,
      },
      run: this._evaled.run,
    } as MetaNode
  }
}

function generateMetaNode(codeStr: string, id?: string) {
  return new MetaNodeShell(codeStr, id).toJSON()
}

function runMetaNode(_metaNode: MetaNode, input: any, options: any = {}, context: RunningContext) {
  const metaNode = generateMetaNode(_metaNode._raw)
  const optionsWithDefaultValue: any = {}
  metaNode.config?.options?.forEach((option) => {
    if (options[option.name] === undefined) {
      optionsWithDefaultValue[option.name] = option.default
    } else {
      optionsWithDefaultValue[option.name] = options[option.name]
    }
  })
  return metaNode.run(input, optionsWithDefaultValue, context)
}

window.addEventListener("message", async function (event) {
  console.log(event)
  if (
    !(
      event.source &&
      (event.source as WindowProxy).window &&
      event.data?.type?.startsWith?.(MESSAGE_TYPE_PREFIX)
    )
  ) {
    return
  }
  if (event.data.type === MESSAGE_TYPE.Meta) {
    const { run, ...metaNode } = generateMetaNode(event.data.payload.codeStr, event.data.payload.id)
    sendMessage(event, MESSAGE_TYPE.Meta, metaNode)
  }
  if (event.data.type === MESSAGE_TYPE.RunPipeline) {
    const pipeline: BundledPipeline = event.data.payload.pipeline
    const input: any = event.data.payload.input
    const action = pipeline.nodes.reduce(
      (preAction, node) => {
        const metaNode = node.metaNode
        if (!metaNode) {
          throw new Error("no metaNode")
        }
        return async () => {
          const result = await preAction()
          return runMetaNode(metaNode, result, node.options, context)
        }
      },
      async () => input
    )
    action().then((result) => {
      sendMessage(event, MESSAGE_TYPE.RunPipeline, result)
    })
  }
})
