import { BundledPipeline, MetaNode, Pipeline } from "@/store/type"
import { generateMetaNode, generatePipeline, isMetaNode } from "@/utils/helper"
import { useEffect, useState } from "react"
import { Panel } from "./common/Panel"
import { MetaNodeItem } from "./common/MetaNodeItem"
import { PipelineItem } from "./common/PipelineItem"

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
