import { PANEL } from "@/constants/page"
import { selectPipeline } from "@/store/selectors"
import useStore from "@/store/useStore"
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

function PipelineObject() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editting = !!id
  const edittingPipeline = useStore(selectPipeline(id))
  console.log(id, edittingPipeline)
  const addPipeline = useStore((state) => state.addPipeline)
  const updatePipeline = useStore((state) => state.updatePipeline)
  return (
    <div>
      {!editting || edittingPipeline ? (
        <PipelineEditor
          value={edittingPipeline}
          onSubmit={(value) => {
            if (edittingPipeline) {
              updatePipeline(edittingPipeline.id, value)
            } else {
              addPipeline(value)
            }
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
        <Route path={"editor/:id"} element={<PipelineObject />} />
        <Route path={"editor"} element={<PipelineObject />} />
        <Route path="/" element={<PipelinePage />} />
      </Routes>
    </Panel>
  )
}
