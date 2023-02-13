import { selectMetaNode } from "@/store/selectors"
import { MetaNode } from "@/store/type"
import useStore from "@/store/useStore"
import { MaterialSymbolsDownloadDoneRounded, MaterialSymbolsDownloadRounded } from "./icons"
import clsx from "classnames"
import { InspectLink } from "./InspectLink"

export function MetaNodeItem(props: { value: MetaNode }) {
  const metaNode = props.value
  const localMetaNode = useStore(selectMetaNode(props.value.id))
  const installMetaNode = useStore((state) => state.installMetaNode)
  return (
    <div className="card max-w-[480px] p-4 mt-4 bg-base-200 shadow-xl space-y-2">
      <InspectLink className="text-lg font-semibold" value={metaNode}>
        {metaNode.config.name}
      </InspectLink>
      <div>{metaNode.config.desc}</div>
      <div>Installed? {localMetaNode ? "YES" : "NO"}</div>
      <button
        className={clsx("btn", localMetaNode ? "btn-disabled" : "")}
        onClick={() => {
          if (localMetaNode) {
            alert("Already Installed!")
          }
          installMetaNode(props.value)
        }}
      >
        {localMetaNode ? (
          <MaterialSymbolsDownloadDoneRounded />
        ) : (
          <MaterialSymbolsDownloadRounded />
        )}
      </button>
    </div>
  )
}
