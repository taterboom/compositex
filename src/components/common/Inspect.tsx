import { isMetaNode } from "@/utils/helper"
import { MetaNodeEditor } from "../MetaNodeEditor"
import { PipelineEditor } from "../PipelineEditor"
import { Popup } from "./Popup"
import clsx from "classnames"
import { useState } from "react"

export function Inspect(props: { object: any; pipelineEditorClassName?: string }) {
  return (
    <>
      {isMetaNode(props.object) ? (
        <MetaNodeEditor displayOnly value={props.object._raw} />
      ) : (
        <PipelineEditor
          displayOnly
          value={props.object}
          className={props.pipelineEditorClassName}
        />
      )}
    </>
  )
}

export function InspectPopup(props: { object: any; open: boolean; onClose?: () => void }) {
  const currentInspectObject = props.object

  return (
    <Popup open={props.open} closeable onClose={props.onClose}>
      <Inspect object={currentInspectObject} pipelineEditorClassName="h-[80vh]" />
    </Popup>
  )
}

export function InspectLink(props: React.PropsWithChildren<{ value: any; className?: string }>) {
  const [popupVisible, setPopupVisible] = useState(false)
  // const navigate = useNavigate()
  // const updateCurrentInspectObject = useStore((state) => state.updateCurrentInspectObject)
  // const onInspect = () => {
  //   updateCurrentInspectObject(props.value)
  //   navigate(`/${PANEL.INSPECT}`)
  // }
  return (
    <>
      <a
        className={clsx("link link-hover", props.className)}
        onClick={() => {
          setPopupVisible(true)
        }}
      >
        {props.children}
      </a>
      <InspectPopup
        open={popupVisible}
        onClose={() => {
          setPopupVisible(false)
        }}
        object={props.value}
      />
    </>
  )
}
