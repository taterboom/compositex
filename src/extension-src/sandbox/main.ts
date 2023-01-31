import { MESSAGE_TYPE, MESSAGE_TYPE_PREFIX } from "@/constants/message"
import { BundledPipeline, MetaNode, ProgressItem, RunningContext } from "@/store/type"
import { generateMessageSender, sendBackMessage } from "@/utils/sandboxMessage"
import { StatusMessage } from "@/utils/sandboxMessageTerminal"
import { v4 as uuidv4 } from "uuid"

const sendMessage = generateMessageSender(window.parent)

const statusMessageHandler = async (promise: Promise<StatusMessage>) => {
  const message = await promise
  if (message.error) {
    throw message.error
  } else {
    return message.result
  }
}

const context = {
  fetch: (...args: any[]) =>
    statusMessageHandler(sendMessage<StatusMessage>(MESSAGE_TYPE.Fetch, args, { once: true })),
  alioss: (payload: { file: File; service: string }) =>
    statusMessageHandler(sendMessage<StatusMessage>(MESSAGE_TYPE.Alioss, payload, { once: true })),
  mainWorld: (expression: string) =>
    statusMessageHandler(
      sendMessage<StatusMessage>(MESSAGE_TYPE.MainWorld, { expression }, { once: true })
    ),
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
    sendBackMessage(event, MESSAGE_TYPE.Meta, metaNode)
  }
  if (event.data.type === MESSAGE_TYPE.RunPipeline) {
    const pipeline: BundledPipeline = event.data.payload.pipeline
    const input: any = event.data.payload.input
    const action = pipeline.nodes.reduce(
      (preAction, node, index) => {
        const metaNode = node.metaNode
        if (!metaNode) {
          throw new Error("no metaNode")
        }
        return async () => {
          const preResult = await preAction()
          try {
            const result = await runMetaNode(metaNode, preResult, node.options, context)
            const progressItem: ProgressItem = {
              pipelineId: pipeline.id,
              index,
              result,
            }
            sendMessage(MESSAGE_TYPE.RunPipelineProgress, progressItem)
            return result
          } catch (error) {
            const progressItem: ProgressItem = {
              pipelineId: pipeline.id,
              index,
              error,
            }
            sendMessage(MESSAGE_TYPE.RunPipelineProgress, progressItem)
            throw error
          }
        }
      },
      async () => input
    )
    action().then((result) => {
      sendBackMessage(event, MESSAGE_TYPE.RunPipeline, result)
    })
  }
})
