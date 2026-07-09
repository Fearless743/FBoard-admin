import { createContext, useContext, type ReactNode } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const DragEnabledContext = createContext(false);

interface SortableConfig {
  items: { id: number; [key: string]: any }[];
  onReorder: (ids: number[]) => void;
  enabled: boolean;
  children: ReactNode;
}

export function SortableContainer({ items, onReorder, enabled, children }: SortableConfig) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (!enabled) {
    return <DragEnabledContext.Provider value={false}>{children}</DragEnabledContext.Provider>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIdx = items.findIndex((i) => i.id === active.id);
        const newIdx = items.findIndex((i) => i.id === over.id);
        if (oldIdx === -1 || newIdx === -1) return;
        const reordered = [...items];
        const [moved] = reordered.splice(oldIdx, 1);
        reordered.splice(newIdx, 0, moved);
        onReorder(reordered.map((i) => i.id));
      }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <DragEnabledContext.Provider value={true}>{children}</DragEnabledContext.Provider>
      </SortableContext>
    </DndContext>
  );
}

export function SortableRow({ id, children }: { id: number; children: ReactNode }) {
  const enabled = useContext(DragEnabledContext);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !enabled });

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: enabled ? CSS.Transform.toString(transform) : undefined,
        transition: enabled ? transition : undefined,
        opacity: enabled && isDragging ? 0.5 : 1,
      }}
      {...(enabled ? { ...attributes, ...listeners } : {})}
    >
      {children}
    </tr>
  );
}

export function DragCell() {
  const enabled = useContext(DragEnabledContext);
  if (!enabled) return null;
  return (
    <td className="w-10">
      <div className="flex items-center justify-center">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </td>
  );
}
