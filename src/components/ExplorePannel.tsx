import { selectMetaNode, selectPipeline } from "@/store/selectors"
import { BundledPipeline, MetaNode, Pipeline } from "@/store/type"
import useStore from "@/store/useStore"
import { generateMetaNode, generatePipeline, getRelatedMetaNodes, isMetaNode } from "@/utils/helper"
import { useMemo, useState } from "react"
import { Panel } from "./common/Panel"

// TODO: check id and name before add

function MetaNodeItem(props: { value: MetaNode }) {
  const metaNode = props.value
  const localMetaNode = useStore(selectMetaNode(props.value.id))
  const installMetaNode = useStore((state) => state.installMetaNode)
  return (
    <div>
      <div>{metaNode.config.name}</div>
      <div>{metaNode.config.desc}</div>
      <div>Installed? {localMetaNode ? "YES" : "NO"}</div>
      <button
        className="btn"
        onClick={() => {
          if (localMetaNode) {
            alert("Already Installed!")
          }
          installMetaNode(props.value)
        }}
      >
        +
      </button>
    </div>
  )
}

function TinyMetaNode(props: { value: MetaNode }) {
  const localMetaNode = useStore(selectMetaNode(props.value.id))
  return (
    <div className="flex">
      <div>{props.value.config.name}</div>
      <div>Installed? {localMetaNode ? "YES" : "NO"}</div>
    </div>
  )
}

function PipelineItem(props: { value: BundledPipeline }) {
  const pipeline = props.value
  const localPipeline = useStore(selectPipeline(props.value.id))
  const installPipeline = useStore((state) => state.installPipeline)
  const relatedMetaNodes = useMemo(() => getRelatedMetaNodes(pipeline), [pipeline])
  return (
    <div>
      <div key={pipeline.id}>
        <div>{pipeline.name}</div>
        <div>{pipeline.desc}</div>
        <div>installed? {localPipeline ? "YES" : "NO"}</div>
        <div>
          {relatedMetaNodes.map((metaNode) => (
            <TinyMetaNode key={metaNode.id} value={metaNode}></TinyMetaNode>
          ))}
        </div>
        <button
          className="btn"
          onClick={() => {
            if (localPipeline) {
              alert("Already Installed!")
            }
            installPipeline(props.value)
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function ExplorePannel() {
  const [objects, setObjects] = useState<Array<MetaNode | BundledPipeline>>(() => {
    const demoMetaNode = generateMetaNode(
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
  })

  return (
    <Panel>
      <div>Explore</div>
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
