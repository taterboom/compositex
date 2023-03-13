import { PANEL } from "@/constants/page"
import {
  selectIsPinned,
  selectMetaNode,
  selectMetaNodesOnlyUsedByPipeline,
  selectOrderedPipelines,
} from "@/store/selectors"
import { Pipeline, ProgressItem } from "@/store/type"
import useStore from "@/store/useStore"
import clsx from "classnames"
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Popup } from "./common/Popup"
import { MaterialSymbolsMoreHoriz, MaterialSymbolsPlayArrowRounded } from "./common/icons"
import { TypeDefinitionView } from "./TypeDefinitionView"

function Result(props: { value: ProgressItem }) {
  const result = props.value.ok ? props.value.result : props.value.error
  const resultText =
    result instanceof Error
      ? result.message
      : typeof result === "object"
      ? JSON.stringify(result)
      : result
  return (
    <div
      className={clsx(
        "px-2 py-1 overflow-auto border-2 rounded h-14 select-all",
        props.value.ok ? "border-info" : "border-error"
      )}
      onClick={() => {
        window.navigator.clipboard.writeText(resultText)
      }}
    >
      {resultText}
    </div>
  )
}

export function Progress(props: { value: ProgressItem[]; pipeline: Pipeline }) {
  const [currentChoosedIndex, setCurrentChoosedIndex] = useState<null | number>(null)
  const scrollableWrapper = useRef<HTMLDivElement>(null)
  const currentProgressIndex = useMemo(() => {
    for (let i = props.value.length - 1; i >= 0; i -= 1) {
      if (props.value[i]) {
        return i
      }
    }
  }, [props.value])
  const end =
    currentProgressIndex === props.pipeline.nodes.length - 1 ||
    (currentProgressIndex &&
      props.value[currentProgressIndex] &&
      !props.value[currentProgressIndex].ok)
  useEffect(() => {
    if (!scrollableWrapper.current) return
    const currentProgressItemElement = scrollableWrapper.current.querySelector(
      `[data-index='${currentProgressIndex === undefined ? 0 : currentProgressIndex}']`
    )
    if (!currentProgressItemElement) return
    const nextProgressItemElement = currentProgressItemElement.nextElementSibling
    const shouldVisibleElement = nextProgressItemElement || currentProgressItemElement
    const scrollableWrapperRight = scrollableWrapper.current.getBoundingClientRect().right
    const currentProgressItemElementRight = shouldVisibleElement.getBoundingClientRect().right
    const distance = currentProgressItemElementRight - scrollableWrapperRight
    if (distance > 0) {
      scrollableWrapper.current.scrollBy({
        left: distance,
        behavior: "smooth",
      })
    }
  }, [currentProgressIndex])
  const displayingProgressIndex = useMemo(
    () => (end && currentChoosedIndex !== null ? currentChoosedIndex : currentProgressIndex),
    [end, currentChoosedIndex, currentProgressIndex]
  )
  return (
    <>
      <div ref={scrollableWrapper} className="overflow-x-auto mb-2">
        <ul className="steps px-2">
          {props.pipeline.nodes.map((item, index) => (
            <li
              key={index}
              data-index={index}
              className={clsx(
                "step !min-w-[5rem]",
                props.value[index]
                  ? !props.value[index].ok
                    ? "step-error"
                    : "step-success"
                  : props.value[index - 1] && props.value[index - 1].ok
                  ? "step-neutral"
                  : "",
                end && props.value[index] && "cursor-pointer",
                currentChoosedIndex === index &&
                  "after:outline after:outline-1 after:outline-accent-content"
              )}
              onClick={() => {
                if (end && props.value[index]) {
                  setCurrentChoosedIndex(index)
                }
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      {displayingProgressIndex !== undefined ? (
        <Result value={props.value[displayingProgressIndex]} />
      ) : null}
    </>
  )
}

export function PipelineItem(props: { value: Pipeline }) {
  const { navigate } = useContext(NavigateContext)
  const [pipelineRunningId, setPipelineRunningId] = useState<string>("")
  const [progress, setProgress] = useState<ProgressItem[] | null>(null)
  const [exportPopupVisible, setExportPopupVisible] = useState(false)
  const isPinned = useStore(selectIsPinned(props.value.id))
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const togglePin = useStore((state) => state.togglePin)
  const runPipeline = useStore((state) => state.runPipeline)
  const removePipeline = useStore((state) => state.removePipeline)
  const exportPipeline = useStore((state) => state.exportPipeline)
  const firstMetaNode = useStore(selectMetaNode(props.value.nodes[0]?.metaId))
  const metaNodesOnlyUsed = useStore(selectMetaNodesOnlyUsedByPipeline(props.value.id))
  const inputRef = useRef()
  const inputDefinition = firstMetaNode?.config.input
  return (
    <div className="card max-w-[480px] p-4 bg-base-100 shadow-xl space-y-2">
      <div className="flex items-center">
        <div className="flex-1 text-lg font-semibold truncate">
          <a
            className="cursor-pointer"
            onClick={() => navigate(`/${PANEL.PIPELINE}/editor/${props.value.id}`)}
          >
            {props.value.name}
          </a>
        </div>
        <div className="flex">
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={async () => {
              const runningId = props.value.id + Date.now()
              if (runningId === pipelineRunningId) return
              setPipelineRunningId(runningId)
              setProgress([])
              const res = await runPipeline(props.value.id, inputRef.current, (progressData) => {
                setProgress((logs) => {
                  const newLogs = logs ? [...logs] : []
                  newLogs[progressData.index] = progressData
                  return newLogs
                })
              })
              console.log("[结果]", res)
            }}
          >
            <MaterialSymbolsPlayArrowRounded />
          </button>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
              <MaterialSymbolsMoreHoriz />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-32 border-edge "
            >
              <li>
                <a
                  className="py-1 px-2"
                  onClick={() => {
                    togglePin(props.value.id)
                  }}
                >
                  {isPinned ? "Pinned ✔︎" : "Pin"}
                </a>
              </li>
              <li>
                <a
                  className="py-1 px-2"
                  onClick={() => navigate(`/${PANEL.PIPELINE}/editor/${props.value.id}`)}
                >
                  Edit
                </a>
              </li>
              <li>
                <a
                  className="py-1 px-2"
                  onClick={() => navigate(`/${PANEL.PIPELINE}/editor/folk/${props.value.id}`)}
                >
                  Folk
                </a>
              </li>
              <li>
                <a
                  className="py-1 px-2"
                  onClick={() => {
                    setDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </a>
              </li>
              <li>
                <a
                  className="py-1 px-2"
                  onClick={() => {
                    setExportPopupVisible(true)
                  }}
                >
                  Export
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {props.value.desc && (
        <div>
          <div className="tooltip" data-tip={props.value.desc}>
            <div className="flex-1 opacity-70 line-clamp-2 text-left">{props.value.desc}</div>
          </div>
        </div>
      )}

      <div className="flex">
        {inputDefinition ? (
          <TypeDefinitionView
            definition={inputDefinition}
            onChange={(v) => (inputRef.current = v)}
          />
        ) : null}
      </div>

      {progress && (
        <>
          <div className="divider my-0"></div>
          <Progress key={pipelineRunningId} value={progress} pipeline={props.value} />
        </>
      )}

      <Popup open={deleteDialogOpen}>
        <div className="text-lg font-semibold max-w-[400px]">
          {metaNodesOnlyUsed.length > 0
            ? "Some Nodes are only used by this pipeline, do you want to delete them?"
            : "Are you sure to delete the pipeline?"}
        </div>
        <div className="opacity-70 my-4">
          {metaNodesOnlyUsed.length > 0 ? (
            <ul>
              {metaNodesOnlyUsed.map((item) => (
                <li key={item.id}>- {item.config.name}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex flex-col space-y-2 justify-end">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => {
              setDeleteDialogOpen(false)
            }}
          >
            Cancel
          </button>
          {metaNodesOnlyUsed.length > 0 ? (
            <>
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  removePipeline(props.value.id)
                }}
              >
                Just delete the pipeline
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  removePipeline(props.value.id, true)
                }}
              >
                Delete them and the pipeline
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-error"
              onClick={() => {
                setDeleteDialogOpen(false)
                removePipeline(props.value.id)
              }}
            >
              Yes
            </button>
          )}
        </div>
      </Popup>
      <Popup open={exportPopupVisible}>
        <div className="flex gap-1 text-lg font-semibold max-w-[400px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-warning stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Are you sure to export the pipeline?
        </div>
        <div className="max-w-[400px] opacity-80 my-4">
          All contents will be exported, including Private Key (if exists). Do not forget to delete
          them before you share it.
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="btn btn-sm"
            onClick={() => {
              setExportPopupVisible(false)
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              exportPipeline(props.value.id)
              setExportPopupVisible(false)
            }}
          >
            Export
          </button>
        </div>
      </Popup>
    </div>
  )
}

export const NavigateContext = createContext<{ navigate: (...args: any[]) => void }>({
  navigate: () => {},
})

export function Pipelines({
  navigate,
  search,
}: {
  navigate: (...args: any[]) => void
  search?: string
}) {
  const pipelines = useStore(selectOrderedPipelines)
  const searchedPipelines = useMemo(() => {
    if (!search) return pipelines
    const searchString = search.trim().toLowerCase()
    return pipelines.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchString) ||
        item.desc?.toLowerCase().includes(searchString)
    )
  }, [pipelines, search])

  return (
    <NavigateContext.Provider value={{ navigate }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {searchedPipelines.map((item) => (
          <PipelineItem key={item.id} value={item} />
        ))}
      </div>
    </NavigateContext.Provider>
  )
}
