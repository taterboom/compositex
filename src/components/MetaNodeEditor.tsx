import { DEMO } from "@/constants/codeEditor"
import { useEffect, useRef, useState } from "react"
import Editor from "./common/CodeEditor"
import clsx from "classnames"
import { BlockNavigationConfirm } from "./common/BlockNavigationConfirm"

type MetaNodeEditorProps = {
  value?: string
  onSubmit?: (value: string) => void
  onCancel?: (value: string) => void
  displayOnly?: boolean
  cancelable?: boolean
  handlerClassName?: string
}
export function MetaNodeEditor(props: MetaNodeEditorProps) {
  const initialValue = props.value ?? DEMO
  const ref = useRef<string>(initialValue)

  const [blocked, setBlocked] = useState(false)

  const [candidateData, setCandidateData] = useState<null | string>(null)
  const isBlocked = !candidateData && blocked

  useEffect(() => {
    if (candidateData) {
      props.onSubmit?.(candidateData)
    }
  }, [candidateData])

  return (
    <div className="space-y-4">
      <div className="">
        <Editor
          value={props.value}
          defaultValue={ref.current}
          options={{ readOnly: props.displayOnly }}
          onChange={(v) => {
            ref.current = v || ""
            setBlocked(ref.current !== initialValue)
          }}
        />
      </div>
      {!props.displayOnly && (
        <div className={clsx("flex justify-end space-x-4", props.handlerClassName)}>
          <button className="btn btn-sm" onClick={() => props.onCancel?.(ref.current)}>
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setCandidateData(ref.current)
            }}
          >
            Save
          </button>
        </div>
      )}
      <BlockNavigationConfirm isBlocked={isBlocked} />
    </div>
  )
}
