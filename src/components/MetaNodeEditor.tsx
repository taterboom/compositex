import { DEMO } from "@/constants/codeEditor"
import { useRef } from "react"
import Editor from "./common/CodeEditor"

type MetaNodeEditorProps = {
  value?: string
  onSubmit?: (value: string) => void
}
export function MetaNodeEditor(props: MetaNodeEditorProps) {
  const ref = useRef<string>(props.value ?? DEMO)

  return (
    <div className="space-y-4">
      <div>
        <button className="btn btn-wide btn-primary" onClick={() => props.onSubmit?.(ref.current)}>
          Save
        </button>
      </div>
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
