import { selectMetaNode, selectPipeline } from "@/store/selectors"
import { BundledPipeline, MetaNode } from "@/store/type"
import useStore from "@/store/useStore"
import { getRelatedMetaNodes } from "@/utils/helper"
import { useMemo } from "react"
import { MaterialSymbolsDownloadDoneRounded, MaterialSymbolsDownloadRounded } from "./icons"
import clsx from "classnames"
import { InspectLink } from "./InspectLink"

function TinyMetaNode(props: { value: MetaNode; index: number }) {
  const localMetaNode = useStore(selectMetaNode(props.value.id))
  // return (
  //   <div className="flex space-x-1">
  //     <InspectLink value={props.value}>{props.value.config.name}</InspectLink>
  //     <div> Installed? {localMetaNode ? "YES" : "NO"}</div>
  //   </div>
  // )
  return (
    <tr>
      <th>{props.index}</th>
      <td>{props.value.config.name}</td>
      <td>
        {localMetaNode ? (
          <span className="text-success">✓</span>
        ) : (
          <span className="text-error">✗</span>
        )}
      </td>
      <td>
        {props.value.config.desc} {props.value.config.desc}
      </td>
    </tr>
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
      className={clsx("card max-w-[480px] p-4 bg-base-300 shadow-xl gap-2", props.className)}
    >
      <InspectLink className="text-lg font-semibold" value={pipeline}>
        {pipeline.name}
      </InspectLink>
      <div className="text-base-content/70">{pipeline.desc}</div>
      {relatedMetaNodes.length > 0 && (
        <div>
          <div className="dropdown">
            <label tabIndex={0} className="text-info/70 text-sm cursor-pointer">
              {relatedMetaNodes.length} Nodes included
            </label>
            <div
              tabIndex={0}
              className="dropdown-content w-72 overflow-x-auto base-200 border-edge rounded"
            >
              <table className="table table-compact max-w-2xl">
                <thead>
                  <tr>
                    <th></th>
                    <th>name</th>
                    <th>installed</th>
                    <th>desc</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedMetaNodes.map((metaNode, index) => (
                    <TinyMetaNode key={metaNode.id} value={metaNode} index={index}></TinyMetaNode>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <button
        className={clsx(
          "btn btn-sm btn-primary gap-2 !mt-auto",
          localPipeline ? "btn-disabled" : ""
        )}
        onClick={() => {
          if (localPipeline) {
            alert("Already Installed!")
            return
          }
          installPipeline(props.value)
        }}
      >
        {localPipeline ? (
          <>
            <MaterialSymbolsDownloadDoneRounded />
            Installed
          </>
        ) : (
          <>
            <MaterialSymbolsDownloadRounded />
            Install
          </>
        )}
      </button>
    </div>
  )
}
