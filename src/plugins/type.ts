export type Plugin = {
  name: string
  terminal?: (...args: any[]) => any // install terminal in extension pages
  context?: (...args: any[]) => any // install context in sandbox
  contextType?: {
    // composite type string for code editor
    global?: string
    context?: string
  } // for typescript definition
  metaNodeRaw?: string // built-in metaNode
}
