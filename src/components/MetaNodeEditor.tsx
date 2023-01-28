import { DEMO } from "@/utils/helper"
import { useRef } from "react"
import Editor from "./common/CodeEditor"

type MetaNodeEditorProps = {
  value?: string
  onSubmit?: (value: string) => void
}
export function MetaNodeEditor(props: MetaNodeEditorProps) {
  const ref = useRef<string>(props.value ?? DEMO)

  return (
    <div>
      <Editor
        value={props.value}
        defaultValue={ref.current}
        onChange={(v) => {
          ref.current = v || ""
        }}
      />
      <div>
        <button className="btn" onClick={() => props.onSubmit?.(ref.current)}>
          Save
        </button>
      </div>
    </div>
  )
}
