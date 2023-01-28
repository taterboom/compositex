import { generatePanelLink, PANEL } from "@/constants/page"
import { selectMetaNode, selectPipeline } from "@/store/selectors"
import { Pipeline } from "@/store/type"
import useStore from "@/store/useStore"
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom"
import { useRef } from "react"
import { Panel } from "./common/Panel"
import { PipelineEditor } from "./PipelineEditor"
import { TypeDefinitionView } from "./TypeDefinitionView"

export function PipelineItem(props: { value: Pipeline }) {
  const runPipeline = useStore((state) => state.runPipeline)
  const removePipeline = useStore((state) => state.removePipeline)
  const firstMetaNode = useStore(selectMetaNode(props.value.nodes[0].metaId))
  const inputRef = useRef()
  const inputDefinition = firstMetaNode?.config.input
  return (
    <div>
      <div>{props.value.name}</div>
      <div className="flex">
        {inputDefinition ? (
          <TypeDefinitionView
            definition={inputDefinition}
            onChange={(v) => (inputRef.current = v)}
          />
        ) : null}
        <button
          className="btn"
          onClick={() => {
            console.log(runPipeline(props.value.id, inputRef.current))
          }}
        >
          {">"}
        </button>
      </div>
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
