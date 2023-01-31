import { BundledPipeline } from "./type"
import type { State } from "./useStore"

export const selectMetaNode = (id: any) => (state: State) =>
  state.metaNodes.find((item) => item.id === id)

export const selectPipeline = (id: any) => (state: State) =>
  state.pipelines.find((item) => item.id === id)

export const selectPipelinesWithMetaNodeIds = (ids: string[]) => (state: State) =>
  state.pipelines.filter(
    (pipeline) => pipeline.nodes.findIndex((item) => ids.includes(item.metaId)) > -1
  )

export const selectBundledPipeline = (id: string) => (state: State) => {
  const { pipelines, metaNodes } = state
  const pipeline = pipelines.find((item) => item.id === id)
  if (!pipeline) {
    throw new Error("no pipeline")
  }
  const nodesWithMeta = pipeline.nodes.map((node) => {
    const metaNode = metaNodes.find((item) => item.id === node.metaId)
    if (!metaNode) {
      throw new Error("no metaNode")
    }
    return {
      ...node,
      metaNode,
    }
  })
  const bundledPipeline: BundledPipeline = {
    ...pipeline,
    nodes: nodesWithMeta,
  }
  return bundledPipeline
}
