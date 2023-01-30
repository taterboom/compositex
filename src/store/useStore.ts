import {
  generateMetaNode,
  generatePipeline,
  getRelatedMetaNodes,
  runPipeline,
} from "@/utils/helper"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { logger } from "./plugins/logger"
import { persistOptions } from "./plugins/persistOptions"
import { selectMetaNode, selectPipeline } from "./selectors"
import { BundledPipeline, MetaNode, Pipeline } from "./type"

export type State = {
  metaNodes: MetaNode[]
  pipelines: Pipeline[]
  addMetaNode(metaNodeStr: string): Promise<void>
  installMetaNode(metaNode: MetaNode): void
  removeMetaNode(id: string, related?: boolean): void
  updateMetaNode(id: string, metaNodeStr: string): Promise<void>
  addPipeline(pipeline: Omit<Pipeline, "id">): void
  installPipeline(bundledPipeline: BundledPipeline): void
  runPipeline(id: string, input: any): Promise<any>
  removePipeline(id: string, related?: boolean): void
  updatePipeline(id: string, pipeline: Omit<Pipeline, "id">): void
}

const useStore = create<State>()(
  logger(
    persist(
      immer((set, get) => ({
        metaNodes: [] as MetaNode[],
        pipelines: [] as Pipeline[],

        async addMetaNode(metaNodeStr) {
          const metaNode = await generateMetaNode(metaNodeStr)
          set((state) => {
            state.metaNodes.push(metaNode)
          })
        },
        installMetaNode(metaNode) {
          const localMetaNode = selectMetaNode(metaNode.id)(get())
          if (localMetaNode) {
            return
          }
          set((state) => {
            state.metaNodes.push(metaNode)
          })
        },
        removeMetaNode(id, related = true) {
          set((state) => {
            state.metaNodes = state.metaNodes.filter((item) => item.id !== id)
            if (related) {
              // also remove the pipelines that contains the id
              state.pipelines = state.pipelines.filter(
                (pipeline) => pipeline.nodes.findIndex((item) => item.metaId === id) === -1
              )
            }
          })
        },
        async updateMetaNode(id, metaNodeStr) {
          const metaNode = await generateMetaNode(metaNodeStr, id)
          set((state) => {
            const toBeUpdatedIndex = state.metaNodes.findIndex((item) => item.id === id)
            if (toBeUpdatedIndex === -1) return
            state.metaNodes[toBeUpdatedIndex] = metaNode
          })
        },
        addPipeline(pipeline) {
          set((state) => {
            state.pipelines.push(generatePipeline(pipeline))
          })
        },
        installPipeline(bundledPipeline) {
          const state = get()
          const localPipeline = selectPipeline(bundledPipeline.id)(state)
          if (localPipeline) {
            return
          }
          set((state) => {
            const relatedMetaNodes = getRelatedMetaNodes(bundledPipeline)
            relatedMetaNodes.forEach((metaNode) => {
              state.metaNodes.push(metaNode)
            })
            state.pipelines.push(bundledPipeline)
          })
        },
        updatePipeline(id, pipeline) {
          set((state) => {
            const toBeUpdatedIndex = state.pipelines.findIndex((item) => item.id === id)
            if (toBeUpdatedIndex === -1) return
            state.pipelines[toBeUpdatedIndex] = generatePipeline(pipeline)
          })
        },
        removePipeline(id, related = true) {
          set((state) => {
            const toBeRemovedPipeline = state.pipelines.find((item) => item.id)
            state.pipelines = state.pipelines.filter((item) => item.id !== id)
            if (related) {
              const metaNodeOnlyUsed: string[] = []
              toBeRemovedPipeline?.nodes.forEach((item) => {
                if (!state.pipelines.some((p) => p.nodes.some((n) => n.metaId === item.metaId))) {
                  metaNodeOnlyUsed.push(item.metaId)
                }
              })
              if (metaNodeOnlyUsed.length > 0) {
                state.metaNodes = state.metaNodes.filter(
                  (item) => !metaNodeOnlyUsed.includes(item.id)
                )
              }
            }
          })
        },
        runPipeline(id, input) {
          const { pipelines, metaNodes } = get()
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
              metaNode,
              ...node,
            }
          })
          const bundledPipeline: BundledPipeline = {
            ...pipeline,
            nodes: nodesWithMeta,
          }
          return runPipeline(bundledPipeline, input)
        },
      })),
      persistOptions
    )
  )
)
export default useStore
