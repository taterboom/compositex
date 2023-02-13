import { MESSAGE_INSTALL_FROM_WEBSITE_REQUEST } from "@/constants/message"
import { isMetaNode } from "@/utils/helper"
import { useEffect, useMemo, useState } from "react"
import { Panel } from "./common/Panel"
import { PipelineItem } from "./common/PipelineItem"
import { MetaNodeItem } from "./common/MetaNodeItem"

function ExternalInstallPanel() {
  const [jsonObject, setJsonObject] = useState<any | null>(null)
  useEffect(() => {
    chrome.runtime.sendMessage({ type: MESSAGE_INSTALL_FROM_WEBSITE_REQUEST }).then(setJsonObject)
  }, [])
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
    <Panel>
      {objects.map((item, index) =>
        isMetaNode(item) ? (
          <MetaNodeItem key={index} value={item} />
        ) : (
          <PipelineItem key={index} value={item} />
        )
      )}
    </Panel>
  )
}

export default ExternalInstallPanel
