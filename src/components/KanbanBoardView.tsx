// src/components/KanbanBoardView.tsx

import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    CollisionDetection, 
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Project, TaskItem, User } from '../types';
import { ProjectStatus, createProjectStatus, updateStatusesOrder } from '../services/projectStatusService';
import { updateTaskStatus } from '../services/taskService';
import { Plus, GripVertical } from 'lucide-react';

// --- Interface ---
interface KanbanBoardViewProps {
    project: Project | null;
    tasks: TaskItem[];
    setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
    statuses: ProjectStatus[];
    onStatusesChange: () => void;
}

// --- Sub-components ---

const AssigneeAvatar: React.FC<{ user: User }> = ({ user }) => {
    const initial = user.username.charAt(0).toUpperCase();
    return (
        <div
            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border-2 border-white -ml-2 first:ml-0"
            title={user.username}
        >
            {initial}
        </div>
    );
};

const TaskCard: React.FC<{ task: TaskItem }> = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'TASK',
            task: task,
        }
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
    };
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} className="bg-white p-3 mb-3 rounded-md shadow-sm border-l-4" style={{ ...style, borderColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#84cc16' }}>
            <p className="font-medium text-gray-800 mb-2">{task.title}</p>
            <div className="flex justify-end">
                <div className="flex flex-row-reverse">
                    {task.taskAssignees && task.taskAssignees.map(({ user }) => (<AssigneeAvatar key={user.id} user={user} />))}
                </div>
            </div>
        </div>
    );
};

const AddStatusColumn: React.FC<{ onAdd: (name: string, color: string) => Promise<void> }> = ({ onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#808080');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) { setIsAdding(false); return; }
        setIsSubmitting(true);
        try {
            await onAdd(name, color);
            setName('');
            setColor('#808080');
            setIsAdding(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAdding) {
        return (
            <button onClick={() => setIsAdding(true)} className="w-full h-12 bg-gray-200/50 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center justify-center transition">
                <Plus size={18} className="mr-2" /> Thêm cột mới
            </button>
        );
    }
    return (
        <div className="p-3 bg-gray-200 rounded-lg space-y-2">
            <input 
                autoFocus 
                placeholder="Nhập tên cột..." 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" 
            />
            <div className="flex items-center gap-2">
                 <label htmlFor="status-color-picker" className="text-sm font-medium text-gray-700">Màu:</label>
                 <input 
                    id="status-color-picker"
                    type="color" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-8 p-0 border-none rounded-md cursor-pointer"
                 />
            </div>
            <div className="flex gap-2">
                <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                    {isSubmitting ? 'Đang thêm...' : 'Thêm'}
                </button>
                <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                    Hủy
                </button>
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ 
    status: ProjectStatus; 
    tasks: TaskItem[];
    listeners?: ReturnType<typeof useSortable>['listeners'];
}> = ({ status, tasks, listeners }) => {
    const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
    return (
        <div className="w-80 bg-gray-50 rounded-lg flex-shrink-0 flex flex-col max-h-full shadow-sm">
            <h3 
                style={{ borderTopColor: status.color }} 
                className="font-semibold text-gray-800 p-3 border-t-4 rounded-t-lg flex items-center sticky top-0 bg-gray-50 z-10 cursor-grab"
                {...listeners}
            >
                <GripVertical size={18} className="text-gray-400 mr-2" />
                {status.name}
                <span className="ml-2 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.length}</span>
            </h3>
            <div className="flex-grow p-2 overflow-y-auto min-h-[100px]">
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy} id={status.id.toString()}>
                    {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
                </SortableContext>
            </div>
        </div>
    );
};

const SortableKanbanColumn = ({ status, tasks }: { status: ProjectStatus; tasks: TaskItem[] }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: status.id,
        data: {
            type: 'COLUMN',
            status: status,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <KanbanColumn status={status} tasks={tasks} listeners={listeners} />
        </div>
    );
}

// --- Component Chính ---
export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({ project, tasks, setTasks, statuses, onStatusesChange }) => {
    const [orderedStatuses, setOrderedStatuses] = useState<ProjectStatus[]>([]);
    const [activeStatus, setActiveStatus] = useState<ProjectStatus | null>(null);
    const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

    useEffect(() => {
        setOrderedStatuses(statuses);
    }, [statuses]);

    const statusIds = useMemo(() => orderedStatuses.map(s => s.id), [orderedStatuses]);
    const tasksByStatus = useMemo(() => {
        return orderedStatuses.reduce((acc, status) => {
            acc[status.id] = tasks.filter(task => task.statusId === status.id);
            return acc;
        }, {} as { [key: number]: TaskItem[] });
    }, [orderedStatuses, tasks]);
    
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
          distance: 10,
        },
    }));

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        if (active.data.current?.type === 'COLUMN') {
            setActiveStatus(active.data.current.status);
            return;
        }
        if (active.data.current?.type === 'TASK') {
            setActiveTask(active.data.current.task);
            return;
        }
    }
    
    async function handleDragEnd(event: DragEndEvent) {
        setActiveStatus(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isColumnDrag = active.data.current?.type === 'COLUMN';
        if (isColumnDrag) {
            const oldIndex = orderedStatuses.findIndex(s => s.id === activeId);
            const newIndex = orderedStatuses.findIndex(s => s.id === overId);
            const newOrderedStatuses = arrayMove(orderedStatuses, oldIndex, newIndex);
            setOrderedStatuses(newOrderedStatuses);

            if (project) {
                try {
                    const statusIdsInOrder = newOrderedStatuses.map(s => s.id);
                    await updateStatusesOrder(project.id, statusIdsInOrder);
                } catch (error) {
                    alert("Lỗi khi cập nhật thứ tự cột. Đang hoàn tác.");
                    setOrderedStatuses(statuses);
                }
            }
            return;
        }

        const isTaskDrag = active.data.current?.type === 'TASK';
        if (isTaskDrag) {
            const taskBeingDragged = active.data.current?.task;
            if (!taskBeingDragged) return;

            const activeContainerId = taskBeingDragged.statusId;
            let overContainerId: number | null | undefined;
            
            const overIsAColumn = over.data.current?.type === 'COLUMN';
            if (overIsAColumn) {
                 overContainerId = Number(over.id);
            } else {
                 const taskOver = tasks.find(t => t.id === overId);
                 overContainerId = taskOver?.statusId;
            }

            if (!activeContainerId || overContainerId === undefined || overContainerId === null) return;
            
            if (activeContainerId !== overContainerId) {
                const originalTasks = [...tasks];
                setTasks(prev => prev.map(task => 
                    task.id === activeId ? { ...task, statusId: overContainerId as number } : task
                ));
                try {
                    await updateTaskStatus(activeId as number, overContainerId as number);
                } catch (error) {
                    setTasks(originalTasks);
                    alert("Lỗi khi di chuyển task.");
                }
            }
        }
    }

    const handleAddStatus = async (name: string, color: string) => {
        if (!project) return;
        try {
            const newStatusData = {
                name: name,
                color: color,
                projectId: project.id
            };
            await createProjectStatus(project.id, newStatusData);
            onStatusesChange();
        } catch (error) {
            console.error("Lỗi khi thêm cột mới:", error);
            alert('Thêm cột mới thất bại.');
        }
    };

    return (
        <DndContext 
            sensors={sensors} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
        >
            <div className="flex items-start space-x-4 overflow-x-auto pb-4 p-2">
                <SortableContext items={statusIds} strategy={horizontalListSortingStrategy}>
                    {orderedStatuses.map(status => (
                        <SortableKanbanColumn
                            key={status.id}
                            status={status}
                            tasks={tasksByStatus[status.id] || []}
                        />
                    ))}
                </SortableContext>
                <div className="w-80 flex-shrink-0">
                    <AddStatusColumn onAdd={handleAddStatus} />
                </div>
            </div>
            
            {createPortal(
                <DragOverlay>
                    {activeStatus && <KanbanColumn status={activeStatus} tasks={tasksByStatus[activeStatus.id] || []} />}
                    {activeTask && <TaskCard task={activeTask} />}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};
