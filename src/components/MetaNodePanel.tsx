import { generatePanelLink, PANEL } from "@/constants/page"
import { selectMetaNode, selectPipelinesWithMetaNodeIds } from "@/store/selectors"
import { MetaNode } from "@/store/type"
import useStore from "@/store/useStore"
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom"
import {
  MaterialSymbolsAdd,
  MaterialSymbolsMoreHoriz,
  MaterialSymbolsUploadRounded,
} from "./common/icons"
import { Panel } from "./common/Panel"
import { MetaNodeEditor } from "./MetaNodeEditor"

function MetaNodeItem(props: { value: MetaNode }) {
  const navigare = useNavigate()
  const removeMetaNode = useStore((state) => state.removeMetaNode)
  const relatedPipelines = useStore(selectPipelinesWithMetaNodeIds([props.value.id]))
  return (
    <div className="card max-w-[480px] p-4 mt-4 bg-base-200 shadow-xl space-y-2">
      <div className="flex items-center">
        <div className="flex-1 text-lg font-semibold">{props.value.config.name}</div>
        <div className="flex">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
              <MaterialSymbolsMoreHoriz />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
            >
              <li>
                <Link className="py-1 px-2" to={`editor/${props.value.id}`}>
                  Edit
                </Link>
              </li>
              <li>
                <a
                  className="py-1 px-2"
                  onClick={() => {
                    // TODO check the pipeline used this metaNode
                    removeMetaNode(props.value.id)
                  }}
                >
                  Delete
                </a>
              </li>
              <li>
                <a className="py-1 px-2 disabled">Export</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {relatedPipelines?.length > 0 && (
        <div className="space-y-2">
          <div className="">
            Used by these Pipelines:
            <span className="opacity-70"> {relatedPipelines.map((item) => item.name).join()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function MetaNodes() {
  const metaNodes = useStore((state) => state.metaNodes)
  return (
    <div>
      {metaNodes.map((metaNode, index) => (
        <MetaNodeItem key={index} value={metaNode}></MetaNodeItem>
      ))}
    </div>
  )
}

function MetaNodesPage() {
  return (
    <div className="space-y-4">
      <div className="space-x-2">
        <Link to="editor">
          <button className="btn btn-sm btn-primary">
            <MaterialSymbolsAdd />
          </button>
        </Link>
        <Link to={`/${PANEL.IMPORT}`}>
          <button className="btn btn-sm btn-primary btn-disabled">
            <MaterialSymbolsUploadRounded />
          </button>
        </Link>
      </div>
      <MetaNodes />
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
          navigate(`/${PANEL.NODE}`)
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
        <Route path="" element={<MetaNodesPage />} />
      </Routes>
    </Panel>
  )
}
