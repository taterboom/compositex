import { DEMO } from "@/constants/codeEditor"
import { useRef } from "react"
import Editor from "./common/CodeEditor"
import clsx from "classnames"

type MetaNodeEditorProps = {
  value?: string
  onSubmit?: (value: string) => void
  onCancel?: (value: string) => void
  displayOnly?: boolean
  cancelable?: boolean
  handlerClassName?: string
}
export function MetaNodeEditor(props: MetaNodeEditorProps) {
  const ref = useRef<string>(props.value ?? DEMO)

  return (
    <div className="space-y-4">
      <div className="">
        <Editor
          value={props.value}
          defaultValue={ref.current}
          onChange={(v) => {
            ref.current = v || ""
          }}
        />
      </div>
      {!props.displayOnly && (
        <div className={clsx("flex justify-end space-x-4", props.handlerClassName)}>
          <button className="btn btn-sm" onClick={() => props.onCancel?.(ref.current)}>
            Cancel
          </button>
          <button className="btn btn-sm btn-primary" onClick={() => props.onSubmit?.(ref.current)}>
            Save
          </button>
        </div>
      )}
    </div>
  )
}
