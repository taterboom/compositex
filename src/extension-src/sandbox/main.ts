import { MESSAGE_TYPE, MESSAGE_TYPE_PREFIX } from "@/constants/message"
import { plugins, setupContext } from "@/plugins"
import { BundledPipeline, MetaNode, ProgressItem, RunningContext } from "@/store/type"
import { generateMessageSender, sendBackMessage, StatusMessage } from "@/utils/sandboxMessage"
import { v4 as uuidv4 } from "uuid"

const context = setupContext(plugins, {})

function generateContext() {
  return { ...context }
}

const sendMessage = generateMessageSender(window.parent)

function formatCodeStr(codeStr: string) {
  let result = codeStr.trim()
  if (result.startsWith(";")) {
    result = result.slice(1)
  }
  return result
}

class MetaNodeShell {
  id: string
  _raw: string
  _evaled: any
  options: Partial<MetaNode>
  constructor(code: string, options: Partial<MetaNode> = {}) {
    const { id = uuidv4(), ...otherOptions } = options
    this.options = otherOptions
    try {
      this._raw = formatCodeStr(code)
      eval(`this._evaled=${code}`)
    } catch (err) {
      console.log(err)
      throw new Error("Node initial error")
    }
    this.id = id
  }
  toJSON() {
    return {
      ...this.options,
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

function generateMetaNode(codeStr: string, options?: Partial<MetaNode>) {
  return new MetaNodeShell(codeStr, options).toJSON()
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
    const { run, ...metaNode } = generateMetaNode(
      event.data.payload.codeStr,
      event.data.payload.options
    )
    const result: StatusMessage = {
      ok: true,
      data: metaNode,
    }
    sendBackMessage(event, MESSAGE_TYPE.Meta, result)
  }
  if (event.data.type === MESSAGE_TYPE.RunPipeline) {
    const pipeline: BundledPipeline = event.data.payload.pipeline
    const input: any = event.data.payload.input
    const isolateContext = generateContext()
    const action = pipeline.nodes.reduce(
      (preAction, node, index) => {
        const metaNode = node.metaNode
        if (!metaNode) {
          throw new Error("no metaNode")
        }
        return async () => {
          const preResult = await preAction()
          try {
            const result = await runMetaNode(metaNode, preResult, node.options, isolateContext)
            const progressItem: StatusMessage<ProgressItem> = {
              ok: true,
              data: {
                ok: true,
                pipelineId: pipeline.id,
                index,
                result,
              },
            }
            sendMessage(MESSAGE_TYPE.RunPipelineProgress, progressItem)
            return result
          } catch (error) {
            const progressItem: StatusMessage<ProgressItem> = {
              ok: false,
              data: {
                ok: false,
                pipelineId: pipeline.id,
                index,
                error,
              },
            }
            sendMessage(MESSAGE_TYPE.RunPipelineProgress, progressItem)
            throw error
          }
        }
      },
      async () => input
    )
    action().then((result) => {
      const resultPayload: StatusMessage = {
        ok: true,
        data: result,
      }
      sendBackMessage(event, MESSAGE_TYPE.RunPipeline, resultPayload)
    })
  }
})
