import FetchPlugin from "./FetchPlugin"
import LodashGetPlugin from "./LodashGetPlugin"
import mainWorldPlugin from "./MainWorldPlugin"
import { Plugin, PluginMetaNode } from "./type"

export const plugins = [mainWorldPlugin, LodashGetPlugin, FetchPlugin]

export function setupTerminal(plugins: Plugin[]) {
  plugins.forEach((plugin) => {
    plugin.terminal?.()
  })
}

export function setupContext<T>(plugins: Plugin[], context: T) {
  const pluginContext: any = {}
  plugins.forEach((plugin) => {
    if (plugin.context) {
      pluginContext[plugin.name] = plugin.context()
    }
  })
  return {
    ...pluginContext,
    ...context,
  }
}

export function setupTypeStr(plugins: Plugin[]) {
  let globalTypeStr = ""
  let contextTypeStr = ""
  plugins.forEach((plugin) => {
    if (plugin.contextType?.global) {
      globalTypeStr += plugin.contextType.global + "\n"
    }
    if (plugin.contextType?.context) {
      contextTypeStr += `${plugin.name}: ${plugin.contextType.context}` + "\n"
    }
  })
  return {
    global: globalTypeStr,
    context: contextTypeStr,
  }
}

export function setupMetaNode(plugins: Plugin[]) {
  return plugins
    .map((plugin) => plugin.metaNodes)
    .filter(Boolean)
    .flat() as PluginMetaNode[]
}
