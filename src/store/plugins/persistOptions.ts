import { plugins, setupMetaNode } from "@/plugins"
import { generateMetaNode } from "@/utils/helper"

const pluginMetaNodes = setupMetaNode(plugins)

export const persistOptions = {
  name: "composite-x",
  storage: {
    getItem: async (name: string) => {
      try {
        const str = localStorage.getItem(name)
        let state: any
        try {
          state = JSON.parse(str!).state
        } catch (err) {
          state = {}
        }
        let localMetaNodes: any[] = []
        if (state.metaNodes?.length > 0) {
          const unInstalledPluginMetaNodes = pluginMetaNodes.filter((pluginMetaNode) =>
            state.metaNodes.every((item: any) => item.id !== pluginMetaNode.id)
          )
          localMetaNodes = unInstalledPluginMetaNodes.concat(state.metaNodes)
        } else {
          localMetaNodes = pluginMetaNodes
        }
        // TODO patch generate
        const metaNodes = await Promise.all(
          localMetaNodes.map((item: any) => generateMetaNode(item._raw, item.id))
        )
        console.log("initial from storage", metaNodes)
        return {
          state: {
            ...state,
            metaNodes,
          },
        }
      } catch (err) {
        console.log("init error", err)
        throw err
      }
    },
    setItem: (name: string, newValue: any) => {
      const str = JSON.stringify({
        state: {
          ...newValue.state,
          metaNodes: newValue.state.metaNodes.map((item: any) => ({
            id: item.id,
            _raw: item._raw,
          })),
        },
      })
      localStorage.setItem(name, str)
    },
    removeItem: (name: string) => localStorage.removeItem(name),
  },
}
