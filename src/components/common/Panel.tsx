import React from "react"

export function Panel({ children }: React.PropsWithChildren) {
  return <div className="p-4 bg-base-100">{children}</div>
}
