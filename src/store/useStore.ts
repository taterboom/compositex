import {
  generateMetaNode,
  generatePipeline,
  getRelatedMetaNodes,
  runPipeline,
} from "@/utils/helper"
import { saveJSON } from "@/utils/save"
import { generateTimeStr } from "@/utils/time"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { logger } from "./plugins/logger"
import { persistOptions } from "./plugins/persistOptions"
import {
  selectBundledPipeline,
  selectMetaNode,
  selectMetaNodesOnlyUsedByPipeline,
  selectPipeline,
  selectPipelinesWithMetaNodeIds,
} from "./selectors"
import { BundledPipeline, MetaNode, Pipeline, ProgressItem } from "./type"

export type State = {
  metaNodes: MetaNode[]
  pipelines: Pipeline[]
  pins: string[]
  addMetaNode(metaNodeStr: string): Promise<void>
  installMetaNode(metaNode: MetaNode): void
  removeMetaNode(id: string, related?: boolean): void
  updateMetaNode(id: string, metaNodeStr: string): Promise<void>
  exportMetaNode(id: string): void
  addPipeline(pipeline: Omit<Pipeline, "id">): void
  installPipeline(bundledPipeline: BundledPipeline): void
  runPipeline(id: string, input: any, onProgress?: (data: ProgressItem) => void): Promise<any>
  removePipeline(id: string, related?: boolean): void
  updatePipeline(id: string, pipeline: Omit<Pipeline, "id">): void
  exportPipeline(id: string): void
  export(): void
  togglePin(id: string): void
}

const useStore = create<State>()(
  logger(
    persist(
      immer((set, get) => ({
        metaNodes: [] as MetaNode[],
        pipelines: [] as Pipeline[],
        pins: [] as string[],

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
        removeMetaNode(id, related = false) {
          const state = get()
          if (related) {
            // also remove the pipelines that contains the id
            const relatedPipelines = selectPipelinesWithMetaNodeIds([id])(state)
            relatedPipelines.forEach((item) => {
              state.removePipeline(item.id)
            })
          }
          set((state) => {
            state.metaNodes = state.metaNodes.filter((item) => item.id !== id)
            state.pins = state.pins.filter((item) => item !== id)
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
        exportMetaNode(id) {
          const metaNode = selectMetaNode(id)(get())
          if (!metaNode) return
          return saveJSON(metaNode, metaNode.config.name)
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
          const relatedMetaNodes = getRelatedMetaNodes(bundledPipeline)
          relatedMetaNodes.forEach((toBeInstalledMetaNode) => {
            state.installMetaNode(toBeInstalledMetaNode)
          })
          set((state) => {
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
        removePipeline(id, related = false) {
          const state = get()
          if (related) {
            const metaNodeOnlyUsed = selectMetaNodesOnlyUsedByPipeline(id)(state)
            metaNodeOnlyUsed.forEach((item) => state.removeMetaNode(item.id))
          }
          set((state) => {
            state.pipelines = state.pipelines.filter((item) => item.id !== id)
            state.pins = state.pins.filter((item) => item !== id)
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
        export() {
          const state = get()
          const bundledPipelines = state.pipelines.map((item) =>
            selectBundledPipeline(item.id)(state)
          )
          const metaNodes = state.metaNodes
          return saveJSON(
            [...bundledPipelines, ...metaNodes],
            `compositex-backup-${generateTimeStr()}`
          )
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
