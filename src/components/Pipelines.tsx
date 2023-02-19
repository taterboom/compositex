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
        "px-2 py-1 overflow-auto border-2 rounded h-14",
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
                "step !min-w-[5rem] break-all",
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
    <div className="card max-w-[480px] p-4 mt-4 bg-base-300 shadow-xl space-y-2">
      <div className="flex items-center">
        <div className="flex-1 text-lg font-semibold">{props.value.name}</div>
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
              className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-32"
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
                    exportPipeline(props.value.id)
                  }}
                >
                  Export
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {props.value.desc && <div className="flex-1 opacity-70">{props.value.desc}</div>}

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
                just delete the pipeline
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  removePipeline(props.value.id, true)
                }}
              >
                delete them and the pipeline
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
    </div>
  )
}

export const NavigateContext = createContext<{ navigate: (...args: any[]) => void }>({
  navigate: () => {},
})

export function Pipelines({ navigate }: { navigate: (...args: any[]) => void }) {
  const pipelines = useStore(selectOrderedPipelines)

  return (
    <NavigateContext.Provider value={{ navigate }}>
      <div>
        {pipelines.map((item) => (
          <PipelineItem key={item.id} value={item} />
        ))}
      </div>
    </NavigateContext.Provider>
  )
}
