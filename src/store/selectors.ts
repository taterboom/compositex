import { BundledPipeline, MetaNode } from "./type"
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

export const selectIsPinned = (id: string) => (state: State) => state.pins.includes(id)

function sortByPins<T extends { id: string }>(object: T[], pins: string[]) {
  return [...object].sort((a, b) => {
    const aPinIndex = pins.indexOf(a.id)
    const bPinIndex = pins.indexOf(b.id)
    return bPinIndex - aPinIndex
  })
}

export const selectOrderedPipelines = (state: State) => sortByPins(state.pipelines, state.pins)

export const selectOrderedMetaNodes = (state: State) => sortByPins(state.metaNodes, state.pins)

export const selectMetaNodesOnlyUsedByPipeline = (id: string) => (state: State) => {
  const pipeline = state.pipelines.find((item) => item.id === id)
  const metaNodeOnlyUsed = new Set(pipeline?.nodes.map((item) => item.metaId))
  const otherPipelines = state.pipelines.filter((item) => item.id !== id)
  pipeline?.nodes.forEach((item) => {
    if (otherPipelines.some((p) => p.nodes.some((n) => n.metaId === item.metaId))) {
      metaNodeOnlyUsed.delete(item.metaId)
    }
  })
  return [...metaNodeOnlyUsed]
    .map((item) => selectMetaNode(item)(state))
    .filter((item) => item !== undefined) as MetaNode[]
}
