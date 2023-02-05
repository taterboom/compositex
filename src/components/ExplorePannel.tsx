import { selectMetaNode, selectPipeline } from "@/store/selectors"
import { BundledPipeline, MetaNode, Pipeline } from "@/store/type"
import useStore from "@/store/useStore"
import { generateMetaNode, generatePipeline, getRelatedMetaNodes, isMetaNode } from "@/utils/helper"
import { useEffect, useMemo, useState } from "react"
import { MaterialSymbolsDownloadDoneRounded, MaterialSymbolsDownloadRounded } from "./common/icons"
import { Panel } from "./common/Panel"
import clsx from "classnames"

export function MetaNodeItem(props: { value: MetaNode }) {
  const metaNode = props.value
  const localMetaNode = useStore(selectMetaNode(props.value.id))
  const installMetaNode = useStore((state) => state.installMetaNode)
  return (
    <div className="card max-w-[480px] p-4 mt-4 bg-base-200 shadow-xl space-y-2">
      <div className="text-lg font-semibold">{metaNode.config.name}</div>
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

function TinyMetaNode(props: { value: MetaNode }) {
  const localMetaNode = useStore(selectMetaNode(props.value.id))
  return (
    <div className="flex space-x-1">
      <div>{props.value.config.name}</div>
      <div> Installed? {localMetaNode ? "YES" : "NO"}</div>
    </div>
  )
}

export function PipelineItem(props: { value: BundledPipeline }) {
  const pipeline = props.value
  const localPipeline = useStore(selectPipeline(props.value.id))
  const installPipeline = useStore((state) => state.installPipeline)
  const relatedMetaNodes = useMemo(() => getRelatedMetaNodes(pipeline), [pipeline])
  return (
    <div key={pipeline.id} className="card max-w-[480px] p-4 mt-4 bg-base-200 shadow-xl space-y-2">
      <div>{pipeline.name}</div>
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

export function ExplorePannel() {
  const [objects, setObjects] = useState<Array<MetaNode | BundledPipeline>>([])

  useEffect(() => {
    const init = async () => {
      const demoMetaNode = await generateMetaNode(
        `(function () {
          /** @type {CompositeX.MetaNodeConfig} */
          const nodeConfig = {
            config: {
              name: "DefaultValue",
              input: { type: "number" },
              output: { type: "number" },
              options: [{ name: "value", type: "any", default: 1 }],
            },
            run(input, options) {
              return input ?? options.value
            },
          }
          return nodeConfig
        })()`,
        "from-explore-0"
      )
      const demoPipeline = generatePipeline({
        id: "from-explore-1",
        name: "Test DefaultValue",
        nodes: [{ metaId: "from-explore-0", options: { value: 2 } }],
      })
      const demoBundledPipeline = {
        ...demoPipeline,
        nodes: [
          {
            ...demoPipeline.nodes[0],
            metaNode: demoMetaNode,
          },
        ],
      }
      return [demoMetaNode, demoBundledPipeline]
    }
    init().then(setObjects)
  }, [])

  return (
    <Panel>
      <div>
        {objects.map((item) =>
          isMetaNode(item) ? (
            <MetaNodeItem key={item.id} value={item} />
          ) : (
            <PipelineItem key={item.id} value={item} />
          )
        )}
      </div>
    </Panel>
  )
}
