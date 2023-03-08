import { BundledPipeline, MetaNode } from "@/store/type"
import { isMetaNode } from "@/utils/helper"
import { useEffect, useMemo, useState } from "react"
import { MetaNodeItem } from "./common/MetaNodeItem"
import { Panel } from "./common/Panel"
import { PipelineItem } from "./common/PipelineItem"

const ENDPOINT = "https://compositex.taterboom.com"

let cache: any

export function ExplorePannel() {
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
    if (!searchString) return objects
    const search = searchString.trim().toLowerCase()
    return objects.filter((item) =>
      isMetaNode(item)
        ? item.config?.name?.toLowerCase().includes(search) ||
          item.config?.desc?.toLowerCase().includes(search)
        : item.name?.toLowerCase().includes(search) || item.desc?.toLowerCase().includes(search)
    )
  }, [objects, searchString])

  const loading = objects?.length === 0

  if (loading) return <div className="btn loading bg-transparent border-none"></div>

  return (
    <Panel className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered input-sm w-full max-w-sm "
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
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
