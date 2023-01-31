export const NAMESPACE_TYPE = `
declare namespace CompositeX {
    export type FetchResult = {
      ok: boolean
      status: number
      data: any
    }
    export type RunningContext = {
      fetch: (...args: any[]) => Promise<FetchResult>
      alioss: (payload: { file: File; service: string }) => Promise<string>
      mainWorld: (expression: string) => Promise<any>
    }
    export type TypeDefinition = {
        type: "string" | "number" | "boolean" | "json" | "enum" | "any"
        enumItems?: { name: string; value: string }[]
        desc?: string
    }
    export type Option = {
      name: string
      default?: any
    } & TypeDefinition
    export type MetaNodeConfig = {
        config: {
            name: string
            input?: TypeDefinition
            output?: TypeDefinition
            options?: Option[]
        }
        run(input: any, options: Record<string, any>, context: RunningContext): any
    }
}`

export const DEMO = `(function () {
  /** @type {CompositeX.MetaNodeConfig} */
  const nodeConfig = {
      config: {
          name: "Increase",
          desc: "Increase number",
          input: { type: "number" },
          output: { type: "number" },
          options: [
              { name: "step", type: "number", default: 1 },
          ],
      },
      run(input, options, context) {
          // you can return promise
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(input + options.step)
            }, 1000);
          })
      }
  }
  return nodeConfig
})()`
