import { BundledPipeline } from "@/store/type"
import { isMetaNode } from "@/utils/helper"
import React, { useMemo, useState } from "react"
import { Panel } from "./common/Panel"
import { MetaNodeItem, PipelineItem } from "./ExplorePannel"

function ImportEditor() {
  const [jsonObject, setJsonObject] = useState<any | null>(null)
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
  const objects = useMemo(() => {
    if (jsonObject) {
      if (Array.isArray(jsonObject)) {
        return jsonObject
      } else {
        return [jsonObject]
      }
    }
    return []
  }, [jsonObject])
  return (
    <div>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-sm"
        accept=".json"
        onChange={handleChange}
      />
      {objects.map((item, index) =>
        isMetaNode(item) ? (
          <MetaNodeItem key={index} value={item} />
        ) : (
          <PipelineItem key={index} value={item} />
        )
      )}
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
