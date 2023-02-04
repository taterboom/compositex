import { PANEL } from "@/constants/page"
import { selectPipeline } from "@/store/selectors"
import useStore from "@/store/useStore"
import produce from "immer"
import { useMemo } from "react"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom"
import { MaterialSymbolsAdd, MaterialSymbolsUploadRounded } from "./common/icons"
import { Panel } from "./common/Panel"
import { PipelineEditor } from "./PipelineEditor"
import { Pipelines } from "./Pipelines"

function PipelinePage() {
  const navigate = useNavigate()
  return (
    <div className="space-y-4">
      <div className="space-x-2">
        <Link to="editor">
          <button className="btn btn-sm btn-primary">
            <MaterialSymbolsAdd />
          </button>
        </Link>
        <Link to={`/${PANEL.IMPORT}`}>
          <button className="btn btn-sm btn-primary">
            <MaterialSymbolsUploadRounded />
          </button>
        </Link>
      </div>
      <Pipelines navigate={navigate} />
    </div>
  )
}

function PipelineCreate() {
  const navigate = useNavigate()
  const addPipeline = useStore((state) => state.addPipeline)
  return (
    <div>
      <PipelineEditor
        onSubmit={(value) => {
          addPipeline(value)
          navigate(`/${PANEL.PIPELINE}`)
        }}
      />
    </div>
  )
}

function PipelineUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const edittingPipeline = useStore(selectPipeline(id))
  console.log(id, edittingPipeline)
  const updatePipeline = useStore((state) => state.updatePipeline)
  return (
    <div>
      {edittingPipeline ? (
        <PipelineEditor
          value={edittingPipeline}
          onSubmit={(value) => {
            updatePipeline(edittingPipeline.id, value)
            navigate(`/${PANEL.PIPELINE}`)
          }}
        />
      ) : null}
    </div>
  )
}

function PipelineFolk() {
  const navigate = useNavigate()
  const { id } = useParams()
  const addPipeline = useStore((state) => state.addPipeline)
  const beFolkedPipeline = useStore(selectPipeline(id))
  const folkedPipeline = useMemo(
    () =>
      beFolkedPipeline &&
      produce(beFolkedPipeline, (draft) => {
        draft.name = "(Folk)" + draft.name
      }),
    [beFolkedPipeline]
  )
  return (
    <div>
      {folkedPipeline ? (
        <PipelineEditor
          value={folkedPipeline}
          onSubmit={(value) => {
            addPipeline(value)
            navigate(`/${PANEL.PIPELINE}`)
          }}
        />
      ) : null}
    </div>
  )
}

export function PipelinePanel() {
  return (
    <Panel>
      <Routes>
        <Route path={"editor/folk/:id"} element={<PipelineFolk />} />
        <Route path={"editor/:id"} element={<PipelineUpdate />} />
        <Route path={"editor"} element={<PipelineCreate />} />
        <Route path="/" element={<PipelinePage />} />
      </Routes>
    </Panel>
  )
}
