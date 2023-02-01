import { generatePanelLink, PANEL } from "@/constants/page"
import { selectMetaNode, selectPipelinesWithMetaNodeIds } from "@/store/selectors"
import { MetaNode } from "@/store/type"
import useStore from "@/store/useStore"
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom"
import { Panel } from "./common/Panel"
import { MetaNodeEditor } from "./MetaNodeEditor"

function MetaNodeItem(props: { value: MetaNode }) {
  const navigare = useNavigate()
  const removeMetaNode = useStore((state) => state.removeMetaNode)
  const relatedPipelines = useStore(selectPipelinesWithMetaNodeIds([props.value.id]))
  return (
    <div>
      <div>{props.value.config.name}</div>
      <div>{relatedPipelines.map((item) => item.name).join()}</div>
      <Link to={`editor/${props.value.id}`}>
        <button className="btn">Edit</button>
      </Link>
      <button
        className="btn"
        onClick={() => {
          // TODO check the pipeline used this metaNode
          removeMetaNode(props.value.id)
        }}
      >
        Delete
      </button>
    </div>
  )
}

function MetaNodes() {
  const metaNodes = useStore((state) => state.metaNodes)
  return (
    <div>
      <div>
        <Link to="editor">
          <button className="btn">New Node</button>
        </Link>
      </div>
      {metaNodes.map((metaNode, index) => (
        <MetaNodeItem key={index} value={metaNode}></MetaNodeItem>
      ))}
    </div>
  )
}

function MetaNodeObject() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editedMetaNode = useStore(selectMetaNode(id))
  const addMetaNode = useStore((state) => state.addMetaNode)
  const updateMetaNode = useStore((state) => state.updateMetaNode)
  return (
    <div>
      <MetaNodeEditor
        value={editedMetaNode?._raw}
        onSubmit={(value) => {
          if (editedMetaNode) {
            updateMetaNode(editedMetaNode.id, value)
          } else {
            addMetaNode(value)
          }
          // TODO Toast
          navigate(`/${PANEL.PIPELINE}`)
        }}
      />
    </div>
  )
}

export function MetaNodePanel() {
  return (
    <Panel>
      <Routes>
        <Route path="editor/:id" element={<MetaNodeObject />} />
        <Route path="editor" element={<MetaNodeObject />} />
        <Route path="" element={<MetaNodes />} />
      </Routes>
    </Panel>
  )
}
