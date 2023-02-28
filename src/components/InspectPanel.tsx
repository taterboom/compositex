import useStore from "@/store/useStore"
import { isMetaNode } from "@/utils/helper"
import { Inspect } from "./common/Inspect"
import { Panel } from "./common/Panel"
import { MetaNodeEditor } from "./MetaNodeEditor"
import { PipelineEditor } from "./PipelineEditor"

function InspectPanel() {
  const currentInspectObject = useStore((state) => state.currentInspectObject)

  if (!currentInspectObject) return null

  return (
    <Panel>
      <Inspect object={currentInspectObject} />
    </Panel>
  )
}

export default InspectPanel
