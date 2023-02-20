import { selectMetaNode, selectPipeline } from "@/store/selectors"
import { BundledPipeline, MetaNode } from "@/store/type"
import useStore from "@/store/useStore"
import { getRelatedMetaNodes } from "@/utils/helper"
import { useMemo } from "react"
import { MaterialSymbolsDownloadDoneRounded, MaterialSymbolsDownloadRounded } from "./icons"
import clsx from "classnames"
import { InspectLink } from "./InspectLink"

function TinyMetaNode(props: { value: MetaNode }) {
  const localMetaNode = useStore(selectMetaNode(props.value.id))
  return (
    <div className="flex space-x-1">
      <InspectLink value={props.value}>{props.value.config.name}</InspectLink>
      <div> Installed? {localMetaNode ? "YES" : "NO"}</div>
    </div>
  )
}

export function PipelineItem(props: { value: BundledPipeline; className?: string }) {
  const pipeline = props.value
  const localPipeline = useStore(selectPipeline(props.value.id))
  const installPipeline = useStore((state) => state.installPipeline)
  const relatedMetaNodes = useMemo(() => getRelatedMetaNodes(pipeline), [pipeline])
  return (
    <div
      key={pipeline.id}
      className={clsx(
        "card max-w-[480px] p-4 mt-4 bg-base-300 shadow-xl space-y-2",
        props.className
      )}
    >
      <InspectLink className="text-lg font-semibold" value={pipeline}>
        {pipeline.name}
      </InspectLink>
      <div>{pipeline.desc}</div>
      <div>installed? {localPipeline ? "YES" : "NO"}</div>
      <div>
        {relatedMetaNodes.map((metaNode) => (
          <TinyMetaNode key={metaNode.id} value={metaNode}></TinyMetaNode>
        ))}
      </div>
      <button
        className={clsx("btn", localPipeline ? "btn-disabled" : "")}
        onClick={() => {
          if (localPipeline) {
            alert("Already Installed!")
          }
          installPipeline(props.value)
        }}
      >
        {localPipeline ? (
          <MaterialSymbolsDownloadDoneRounded />
        ) : (
          <MaterialSymbolsDownloadRounded />
        )}
      </button>
    </div>
  )
}
