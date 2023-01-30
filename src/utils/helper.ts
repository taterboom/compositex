import { MESSAGE_TYPE } from "@/constants/message"
import { BundledPipeline, IdentityNode, MetaNode, Node, Pipeline } from "@/store/type"
import { v4 as uuidv4 } from "uuid"
import { requestSandbox } from "./sandboxMessage"

export function generateMetaNode(codeStr: string, id?: string) {
  return requestSandbox<MetaNode>(MESSAGE_TYPE.Meta, { codeStr, id })
}

export function runPipeline(pipeline: BundledPipeline, input?: any) {
  return requestSandbox(MESSAGE_TYPE.RunPipeline, { pipeline, input })
}

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
