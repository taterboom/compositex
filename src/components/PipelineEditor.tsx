import { ItemType } from "@/constants/dnd"
import { selectMetaNode } from "@/store/selectors"
import { IdentityNode, MetaNode, Node, Pipeline } from "@/store/type"
import useStore from "@/store/useStore"
import { generateIdentityNode, generateIdentityNodeFromNode } from "@/utils/helper"
import produce from "immer"
import { useCallback, useRef, useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
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
    <div key={props.value.id} ref={drag} style={{ opacity }}>
      <div>{props.value.config.name}</div>
      <button className="btn" onClick={() => props.onAdd?.()}>
        +
      </button>
    </div>
  )
}

function MetaNodes(props: { onAdd: (metaNode: MetaNode, index?: number) => void }) {
  const metaNodes = useStore((state) => state.metaNodes)

  return (
    <div>
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
      style={{
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <div ref={ref} className="w-8 h-8 roundered bg-primary-content"></div>
      <div>{props.value.name}</div>
      <div>{metaNode?.config.name}</div>
      <div>
        {metaNode?.config.options?.map?.((option, index) => (
          <div key={index}>
            <div>{option.name}</div>
            <TypeDefinitionView
              definition={option}
              value={props.value.options?.[option.name] ?? option.default}
              onChange={(value) => props.onChange?.({ [option.name]: value })}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function Nodes({
  nodes,
  onUpdateNode,
  onMoveNode,
}: {
  nodes: IdentityNode[]
  onUpdateNode?: (id: string, value: Pick<Node, "options" | "name">) => void
  onMoveNode?: (
    dargIndex: number | undefined,
    hoverIndex: number,
    draggedItem: MetaNode | IdentityNode
  ) => void
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
  let backgroundColor = "#222"
  if (isActive) {
    backgroundColor = "darkgreen"
  } else if (canDrop) {
    backgroundColor = "darkkhaki"
  }
  return (
    <div
      ref={drop}
      style={{ backgroundColor, padding: 16, border: "1px solid white", minWidth: 480 }}
    >
      {nodes.map((item, index) => (
        <NodeEditor
          key={item.id}
          index={index}
          value={item}
          onChange={(options) => {
            onUpdateNode?.(item.id, options)
          }}
          onMoveNode={onMoveNode}
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
      const sameMetaNodeCount = v.filter((item) => item.metaId === metaNode.id).length
      const node = generateIdentityNode(metaNode, sameMetaNodeCount)
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
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="">
          <input
            type="text"
            placeholder="Type Name"
            className="input input-bordered w-full max-w-xs "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Type Desc"
            className="input input-bordered w-full max-w-xs "
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex">
            <MetaNodes onAdd={addNode} />
            <Nodes nodes={nodes} onUpdateNode={updateNode} onMoveNode={moveNode} />
          </div>
          <div>
            <button
              className="btn"
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
