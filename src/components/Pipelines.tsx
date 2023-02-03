import { PANEL } from "@/constants/page"
import { selectMetaNode } from "@/store/selectors"
import { Pipeline, ProgressItem } from "@/store/type"
import useStore from "@/store/useStore"
import clsx from "classnames"
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
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
        "px-2 overflow-auto border-2 rounded h-10",
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
  const end = currentProgressIndex === props.pipeline.nodes.length - 1
  useEffect(() => {
    if (!scrollableWrapper.current) return
    const nextProgressItemElement = scrollableWrapper.current.querySelector(
      `[data-index='${(currentProgressIndex === undefined ? -1 : currentProgressIndex) + 1}']`
    )
    if (nextProgressItemElement) {
      const scrollableWrapperRight = scrollableWrapper.current.getBoundingClientRect().right
      const currentProgressItemElementRight = nextProgressItemElement.getBoundingClientRect().right
      const distance = currentProgressItemElementRight - scrollableWrapperRight
      if (distance > 0) {
        scrollableWrapper.current.scrollBy({
          left: distance,
          behavior: "smooth",
        })
      }
    }
  }, [currentProgressIndex])
  const displayingProgressIndex = useMemo(
    () => (end && currentChoosedIndex !== null ? currentChoosedIndex : currentProgressIndex),
    [end, currentChoosedIndex, currentProgressIndex]
  )
  return (
    <div ref={scrollableWrapper} className="overflow-x-auto space-y-2">
      <ul className="steps px-2">
        {props.pipeline.nodes.map((item, index) => (
          <li
            key={index}
            data-index={index}
            className={clsx(
              "step",
              props.value[index]
                ? !props.value[index].ok
                  ? "step-error"
                  : "step-info"
                : props.value[index - 1] && !props.value[index - 1].ok
                ? "step-primary"
                : "",
              currentChoosedIndex === index &&
                "cursor-pointer after:outline after:outline-1 after:outline-accent-content"
            )}
            onClick={() => {
              setCurrentChoosedIndex(index)
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
      {displayingProgressIndex !== undefined ? (
        <Result value={props.value[displayingProgressIndex]} />
      ) : null}
    </div>
  )
}

export function PipelineItem(props: { value: Pipeline }) {
  const { navigate } = useContext(NavigateContext)
  const [pipelineRunningId, setPipelineRunningId] = useState<string>("")
  const [progress, setProgress] = useState<ProgressItem[] | null>(null)
  const runPipeline = useStore((state) => state.runPipeline)
  const removePipeline = useStore((state) => state.removePipeline)
  const exportPipeline = useStore((state) => state.exportPipeline)
  const firstMetaNode = useStore(selectMetaNode(props.value.nodes[0].metaId))
  const inputRef = useRef()
  const inputDefinition = firstMetaNode?.config.input
  useEffect(() => {
    if (pipelineRunningId) {
      setProgress([])
    }
  }, [pipelineRunningId])
  return (
    <div className="card max-w-[480px] p-4 mt-4 bg-base-200 shadow-xl space-y-2">
      <div className="flex items-center">
        <div className="flex-1 text-lg font-semibold">{props.value.name}</div>
        <div className="flex">
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={async () => {
              const runningId = props.value.id + Date.now()
              if (runningId === pipelineRunningId) return
              setPipelineRunningId(runningId)
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
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
            >
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
                  onClick={() => {
                    // TODO check the MetaNode only used by this pipeline
                    removePipeline(props.value.id)
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
    </div>
  )
}

export const NavigateContext = createContext<{ navigate: (...args: any[]) => void }>({
  navigate: () => {},
})

export function Pipelines({ navigate }: { navigate: (...args: any[]) => void }) {
  const pipelines = useStore((state) => state.pipelines)
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
