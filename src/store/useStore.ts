import {
  generateMetaNode,
  generatePipeline,
  getRelatedMetaNodes,
  runPipeline,
} from "@/utils/helper"
import { saveJSON } from "@/utils/save"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { logger } from "./plugins/logger"
import { persistOptions } from "./plugins/persistOptions"
import { selectBundledPipeline, selectMetaNode, selectPipeline } from "./selectors"
import { BundledPipeline, MetaNode, Pipeline, ProgressItem } from "./type"

export type State = {
  metaNodes: MetaNode[]
  pipelines: Pipeline[]
  pins: string[]
  addMetaNode(metaNodeStr: string): Promise<void>
  installMetaNode(metaNode: MetaNode): void
  removeMetaNode(id: string, related?: boolean): void
  updateMetaNode(id: string, metaNodeStr: string): Promise<void>
  addPipeline(pipeline: Omit<Pipeline, "id">): void
  installPipeline(bundledPipeline: BundledPipeline): void
  runPipeline(id: string, input: any, onProgress?: (data: ProgressItem) => void): Promise<any>
  removePipeline(id: string, related?: boolean): void
  updatePipeline(id: string, pipeline: Omit<Pipeline, "id">): void
  exportPipeline(id: string): void
  togglePin(id: string): void
}

const useStore = create<State>()(
  logger(
    persist(
      immer((set, get) => ({
        metaNodes: [] as MetaNode[],
        pipelines: [] as Pipeline[],
        pins: [],

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
              state.pipelines = state.pipelines.filter((pipeline) =>
                pipeline.nodes.every((item) => item.metaId !== id)
              )
              state.pins = state.pins.filter((item) => item !== id)
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
            relatedMetaNodes.forEach((toBeInstalledMetaNode) => {
              // check if already install metaNodes
              if (state.metaNodes.every((item) => item.id !== toBeInstalledMetaNode.id)) {
                state.metaNodes.push(toBeInstalledMetaNode)
              }
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
                state.pins = state.pins.filter((item) => !metaNodeOnlyUsed.includes(item))
              }
            }
          })
        },
        runPipeline(id, input, onProgress) {
          const bundledPipeline = selectBundledPipeline(id)(get())
          return runPipeline(bundledPipeline, input, onProgress)
        },
        exportPipeline(id) {
          const bundledPipeline = selectBundledPipeline(id)(get())
          saveJSON(bundledPipeline, bundledPipeline.name)
        },
        togglePin(id) {
          set((state) => {
            if (state.pins.includes(id)) {
              state.pins = state.pins.filter((item) => item !== id)
            } else {
              state.pins = state.pins.concat(id)
            }
          })
        },
      })),
      persistOptions
    )
  )
)
export default useStore
