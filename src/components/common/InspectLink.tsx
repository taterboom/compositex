import { PANEL } from "@/constants/page"
import useStore from "@/store/useStore"
import { useNavigate } from "react-router-dom"
import clsx from "classnames"

export function InspectLink(props: React.PropsWithChildren<{ value: any; className?: string }>) {
  const navigate = useNavigate()
  const updateCurrentInspectObject = useStore((state) => state.updateCurrentInspectObject)
  const onInspect = () => {
    updateCurrentInspectObject(props.value)
    navigate(`/${PANEL.INSPECT}`)
  }
  return (
    <a className={clsx("link link-hover", props.className)} onClick={onInspect}>
      {props.children}
    </a>
  )
}
