import MonacoEditor, { BeforeMount, EditorProps, Monaco, loader } from "@monaco-editor/react"

import "monaco-editor/esm/vs/editor/editor.all.js"

import "monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js"
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js"
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js"
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js"
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js"
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js"
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js"
import "monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js"

import "monaco-editor/esm/vs/language/typescript/monaco.contribution"
// import 'monaco-editor/esm/vs/language/css/monaco.contribution';
// import 'monaco-editor/esm/vs/language/json/monaco.contribution';
// import 'monaco-editor/esm/vs/language/html/monaco.contribution';
// import 'monaco-editor/esm/vs/basic-languages/monaco.contribution';
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js"
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js"

import * as monaco from "monaco-editor/esm/vs/editor/editor.api"

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
// import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
// import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
// import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { NAMESPACE_TYPE } from "@/constants/codeEditor"

self.MonacoEnvironment = {
  getWorker(_, label) {
    // if (label === "json") {
    //   return new jsonWorker()
    // }
    // if (label === "css" || label === "scss" || label === "less") {
    //   return new cssWorker()
    // }
    // if (label === "html" || label === "handlebars" || label === "razor") {
    //   return new htmlWorker()
    // }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker()
    }
    return new editorWorker()
  },
}

loader.config({ monaco })

let _installed = false
const installTypes = (monaco: Monaco) => {
  if (_installed) return
  _installed = true
  // extra libraries
  var libSource = NAMESPACE_TYPE
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
      className="max-w-4xl min-w-[600px] min-h-[620px]"
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
