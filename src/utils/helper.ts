import { MESSAGE_TYPE } from "@/constants/message"
import { BundledPipeline, IdentityNode, MetaNode, Node, Pipeline, ProgressItem } from "@/store/type"
import { v4 as uuidv4 } from "uuid"
import { checkMessageValid, requestSandbox } from "./sandboxMessage"

export function generateMetaNode(codeStr: string, options?: Partial<MetaNode>) {
  const transferableOptions = {
    id: options?.id,
    disposable: options?.disposable,
  }
  return requestSandbox<MetaNode>(MESSAGE_TYPE.Meta, { codeStr, options: transferableOptions })
}

export function runPipeline(
  pipeline: BundledPipeline,
  input?: any,
  onProgress?: (data: ProgressItem) => void
) {
  const progressListener = (e: MessageEvent) => {
    if (!checkMessageValid(e)) return
    if (e.data.type !== MESSAGE_TYPE.RunPipelineProgress) return
    if (e.data.payload.data?.pipelineId !== pipeline.id) return
    if (e.data.payload.data?.index >= pipeline.nodes.length - 1) {
      window.removeEventListener("message", progressListener)
    }
    onProgress?.(e.data.payload.data)
  }
  window.addEventListener("message", progressListener)
  return requestSandbox(MESSAGE_TYPE.RunPipeline, { pipeline, input })
}

export function generatePipeline(pipeline: Pipeline | Omit<Pipeline, "id">): Pipeline {
  return {
    id: "id" in pipeline ? pipeline.id : uuidv4(),
    ...pipeline,
  }
}

export function generateIdentityNode(metaNode: MetaNode): IdentityNode {
  return {
    id: uuidv4(),
    metaId: metaNode.id,
    name: metaNode.config.name,
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
