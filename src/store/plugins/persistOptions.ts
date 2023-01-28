import { generateMetaNode } from "@/utils/helper"

export const persistOptions = {
  name: "composite-x",
  storage: {
    getItem: (name: string) => {
      const str = localStorage.getItem(name)
      const state = JSON.parse(str!).state
      return {
        state: {
          ...JSON.parse(str!).state,
          metaNodes: state.metaNodes.map((item: any) => generateMetaNode(item._raw, item.id)),
        },
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
