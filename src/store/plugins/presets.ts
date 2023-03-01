import SayHello from "@/presets/say-hello.json"

const presets = [SayHello]

const LOCAL_KEY = "compositex-presets-delete"

function getLocalDeleteIds(): string[] {
  const localStr = localStorage.getItem(LOCAL_KEY) || ""
  try {
    const getLocalDeleteIds = JSON.parse(localStr)
    if (!Array.isArray(getLocalDeleteIds)) {
      throw new Error("not Array type")
    }
    return getLocalDeleteIds
  } catch (err) {
    return []
  }
}

export function isPreset(id: string) {
  return presets.some((item) => item.id === id)
}

export function getPresets() {
  const ids = getLocalDeleteIds()
  return presets.filter((item) => !ids.some((id) => item.id === id))
}

export function deletePreset(id: string) {
  const ids = getLocalDeleteIds()
  localStorage.setItem(LOCAL_KEY, JSON.stringify(ids.concat([id])))
}
