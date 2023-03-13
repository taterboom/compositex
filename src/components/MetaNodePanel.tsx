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
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom"
import { Popup } from "./common/Popup"
import {
  MaterialSymbolsAdd,
  MaterialSymbolsMoreHoriz,
  MaterialSymbolsUploadRounded,
} from "./common/icons"
import { Panel } from "./common/Panel"
import { MetaNodeEditor } from "./MetaNodeEditor"
import { ObjectImportButton } from "./ObjectImport"

function MetaNodeItem(props: { value: MetaNode }) {
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const isPinned = useStore(selectIsPinned(props.value.id))
  const removeMetaNode = useStore((state) => state.removeMetaNode)
  const exportMetaNode = useStore((state) => state.exportMetaNode)
  const relatedPipelines = useStore(selectPipelinesWithMetaNodeIds([props.value.id]))
  const togglePin = useStore((state) => state.togglePin)
  return (
    <div className="card max-w-[480px] p-4 bg-base-100 shadow-xl space-y-2">
      <div className="flex items-center">
        <div className="flex-1 text-lg font-semibold">
          <Link to={`editor/${props.value.id}`}>{props.value.config.name}</Link>
        </div>
        <div className="flex">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
              <MaterialSymbolsMoreHoriz />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-32 border-edge"
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
              <li
                onClick={() => {
                  exportMetaNode(props.value.id)
                }}
              >
                <a className="py-1 px-2 disabled">Export</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {props.value.config.desc && (
        <div>
          <div className="tooltip" data-tip={props.value.config.desc}>
            <div className="flex-1 opacity-70 line-clamp-2 text-left">
              {props.value.config.desc}
            </div>
          </div>
        </div>
      )}
      {relatedPipelines?.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs opacity-30 truncate">
            Used in &nbsp;
            <span className="">
              {relatedPipelines.map((item, index, arr) => (
                <>
                  <button
                    key={item.id}
                    className="btn px-0 py-0 h-fit min-h-min btn-link text-base-content font-normal"
                    onClick={() => {
                      navigate(`/${PANEL.PIPELINE}/editor/${item.id}`)
                    }}
                  >
                    {item.name}
                  </button>
                  {index < arr.length - 1 ? "," : ""}&nbsp;
                </>
              ))}
            </span>
          </div>
        </div>
      )}
      <Popup open={deleteDialogOpen}>
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
                Just delete the node
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  removeMetaNode(props.value.id, true)
                }}
              >
                Delete them and the node
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
      </Popup>
    </div>
  )
}

function MetaNodes({ search }: { search: string }) {
  const metaNodes = useStore(selectOrderedMetaNodes)
  const reusableMetaNodes = useMemo(() => metaNodes.filter((item) => !item.disposable), [metaNodes])
  const searchedMetaNodes = useMemo(() => {
    if (!search) return reusableMetaNodes
    const searchString = search.trim().toLowerCase()
    return reusableMetaNodes.filter(
      (item) =>
        item.config.name?.toLowerCase().includes(searchString) ||
        item.config.desc?.toLowerCase().includes(searchString)
    )
  }, [reusableMetaNodes, search])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {searchedMetaNodes.map((metaNode, index) => (
        <MetaNodeItem key={metaNode.id} value={metaNode}></MetaNodeItem>
      ))}
    </div>
  )
}

function MetaNodesPage() {
  const [searchString, setSearchString] = useState("")
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="space-x-2">
          <Link to="editor">
            <button className="btn btn-sm btn-primary gap-2">
              <MaterialSymbolsAdd /> Create
            </button>
          </Link>
          {/* <Link to={`/${PANEL.IMPORT}`}>
          <button className="btn btn-sm btn-primary btn-disabled">
            <MaterialSymbolsUploadRounded />
          </button>
        </Link> */}
          <ObjectImportButton />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered input-sm w-full max-w-sm "
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
      </div>
      <MetaNodes search={searchString} />
    </div>
  )
}

function MetaNodeCreate() {
  const navigate = useNavigate()
  const addMetaNode = useStore((state) => state.addMetaNode)
  return (
    <div>
      <MetaNodeEditor
        handlerClassName="!justify-start"
        onCancel={() => {
          navigate(-1)
        }}
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
          handlerClassName="!justify-start"
          onCancel={() => {
            navigate(-1)
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
          handlerClassName="!justify-start"
          onCancel={() => {
            navigate(-1)
          }}
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

export const router = (
  <Route
    path={PANEL.NODE}
    element={
      <Panel>
        <Outlet />
      </Panel>
    }
  >
    <Route path={"editor/folk/:id"} element={<MetaNodeFolk />} />
    <Route path={"editor/:id"} element={<MetaNodeUpdate />} />
    <Route path={"editor"} element={<MetaNodeCreate />} />
    <Route index element={<MetaNodesPage />} />
  </Route>
)
