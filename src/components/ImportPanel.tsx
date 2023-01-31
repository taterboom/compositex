import { generatePanelLink, PANEL } from "@/constants/page"
import { selectMetaNode, selectPipeline } from "@/store/selectors"
import { BundledPipeline, Pipeline } from "@/store/type"
import useStore from "@/store/useStore"
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom"
import React, { useRef, useState } from "react"
import { Panel } from "./common/Panel"
import { PipelineEditor } from "./PipelineEditor"
import { TypeDefinitionView } from "./TypeDefinitionView"
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
        className="file-input w-full max-w-xs"
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
      <div>Import Panel</div>
      <ImportEditor></ImportEditor>
    </Panel>
  )
}
