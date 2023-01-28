import MonacoEditor, { BeforeMount, EditorProps, Monaco } from "@monaco-editor/react"

let _installed = false
const installTypes = (monaco: Monaco) => {
  if (_installed) return
  _installed = true
  // extra libraries
  var libSource = `
declare namespace CompositeX {
    export type TypeDefinition = {
        type: "string" | "number" | "boolean" | "json" | "enum" | "any"
        enumItems?: { name: string; value: string }[]
        default?: any
        desc?: string
    }
    export type Option = { name: string } & TypeDefinition
    export type MetaNodeConfig = {
        config: {
            name: string
            input?: TypeDefinition
            output?: TypeDefinition
            options?: Option[]
        }
        run(input: any, options: Record<string, any>): any
    }
}`
  var libUri = "ts:filename/composite-x.d.ts"
  monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri)
  // When resolving definitions and references, the editor will try to use created models.
  // Creating a model for the library allows "peek definition/references" commands to work with the library.
  monaco.editor.createModel(libSource, "javascript", monaco.Uri.parse(libUri))
}

const Editor: React.FC<EditorProps> = (props) => {
  const beforeMount: BeforeMount = (monaco) => {
    installTypes(monaco)
  }

  return (
    <MonacoEditor
      {...props}
      height={600}
      width={512}
      theme="vs-dark"
      language="javascript"
      options={{
        roundedSelection: true,
        minimap: { enabled: false },
        ...props.options,
      }}
      beforeMount={beforeMount}
    ></MonacoEditor>
  )
}

export default Editor
