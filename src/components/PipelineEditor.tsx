import { ItemType } from "@/constants/dnd"
import { selectMetaNode, selectOrderedMetaNodes } from "@/store/selectors"
import { IdentityNode, MetaNode, Node, Pipeline } from "@/store/type"
import useStore from "@/store/useStore"
import { generateIdentityNode, generateIdentityNodeFromNode } from "@/utils/helper"
import produce from "immer"
import { useCallback, useRef, useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { MaterialSymbolsDragIndicator, MaterialSymbolsRemoveRounded } from "./common/icons"
import { TypeDefinitionView } from "./TypeDefinitionView"

function DraggableMetaNode(props: { value: MetaNode; onAdd?: (index?: number) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.META,
    item: props.value,
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
      key={props.value.id}
      ref={drag}
      className="group relative bg-base-100 rounded py-1 px-2 cursor-grab"
      style={{ opacity }}
    >
      <div>{props.value.config.name}</div>
      <button
        className="btn btn-circle btn-xs btn-ghost absolute top-1 right-1 hidden group-hover:block"
        onClick={() => props.onAdd?.()}
      >
        +
      </button>
    </div>
  )
}

function MetaNodes(props: { onAdd: (metaNode: MetaNode, index?: number) => void }) {
  const metaNodes = useStore(selectOrderedMetaNodes)

  return (
    <div className="rounded-lg bg-base-300 w-48 p-2 space-y-2 h-fit">
      {metaNodes.map((item) => (
        <DraggableMetaNode
          key={item.id}
          value={item}
          onAdd={(i) => {
            props.onAdd?.(item, i)
          }}
        ></DraggableMetaNode>
      ))}
    </div>
  )
}

function NodeEditor(props: {
  value: IdentityNode
  index: number
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
  const metaNode = useStore(selectMetaNode(props.value.metaId))
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemType.NODE,
    item: () => ({ index: props.index, ...props.value }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))
  const [{ handlerId }, drop] = useDrop<
    IdentityNode & { index: number; resolved: boolean },
    void,
    { handlerId: any | null }
  >({
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
  })
  drag(ref)
  preview(drop(previewRef))
  return (
    <div
      ref={previewRef}
      className="relative flex bg-base-100 rounded"
      style={{
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={() => props.onRemove?.()}
      >
        <MaterialSymbolsRemoveRounded />
      </button>
      <div ref={ref} className="cursor-grab flex items-center px-1">
        <MaterialSymbolsDragIndicator />
      </div>
      <div className="flex-1 py-2 pr-2 space-y-1">
        {/* <div>{props.value.name}</div> */}
        <div className="font-semibold">{metaNode?.config.name}</div>
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

function Nodes({
  nodes,
  onUpdateNode,
  onMoveNode,
  onRemoveNode,
}: {
  nodes: IdentityNode[]
  onUpdateNode?: (id: string, value: Pick<Node, "options" | "name">) => void
  onMoveNode?: (
    dargIndex: number | undefined,
    hoverIndex: number,
    draggedItem: MetaNode | IdentityNode
  ) => void
  onRemoveNode?: (index: number) => void
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
  let backgroundClass = "bg-base-300"
  if (isActive) {
    backgroundClass = "bg-base-300/70"
  } else if (canDrop) {
    backgroundClass = "bg-base-300/40"
  }
  return (
    <div ref={drop} className={"rounded-lg p-4 w-[500] space-y-2 bg-base-300 " + backgroundClass}>
      {nodes.length === 0 && (
        <div className="text-center text-accent text-lg">
          Drag and Drop or click + to add nodes from left
        </div>
      )}
      {nodes.map((item, index) => (
        <NodeEditor
          key={item.id}
          index={index}
          value={item}
          onChange={(options) => {
            onUpdateNode?.(item.id, options)
          }}
          onMoveNode={onMoveNode}
          onRemove={() => onRemoveNode?.(index)}
        />
      ))}
    </div>
  )
}

export function PipelineEditor(props: {
  value?: Pipeline
  onSubmit?: (pipeline: Omit<Pipeline, "id">) => void
}) {
  const [name, setName] = useState(props.value?.name || "")
  const [desc, setDesc] = useState(props.value?.desc || "")
  const [nodes, setNodes] = useState<IdentityNode[]>(
    () => props.value?.nodes.map(generateIdentityNodeFromNode) || []
  )
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
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Type Name"
              className="input input-bordered w-full max-w-sm "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Type Desc"
              className="input input-bordered w-full max-w-sm "
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <MetaNodes onAdd={addNode} />
            <Nodes
              nodes={nodes}
              onUpdateNode={updateNode}
              onMoveNode={moveNode}
              onRemoveNode={removeNode}
            />
          </div>
          <div>
            <button
              className="btn btn-wide btn-primary"
              onClick={() => {
                props.onSubmit?.({ nodes, name, desc })
              }}
            >
              Save
            </button>
          </div>
        </div>
      </DndProvider>
    </div>
  )
}
