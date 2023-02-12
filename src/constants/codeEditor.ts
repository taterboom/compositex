import { plugins, setupTypeStr } from "@/plugins"

const pluginsContextType = setupTypeStr(plugins)

export const NAMESPACE_TYPE = `
declare namespace CompositeX {
    ${pluginsContextType.global}
    export type RunningContext = {
      ${pluginsContextType.context}
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
