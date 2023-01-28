import type { State } from "./useStore"

export const selectMetaNode = (id: any) => (state: State) =>
  state.metaNodes.find((item) => item.id === id)

export const selectPipeline = (id: any) => (state: State) =>
  state.pipelines.find((item) => item.id === id)

export const selectPipelinesWithMetaNodeIds = (ids: string[]) => (state: State) =>
  state.pipelines.filter(
    (pipeline) => pipeline.nodes.findIndex((item) => ids.includes(item.metaId)) > -1
  )
