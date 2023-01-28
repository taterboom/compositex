import { TypeDefinition } from "@/store/type"

export function TypeDefinitionView({
  definition: definition,
  value,
  onChange,
}: {
  definition: TypeDefinition
  value?: any
  onChange?: (value: any) => void
}) {
  switch (definition.type) {
    case "enum": {
      if (!definition.enumItems) return null
      return (
        <select
          className="select w-full max-w-xs"
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value)
          }}
        >
          {definition.enumItems.map((enumItem) => (
            <option key={enumItem.value} value={enumItem.value}>
              {enumItem.name}
            </option>
          ))}
        </select>
      )
    }
    case "number":
      return (
        <input
          type="number"
          placeholder={definition.desc}
          className="input w-full max-w-xs"
          value={value}
          onChange={(e) => {
            onChange?.(e.target.valueAsNumber)
          }}
        />
      )
    case "string":
      return (
        <input
          type="text"
          placeholder={definition.desc}
          value={value}
          className="input w-full max-w-xs"
          onChange={(e) => {
            onChange?.(e.target.value)
          }}
        />
      )
    case "boolean":
      return (
        <input
          type="checkbox"
          className="checkbox"
          checked={value}
          onChange={(e) => {
            onChange?.(e.target.checked)
          }}
        />
      )
    default:
      return (
        <textarea
          className="textarea textarea-bordered"
          placeholder={definition.desc}
          value={value}
          onChange={(e) => {
            try {
              onChange?.(JSON.parse(e.target.value))
            } catch (err) {
              console.log(err)
              //
            }
          }}
        ></textarea>
      )
  }
}
