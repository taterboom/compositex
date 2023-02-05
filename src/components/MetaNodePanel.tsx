import { PANEL } from "@/constants/page"
import {
  selectIsPinned,
  selectMetaNode,
  selectOrderedMetaNodes,
  selectPipelinesWithMetaNodeIds,
} from "@/store/selectors"
import { MetaNode } from "@/store/type"
import useStore from "@/store/useStore"
import produce from "immer"
import { useMemo, useState } from "react"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom"
import { Dialog } from "./common/Dialog"
import {
  MaterialSymbolsAdd,
  MaterialSymbolsMoreHoriz,
  MaterialSymbolsUploadRounded,
} from "./common/icons"
import { Panel } from "./common/Panel"
import { MetaNodeEditor } from "./MetaNodeEditor"

function MetaNodeItem(props: { value: MetaNode }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const isPinned = useStore(selectIsPinned(props.value.id))
  const removeMetaNode = useStore((state) => state.removeMetaNode)
  const relatedPipelines = useStore(selectPipelinesWithMetaNodeIds([props.value.id]))
  const togglePin = useStore((state) => state.togglePin)
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
                <Link className="py-1 px-2" to={`editor/${props.value.id}`}>
                  Edit
                </Link>
              </li>
              <li>
                <Link className="py-1 px-2" to={`editor/folk/${props.value.id}`}>
                  Folk
                </Link>
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
      <Dialog open={deleteDialogOpen}>
        <div className="text-lg font-semibold max-w-[400px]">
          {relatedPipelines.length > 0
            ? "Some Pipelines contains this node, do you want to delete them?"
            : "Are you sure to delete the node?"}
        </div>
        <div className="opacity-70 my-4">
          {relatedPipelines.length > 0 ? (
            <ul>
              {relatedPipelines.map((item) => (
                <li key={item.id}>- {item.name}</li>
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
          {relatedPipelines.length > 0 ? (
            <>
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  removeMetaNode(props.value.id)
                }}
              >
                just delete the node
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  removeMetaNode(props.value.id, true)
                }}
              >
                delete them and the node
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-error"
              onClick={() => {
                setDeleteDialogOpen(false)
                removeMetaNode(props.value.id)
              }}
            >
              Yes
            </button>
          )}
        </div>
      </Dialog>
    </div>
  )
}

function MetaNodes() {
  const metaNodes = useStore(selectOrderedMetaNodes)
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

function MetaNodeCreate() {
  const navigate = useNavigate()
  const addMetaNode = useStore((state) => state.addMetaNode)
  return (
    <div>
      <MetaNodeEditor
        onSubmit={(value) => {
          addMetaNode(value)
          navigate(`/${PANEL.NODE}`)
        }}
      />
    </div>
  )
}

function MetaNodeUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const edittingMetaNode = useStore(selectMetaNode(id))
  const updateMetaNode = useStore((state) => state.updateMetaNode)
  return (
    <div>
      {edittingMetaNode ? (
        <MetaNodeEditor
          value={edittingMetaNode._raw}
          onSubmit={(value) => {
            updateMetaNode(edittingMetaNode.id, value)
            navigate(`/${PANEL.NODE}`)
          }}
        />
      ) : null}
    </div>
  )
}

function MetaNodeFolk() {
  const navigate = useNavigate()
  const addMetaNode = useStore((state) => state.addMetaNode)
  const { id } = useParams()
  const beFolkedMetaNode = useStore(selectMetaNode(id))
  const folkedMetaNode = useMemo(
    () =>
      beFolkedMetaNode &&
      produce(beFolkedMetaNode, (draft) => {
        draft.config.name = "(Folk)" + draft.config.name
      }),
    [beFolkedMetaNode]
  )
  return (
    <div>
      {folkedMetaNode ? (
        <MetaNodeEditor
          value={folkedMetaNode._raw}
          onSubmit={(value) => {
            addMetaNode(value)
            navigate(`/${PANEL.NODE}`)
          }}
        />
      ) : null}
    </div>
  )
}
export function MetaNodePanel() {
  return (
    <Panel>
      <Routes>
        <Route path={"editor/folk/:id"} element={<MetaNodeFolk />} />
        <Route path={"editor/:id"} element={<MetaNodeUpdate />} />
        <Route path={"editor"} element={<MetaNodeCreate />} />
        <Route path="" element={<MetaNodesPage />} />
      </Routes>
    </Panel>
  )
}
