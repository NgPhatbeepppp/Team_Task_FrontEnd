import React, { useMemo } from 'react';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Project, TaskItem, User } from '../types';
import { ProjectStatus, createProjectStatus } from '../services/projectStatusService';
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

const KanbanColumn: React.FC<{ status: ProjectStatus; tasks: TaskItem[] }> = ({ status, tasks }) => {
    const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
    return (
        <div className="w-80 bg-gray-50 rounded-lg flex-shrink-0 flex flex-col max-h-full shadow-sm">
            <h3 style={{ borderTopColor: status.color }} className="font-semibold text-gray-800 p-3 border-t-4 rounded-t-lg flex items-center sticky top-0 bg-gray-50 z-10">
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

const AddStatusColumn: React.FC<{ onAdd: (name: string) => Promise<void> }> = ({ onAdd }) => {
    const [isAdding, setIsAdding] = React.useState(false);
    const [name, setName] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const handleSubmit = async () => {
        if (!name.trim()) { setIsAdding(false); return; }
        setIsSubmitting(true);
        try {
            await onAdd(name);
            setName('');
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
        <div className="p-3 bg-gray-200 rounded-lg">
            <input autoFocus placeholder="Nhập tên cột..." value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-indigo-500" />
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

// --- Component chính ---
export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({ project, tasks, setTasks, statuses, onStatusesChange }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const tasksByStatus = useMemo(() => {
        return statuses.reduce((acc, status) => {
            acc[status.id] = tasks.filter(task => task.statusId === status.id);
            return acc;
        }, {} as { [key: number]: TaskItem[] });
    }, [statuses, tasks]);

    const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    
    const activeId = Number(active.id);
    const overId = Number(over.id);

    if (activeId === overId) return;

    const taskBeingDragged = tasks.find(t => t.id === activeId);
    if (!taskBeingDragged) return;

    const activeContainerId = taskBeingDragged.statusId;
    let overContainerId: number | null | undefined;

    const overIsAColumn = statuses.some(status => status.id.toString() === over.id.toString());
    if (overIsAColumn) {
        overContainerId = overId;
    } else {
        const taskOver = tasks.find(t => t.id === overId);
        overContainerId = taskOver?.statusId;
    }
    
    if (!activeContainerId || overContainerId === undefined || overContainerId === null) {
        return;
    }

    if (activeContainerId === overContainerId) {
        const overIsTask = tasks.some(t => t.id === overId);
        if (overIsTask) {
            setTasks((currentTasks) => {
                const activeIndex = currentTasks.findIndex(t => t.id === activeId);
                const overIndex = currentTasks.findIndex(t => t.id === overId);
                return arrayMove(currentTasks, activeIndex, overIndex);
            });
        }
    }
    else {
        const originalTasks = [...tasks];

        // ✨✨ GIẢI PHÁP CUỐI CÙNG TẠI ĐÂY ✨✨
        // Khẳng định với TypeScript rằng overContainerId chắc chắn là một 'number'
        setTasks(prevTasks => prevTasks.map(task =>
            task.id === activeId ? { ...task, statusId: overContainerId as number } : task
        ));

        try {
            // Chúng ta cũng có thể khẳng định kiểu ở đây để đảm bảo tính nhất quán
            await updateTaskStatus(activeId, overContainerId as number);
        } catch (error) {
            console.error("Failed to update task status:", error);
            alert('Cập nhật trạng thái thất bại. Đang hoàn tác...');
            setTasks(originalTasks);
        }
    }
};
    const handleAddStatus = async (name: string) => {
        if (!project) return;
        try {
            await createProjectStatus(project.id, { name });
            onStatusesChange();
        } catch (error) {
            alert('Thêm cột mới thất bại.');
            throw error;
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex items-start space-x-4 overflow-x-auto pb-4 p-2">
                {statuses.map(status => (
                    <KanbanColumn
                        key={status.id}
                        status={status}
                        tasks={tasksByStatus[status.id] || []}
                    />
                ))}
                <div className="w-80 flex-shrink-0">
                    <AddStatusColumn onAdd={handleAddStatus} />
                </div>
            </div>
        </DndContext>
    );
};