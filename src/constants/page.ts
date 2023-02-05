export const PANEL = {
  PIPELINE: "pipeline",
  NODE: "node",
  EXPLORE: "explore",
  IMPORT: "import",
  SETTINGS: "settings",
}

export function getCurrentPanel(panelStr: string) {
  const { PIPELINE, ...otherPanels } = PANEL
  if (panelStr in otherPanels) {
    return panelStr
  }
  return PIPELINE
}

export function generatePanelLink(p: string, query: Record<string, string | number> = {}) {
  const querys = Object.entries(query).map(
    ([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value)
  )
  return `${p}${querys.length > 0 ? `?${querys.join("&")}` : ""}`
}
