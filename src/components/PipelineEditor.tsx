import { ItemType } from "@/constants/dnd"
import { selectMetaNode, selectOrderedMetaNodes } from "@/store/selectors"
import { BundledPipeline, IdentityNode, MetaNode, Node, Pipeline } from "@/store/type"
import useStore from "@/store/useStore"
import { generateIdentityNode, generateIdentityNodeFromNode } from "@/utils/helper"
import produce from "immer"
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Popup } from "./common/Popup"
import {
  MaterialSymbolsDragIndicator,
  MaterialSymbolsMoreHoriz,
  MaterialSymbolsRemoveRounded,
} from "./common/icons"
import { MetaNodeEditor } from "./MetaNodeEditor"
import { TypeDefinitionView } from "./TypeDefinitionView"
import clsx from "classnames"
import { BlockNavigationConfirm } from "./common/BlockNavigationConfirm"
import { InspectLink } from "./common/Inspect"

function DraggableMetaNode(props: { value: MetaNode; onAdd?: (index?: number) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.META,
    item: () => ({ ...props.value }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      // @ts-ignore
      if (item && !item.resolved && dropResult && dropResult.shouldAdd) {
        props.onAdd?.()
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  const opacity = isDragging ? 0.4 : 1
  return (
    <div
      ref={drag}
      className="group relative bg-base-100 rounded py-2 px-3 cursor-grab border border-base-content/10"
      style={{ opacity }}
    >
      <InspectLink className="text-semibold" value={props.value}>
        {props.value.config.name}
      </InspectLink>
      <div className="text-sm opacity-60 truncate" title={props.value.config.desc}>
        {props.value.config.desc}
      </div>
      <button
        className="btn btn-circle btn-xs btn-ghost absolute top-1 right-1 hidden group-hover:block"
        onClick={() => props.onAdd?.()}
      >
        +
      </button>
    </div>
  )
}

function MetaNodesLayer(props: { onAdd: (metaNode: MetaNode, index?: number) => void }) {
  const [searchString, setSearchString] = useState("")
  const metaNodes = useStore(selectOrderedMetaNodes)
  const reusableMetaNodes = useMemo(() => metaNodes.filter((item) => !item.disposable), [metaNodes])
  const searchedMetaNodes = useMemo(() => {
    const search = searchString.trim().toLowerCase()
    if (!search) return reusableMetaNodes
    return reusableMetaNodes.filter(
      (item) =>
        item.config.name.toLowerCase().includes(search) ||
        item.config.desc?.toLowerCase().includes(search)
    )
  }, [reusableMetaNodes, searchString])

  return (
    <div className="bg-base-200/70 w-56 p-4 space-y-4 sticky top-0 left-0 z-10 h-full border-l border-base-content/10 overflow-y-auto">
      <div>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered input-sm w-full max-w-sm "
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {searchedMetaNodes.map((item) => (
          <DraggableMetaNode
            key={item.id}
            value={item}
            onAdd={(i) => {
              props.onAdd?.(item, i)
            }}
          ></DraggableMetaNode>
        ))}
      </div>
    </div>
  )
}

function NodeEditor(props: {
  value: IdentityNode | BundledPipeline["nodes"][0]
  index: number
  displayOnly?: boolean
  onChange?: (value: Pick<Node, "options" | "name">) => void
  onMoveNode?: (
    dargIndex: number | undefined,
    hoverIndex: number,
    draggedItem: MetaNode | IdentityNode
  ) => void
  onRemove?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const metaNodeInStore = useStore(selectMetaNode(props.value.metaId))
  const metaNode = metaNodeInStore || (props.value as BundledPipeline["nodes"][0]).metaNode
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemType.NODE,
      item: () => {
        return { index: props.index, ...props.value }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.index]
  )
  const [{ handlerId }, drop] = useDrop<
    IdentityNode & { index: number; resolved: boolean },
    void,
    { handlerId: any | null }
  >(
    {
      accept: [ItemType.NODE, ItemType.META],
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        }
      },
      hover(item, monitor) {
        if (!ref.current || !previewRef.current) {
          return
        }
        const dragIndex = item.index
        const hoverIndex = props.index
        if (dragIndex === hoverIndex) {
          return
        }
        const hoverBoundingRect = previewRef.current.getBoundingClientRect()
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const clientOffset = monitor.getClientOffset()
        const hoverClientY = clientOffset!.y - hoverBoundingRect.top
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }
        props.onMoveNode?.(dragIndex, hoverIndex, item)
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex
        item.resolved = true
      },
    },
    [props.index]
  )
  drag(ref)
  preview(drop(previewRef))
  return (
    <div
      ref={previewRef}
      className={clsx("relative flex rounded", props.displayOnly ? "bg-base-300" : "bg-base-100")}
      style={{
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      {!props.displayOnly && (
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => props.onRemove?.()}
        >
          <MaterialSymbolsRemoveRounded />
        </button>
      )}
      {!props.displayOnly && (
        <div ref={ref} className="cursor-grab flex items-center px-1">
          <MaterialSymbolsDragIndicator />
        </div>
      )}
      <div className={clsx("flex-1 py-4 pr-4 space-y-1", props.displayOnly && "px-4")}>
        {!props.displayOnly && metaNode.disposable ? (
          <UpdateDisposableNode value={metaNode} />
        ) : (
          <InspectLink className="font-semibold" value={metaNode}>
            {metaNode.config.name}
          </InspectLink>
        )}
        <div>
          {metaNode?.config.options?.map?.((option, index) => (
            <div key={index} className="space-y-1">
              <div className="opacity-70">{option.name}</div>
              <TypeDefinitionView
                definition={option}
                value={props.value.options?.[option.name] ?? option.default}
                onChange={(value) => props.onChange?.({ [option.name]: value })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NodeLayout(
  props: PropsWithChildren<{ className?: string; bordered?: boolean; topLine?: boolean }>
) {
  return (
    <div className={props.className}>
      {props.topLine && <div className="w-px h-8 mx-auto bg-primary"></div>}
      <div
        className={clsx(
          "relative w-full min-h-32 bg-base-100 rounded",
          "before:absolute before:z-10 before:left-1/2 before:top-0 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-primary",
          "after:absolute after:z-10 after:left-1/2 after:top-full after:-translate-x-1/2 after:-translate-y-1/2 after:w-2 after:h-2 after:rounded-full after:bg-primary",
          props.bordered && "border-dashed border-primary/70 border"
        )}
      >
        {props.children}
      </div>
      <div className="w-px h-8 mx-auto bg-primary"></div>
    </div>
  )
}

function Nodes({
  nodes,
  displayOnly,
  onUpdateNode,
  onMoveNode,
  onRemoveNode,
  onAddDisposableNode,
}: {
  nodes: IdentityNode[]
  displayOnly?: boolean
  onUpdateNode?: (id: string, value: Pick<Node, "options" | "name">) => void
  onMoveNode?: (
    dargIndex: number | undefined,
    hoverIndex: number,
    draggedItem: MetaNode | IdentityNode
  ) => void
  onRemoveNode?: (index: number) => void
  onAddDisposableNode?: (node: MetaNode) => void
}) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemType.META,
    drop(item, monitor) {
      // @ts-ignore
      if (item && !item.resolved) {
        return { shouldAdd: true }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  const isActive = canDrop && isOver

  return (
    <div ref={drop} className={"rounded-lg p-4 w-[520px]"}>
      {nodes.map((item, index) => (
        <NodeLayout key={item.id} topLine={index === 0}>
          <NodeEditor
            key={item.id}
            displayOnly={displayOnly}
            index={index}
            value={item}
            onChange={(options) => {
              onUpdateNode?.(item.id, options)
            }}
            onMoveNode={onMoveNode}
            onRemove={() => onRemoveNode?.(index)}
          />
        </NodeLayout>
      ))}
      {!displayOnly && (
        <NodeLayout
          className={clsx(isActive ? "opacity-100" : canDrop ? "opacity-80" : "opacity-60")}
          topLine={nodes.length === 0}
          bordered
        >
          <div className="h-32 flex flex-col justify-center px-16">
            <p>Drag and Drop or click + to add nodes from left.</p>
            <p>
              You can also
              <CreateDisposableNode onCreate={onAddDisposableNode} />
            </p>
          </div>
        </NodeLayout>
      )}
    </div>
  )
}

function CreateDisposableNode(props: { onCreate?: (metaNode: MetaNode) => void }) {
  const [open, setOpen] = useState(false)
  const addMetaNode = useStore((state) => state.addMetaNode)
  return (
    <>
      <button
        className="btn px-1 py-1 h-fit min-h-min btn-link text-info"
        onClick={() => {
          setOpen(true)
        }}
      >
        add a disposable node
      </button>
      <Popup open={open} className="w-2/3">
        <MetaNodeEditor
          cancelable
          onCancel={() => {
            setOpen(false)
          }}
          onSubmit={(value) => {
            setOpen(false)
            addMetaNode(value, { disposable: true }).then((metaNode) => {
              props.onCreate?.(metaNode)
            })
          }}
        />
      </Popup>
    </>
  )
}

function UpdateDisposableNode(props: { value: MetaNode }) {
  const [open, setOpen] = useState(false)
  const updateMetaNode = useStore((state) => state.updateMetaNode)
  return (
    <>
      <a
        className="link link-hover font-semibold"
        onClick={() => {
          setOpen(true)
        }}
      >
        {props.value.config.name}
      </a>
      <Popup open={open} className="w-2/3">
        <MetaNodeEditor
          value={props.value._raw}
          cancelable
          onCancel={() => {
            setOpen(false)
          }}
          onSubmit={(value) => {
            setOpen(false)
            updateMetaNode(props.value.id, value)
          }}
        />
      </Popup>
    </>
  )
}

function DescriptionEditor(props: {
  defalutValue: string
  onSubmit?: (value: string) => void
  onCancel?: () => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  return (
    <div className="space-y-4 w-80">
      <div>
        <textarea
          ref={ref}
          className="textarea textarea-bordered w-full text-base"
          placeholder="Type the pipeline description here"
          defaultValue={props.defalutValue}
          rows={3}
        ></textarea>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="btn btn-sm"
          onClick={() => {
            props.onCancel?.()
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            if (!ref.current) return
            props.onSubmit?.(ref.current.value)
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export function PipelineEditor(props: {
  value?: Pipeline
  onSubmit?: (pipeline: Omit<Pipeline, "id">) => void
  displayOnly?: boolean
  className?: string
}) {
  const [name, setName] = useState(props.value?.name || "")
  const [desc, setDesc] = useState(props.value?.desc || "")
  const [descriptionEditorPopupVisible, setDescriptionEditorPopupVisible] = useState(false)
  const [nodes, _setNodes] = useState<IdentityNode[]>(
    () => props.value?.nodes.map(generateIdentityNodeFromNode) || []
  )
  const setNodes: typeof _setNodes = (...args) => {
    if (props.displayOnly) return
    _setNodes(...args)
  }
  const addNode = useCallback((metaNode: MetaNode, index?: number) => {
    setNodes((v) => {
      const node = generateIdentityNode(metaNode)
      if (index === undefined || index >= v.length) {
        return v.concat(node)
      } else {
        return produce(v, (draft) => {
          draft.splice(index, 0, node)
        })
      }
    })
  }, [])
  const updateNode = useCallback((id: string, options: any) => {
    setNodes((nodes) =>
      produce(nodes, (draft) => {
        const index = draft.findIndex((item) => item.id === id)
        draft[index].options = {
          ...draft[index].options,
          ...options,
        }
      })
    )
  }, [])
  const moveNode = useCallback(
    (dragIndex: number | undefined, hoverIndex: number, draggedItem: MetaNode | IdentityNode) => {
      if (dragIndex === undefined) {
        // add metaNode
        addNode(draggedItem as MetaNode, hoverIndex)
      } else {
        setNodes((nodes) =>
          produce(nodes, (draft) => {
            // swap
            const temp = draft[dragIndex]
            draft[dragIndex] = draft[hoverIndex]
            draft[hoverIndex] = temp
          })
        )
      }
    },
    [addNode]
  )
  const removeNode = (index: number) =>
    setNodes((nodes) =>
      produce(nodes, (draft) => {
        draft.splice(index, 1)
      })
    )

  const [candidateData, setCandidateData] = useState<null | Omit<Pipeline, "id">>(null)
  const isBlocked = !candidateData && (nodes.length > 0 || !!name || !!desc)

  useEffect(() => {
    if (candidateData) {
      props.onSubmit?.(candidateData)
    }
  }, [candidateData])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={clsx("flex gap-8 h-screen overflow-y-auto", props.className)}>
        {!props.displayOnly && <MetaNodesLayer onAdd={addNode} />}
        <div className="relative p-4 space-y-4">
          <div className="flex items-center justify-center">
            <input
              disabled={!!props.displayOnly}
              type="text"
              placeholder="Untitled Pipeline"
              className="input input-ghost w-full max-w-sm text-center font-semibold text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {!props.displayOnly && (
              <div className="absolute -right-12 flex items-center gap-2">
                <div className="dropdown">
                  <button tabIndex={0} className="btn btn-sm btn-primary btn-outline">
                    <MaterialSymbolsMoreHoriz />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content border-edge  menu p-2 shadow bg-base-300 rounded-box w-48"
                  >
                    <li onClick={() => setDescriptionEditorPopupVisible(true)}>
                      <a className="py-1 px-2">Edit Description</a>
                    </li>
                  </ul>
                </div>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setCandidateData({ nodes, name: name || "Untitled Pipeline", desc })
                  }}
                >
                  Save
                </button>
                <Popup open={descriptionEditorPopupVisible}>
                  <DescriptionEditor
                    defalutValue={desc}
                    onSubmit={(value) => {
                      setDesc(value)
                      setDescriptionEditorPopupVisible(false)
                    }}
                    onCancel={() => {
                      setDescriptionEditorPopupVisible(false)
                    }}
                  ></DescriptionEditor>
                </Popup>
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <Nodes
              displayOnly={props.displayOnly}
              nodes={nodes}
              onUpdateNode={updateNode}
              onMoveNode={moveNode}
              onRemoveNode={removeNode}
              onAddDisposableNode={addNode}
            />
          </div>
        </div>
      </div>
      <BlockNavigationConfirm isBlocked={isBlocked} />
    </DndProvider>
  )
}
