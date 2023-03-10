import { BundledPipeline, MetaNode } from "@/store/type"
import { isMetaNode } from "@/utils/helper"
import { useEffect, useMemo, useState } from "react"
import { MetaNodeItem } from "./common/MetaNodeItem"
import { Panel } from "./common/Panel"
import { PipelineItem } from "./common/PipelineItem"
import clsx from "classnames"

const ENDPOINT = "https://compositex.taterboom.com"

let cache: any

export function ExplorePannel() {
  const [selectedType, setSelectedType] = useState<null | "pipeline" | "node">(null)
  const [searchString, setSearchString] = useState("")
  const [objects, setObjects] = useState<Array<MetaNode | BundledPipeline>>([])

  useEffect(() => {
    const init = async () => {
      let data = cache
      if (!data) {
        data = await fetch(`${ENDPOINT}/api/explore/objects`).then((res) => res.json())
        cache = data
      }
      setObjects(data)
    }
    init()
  }, [])

  const searchedObjects = useMemo(() => {
    const selectedTypeObjects = objects.filter((item) => {
      if (selectedType === "pipeline") {
        return !isMetaNode(item)
      }
      if (selectedType === "node") {
        return isMetaNode(item)
      }
      return true
    })
    if (!searchString) return selectedTypeObjects
    const search = searchString.trim().toLowerCase()
    return selectedTypeObjects.filter((item) =>
      isMetaNode(item)
        ? item.config?.name?.toLowerCase().includes(search) ||
          item.config?.desc?.toLowerCase().includes(search)
        : item.name?.toLowerCase().includes(search) || item.desc?.toLowerCase().includes(search)
    )
  }, [objects, searchString, selectedType])

  const loading = objects?.length === 0

  if (loading) return <div className="btn loading bg-transparent border-none"></div>

  return (
    <Panel className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="btn-group">
          {(["pipeline", "node"] as const).map((type) => (
            <button
              key={type}
              className={clsx("btn btn-sm capitalize", selectedType === type && "btn-active")}
              onClick={() => {
                setSelectedType(selectedType === type ? null : type)
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered input-sm w-full max-w-sm "
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {searchedObjects.map((item) =>
          isMetaNode(item) ? (
            <MetaNodeItem key={item.id} value={item} className="!bg-base-100" />
          ) : (
            <PipelineItem key={item.id} value={item} className="!bg-base-100" />
          )
        )}
      </div>
    </Panel>
  )
}
