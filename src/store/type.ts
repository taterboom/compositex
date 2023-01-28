export type TypeDefinition = {
  type: "string" | "number" | "boolean" | "json" | "enum" | "any"
  enumItems?: { name: string; value: string }[]
  default?: any
  desc?: string
}

export type Option = { name: string } & TypeDefinition

export type MetaNode = {
  _raw: string
  id: string
  config: {
    name: string
    desc?: string
    input?: TypeDefinition
    output?: TypeDefinition
    options?: Option[]
  }
  run(input: any, options: Record<string, any>): any
}

export type Node = {
  metaId: string
  name?: string
  options?: Record<string, any>
}

export type IdentityNode = { id: string } & Node

export type Pipeline = {
  id: string
  name?: string
  desc?: string
  nodes: Node[]
}

export type BundledPipeline = Omit<Pipeline, "nodes"> & {
  nodes: Array<Node & { metaNode: MetaNode }>
}
