import { DEMO } from "@/constants/codeEditor"
import { useRef } from "react"
import Editor from "./common/CodeEditor"

type MetaNodeEditorProps = {
  value?: string
  onSubmit?: (value: string) => void
  onCancel?: (value: string) => void
  displayOnly?: boolean
  cancelable?: boolean
}
export function MetaNodeEditor(props: MetaNodeEditorProps) {
  const ref = useRef<string>(props.value ?? DEMO)

  return (
    <div className="space-y-4">
      {!props.displayOnly && (
        <div className="space-x-4">
          <button className="btn btn-wide" onClick={() => props.onCancel?.(ref.current)}>
            Cancel
          </button>
          <button
            className="btn btn-wide btn-primary"
            onClick={() => props.onSubmit?.(ref.current)}
          >
            Save
          </button>
        </div>
      )}
      <div className="">
        <Editor
          value={props.value}
          defaultValue={ref.current}
          onChange={(v) => {
            ref.current = v || ""
          }}
        />
      </div>
    </div>
  )
}
