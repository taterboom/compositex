import { saveAs } from "file-saver"

export function saveJSON(object: any, fileName: string = `compositex-${Date.now()}`) {
  const fileToSave = new Blob([JSON.stringify(object)], {
    type: "application/json",
  })
  saveAs(fileToSave, fileName)
}
