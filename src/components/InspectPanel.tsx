import { MetaNode } from "@/store/type"
import useStore from "@/store/useStore"
import { isMetaNode } from "@/utils/helper"
import Editor from "./common/CodeEditor"
import { Panel } from "./common/Panel"
import { MetaNodeEditor } from "./MetaNodeEditor"
import { PipelineEditor } from "./PipelineEditor"

function InspectPanel() {
  const currentInspectObject = useStore((state) => state.currentInspectObject)

  if (!currentInspectObject) return null

  return (
    <Panel>
      {isMetaNode(currentInspectObject) ? (
        <MetaNodeEditor displayOnly value={currentInspectObject._raw} />
      ) : (
        <PipelineEditor displayOnly value={currentInspectObject} />
      )}
    </Panel>
  )
}

export default InspectPanel
