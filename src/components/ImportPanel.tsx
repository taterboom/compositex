import { BundledPipeline } from "@/store/type"
import React, { useState } from "react"
import { Panel } from "./common/Panel"
import { PipelineItem } from "./ExplorePannel"

function ImportEditor() {
  const [jsonObject, setJsonObject] = useState<BundledPipeline | null>(null)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      const result = e.target?.result
      if (typeof result !== "string") {
        return
      }
      try {
        setJsonObject(JSON.parse(result))
      } catch (err) {
        console.log("[Parse]", err)
        alert("Can not parse the file which includes invalid content.")
      }
    }
    fileReader.readAsText(file)
  }
  return (
    <div>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-sm"
        accept=".json"
        onChange={handleChange}
      />
      {jsonObject && <PipelineItem value={jsonObject} />}
    </div>
  )
}

export function ImportPanel() {
  return (
    <Panel>
      <ImportEditor></ImportEditor>
    </Panel>
  )
}
