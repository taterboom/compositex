import { BundledPipeline, IdentityNode, MetaNode, Node, Pipeline } from "@/store/type"
import { v4 as uuidv4 } from "uuid"

class MetaNodeShell {
  id: string
  _raw: string
  _evaled: any
  constructor(code: string, id: string = uuidv4()) {
    try {
      this._raw = code
      eval(`this._evaled=${code}`)
    } catch (err) {
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

export function generateMetaNode(codeStr: string, id?: string) {
  return new MetaNodeShell(codeStr, id).toJSON()
}

export function runMetaNode(metaNode: MetaNode, input: any, options: any = {}) {
  if (!metaNode.config?.options) return
  const optionsWithDefaultValue: any = {}
  metaNode.config?.options.forEach((option) => {
    if (options[option.name] === undefined) {
      optionsWithDefaultValue[option.name] = option.default
    } else {
      optionsWithDefaultValue[option.name] = options[option.name]
    }
  })
  return metaNode.run(input, optionsWithDefaultValue)
}

export const DEMO = `(function () {
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
      config: {
          name: "Increase",
          desc: "Increase number",
          input: { type: "number" },
          output: { type: "number" },
          options: [
              { name: "step", type: "number", default: 1 },
          ],
      },
      run(input, options) {
          // you can return promise
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(input + options.step)
            }, 1000);
          })
      }
  }
  return nodeConfig
})()`

export function generatePipeline(pipeline: Pipeline | Omit<Pipeline, "id">): Pipeline {
  return {
    id: uuidv4(),
    ...pipeline,
  }
}

export function generateIdentityNode(metaNode: MetaNode, no: number): IdentityNode {
  return {
    id: uuidv4(),
    metaId: metaNode.id,
    name: `Node-${metaNode.config.name}${no <= 0 ? "" : `-${no + 1}`}`,
  }
}

export function generateIdentityNodeFromNode(node: Node): IdentityNode {
  return {
    id: uuidv4(),
    ...node,
  }
}

export function isMetaNode(object: any): object is MetaNode {
  return "_raw" in object
}

export function getRelatedMetaNodes(bundledPipeline: BundledPipeline) {
  const relatedMetaNodes: MetaNode[] = []
  bundledPipeline.nodes.forEach((node) => {
    if (relatedMetaNodes.some((item) => item.id === node.metaId)) {
      return
    }
    relatedMetaNodes.push(node.metaNode)
  })
  return relatedMetaNodes
}
