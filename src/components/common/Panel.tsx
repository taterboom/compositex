import React from "react"
import clsx from "classnames"

export function Panel(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  return (
    <div {...props} className={clsx(`p-4 `, props.className)}>
      {props.children}
    </div>
  )
}
