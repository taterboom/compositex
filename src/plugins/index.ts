import FetchPlugin from "./FetchPlugin"
import LodashGetPlugin from "./LodashGetPlugin"
import mainWorldPlugin from "./MainWorldPlugin"
import ShanbayOssPlugin from "./ShanbayOssPlugin"
import { Plugin } from "./type"

export const plugins = [mainWorldPlugin, LodashGetPlugin, FetchPlugin, ShanbayOssPlugin]

export function setupTerminal(plugins: Plugin[]) {
  plugins.forEach((plugin) => {
    plugin.terminal?.()
  })
}

export function setupContext<T>(plugins: Plugin[], context: T) {
  const pluginContext: any = {}
  plugins.forEach((plugin) => {
    pluginContext[plugin.name] = plugin.context
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
    if (plugin.contextType?.global) {
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
    .filter((plugin) => plugin.metaNodeRaw)
    .map((plugin) => ({
      id: plugin.name,
      _raw: plugin.metaNodeRaw,
    }))
}
