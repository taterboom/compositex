import { generatePanelLink, PANEL } from "@/constants/page"
import { selectMetaNode, selectPipeline } from "@/store/selectors"
import { Pipeline, ProgressItem } from "@/store/type"
import useStore from "@/store/useStore"
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom"
import { useEffect, useMemo, useRef, useState } from "react"
import { Panel } from "./common/Panel"
import { PipelineEditor } from "./PipelineEditor"
import { TypeDefinitionView } from "./TypeDefinitionView"
import clsx from "classnames"

function Result(props: { value: ProgressItem }) {
  const success = "result" in props.value
  const result = success ? props.value.result : props.value.error
  const resultText =
    result instanceof Error
      ? result.message
      : typeof result === "object"
      ? JSON.stringify(result)
      : result
  return (
    <div
      className={clsx("overflow-x-auto border-2 rounded", success ? "border-info" : "border-error")}
      onClick={() => {
        window.navigator.clipboard.writeText(resultText)
      }}
    >
      {resultText}
    </div>
  )
}

export function Progress(props: { value: ProgressItem[]; pipeline: Pipeline }) {
  const scrollableWrapper = useRef<HTMLDivElement>(null)
  const currentProgressIndex = useMemo(() => {
    for (let i = props.value.length - 1; i >= 0; i -= 1) {
      if (props.value[i]) {
        return i
      }
    }
  }, [props.value])
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
  return (
    <div ref={scrollableWrapper} className="overflow-x-auto">
      <ul className="steps">
        {props.pipeline.nodes.map((item, index) => (
          <li
            key={index}
            data-index={index}
            className={clsx(
              "step",
              props.value[index]
                ? "error" in props.value[index]
                  ? "step-error"
                  : "step-info"
                : props.value[index - 1] && !("error" in props.value[index - 1])
                ? "step-primary"
                : ""
            )}
          >
            {item.name}
          </li>
        ))}
      </ul>
      {currentProgressIndex !== undefined &&
      (currentProgressIndex === props.pipeline.nodes.length - 1 ||
        "error" in props.value[currentProgressIndex]) ? (
        <Result value={props.value[currentProgressIndex]} />
      ) : null}
    </div>
  )
}

export function PipelineItem(props: { value: Pipeline }) {
  const [progress, setProgress] = useState<ProgressItem[] | null>(null)
  const runPipeline = useStore((state) => state.runPipeline)
  const removePipeline = useStore((state) => state.removePipeline)
  const exportPipeline = useStore((state) => state.exportPipeline)
  const firstMetaNode = useStore(selectMetaNode(props.value.nodes[0].metaId))
  const inputRef = useRef()
  const inputDefinition = firstMetaNode?.config.input
  return (
    <div>
      <div>{props.value.name}</div>
      <Link to={`editor/${props.value.id}`}>
        <button className="btn">Edit</button>
      </Link>
      <button
        className="btn"
        onClick={() => {
          // TODO check the MetaNode only used by this pipeline
          removePipeline(props.value.id)
        }}
      >
        Delete
      </button>
      <button
        className="btn"
        onClick={() => {
          exportPipeline(props.value.id)
        }}
      >
        Export
      </button>
      <div className="flex">
        {inputDefinition ? (
          <TypeDefinitionView
            definition={inputDefinition}
            onChange={(v) => (inputRef.current = v)}
          />
        ) : null}
        <button
          className="btn"
          onClick={async () => {
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
          {">"}
        </button>
      </div>
      {progress && <Progress value={progress} pipeline={props.value} />}
    </div>
  )
}

export function Pipelines() {
  const pipelines = useStore((state) => state.pipelines)
  return (
    <div>
      <div>
        <Link to="editor">
          <button className="btn">New Pipeline</button>
        </Link>
      </div>
      {pipelines.map((item) => (
        <PipelineItem key={item.id} value={item} />
      ))}
    </div>
  )
}

function PipelineObject() {
  const navigate = useNavigate()
  const { id } = useParams()
  console.log(id)
  const editedPipeline = useStore(selectPipeline(id))
  const addPipeline = useStore((state) => state.addPipeline)
  const updatePipeline = useStore((state) => state.updatePipeline)
  return (
    <div>
      <button
        className="btn"
        onClick={() => {
          navigate(-1)
        }}
      >
        Back
      </button>
      <PipelineEditor
        value={editedPipeline}
        onSubmit={(value) => {
          if (editedPipeline) {
            updatePipeline(editedPipeline.id, value)
          } else {
            addPipeline(value)
          }
          navigate(-1)
        }}
      />
    </div>
  )
}

export function PipelinePanel() {
  return (
    <Panel>
      <Routes>
        <Route path={"editor/:id"} element={<PipelineObject />} />
        <Route path={"editor"} element={<PipelineObject />} />
        <Route path="/" element={<Pipelines />} />
      </Routes>
    </Panel>
  )
}
