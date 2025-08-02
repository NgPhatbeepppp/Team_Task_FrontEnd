// src/components/KanbanBoardView.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Project, TaskItem, User } from '../types';
import { ProjectStatus, getProjectStatuses, createProjectStatus } from '../services/projectStatusService';
import { updateTaskStatus } from '../services/taskService';
import { Loader2, Plus, GripVertical } from 'lucide-react';

// --- Interface ---
interface KanbanBoardViewProps {
  project: Project | null;
  initialTasks: TaskItem[];
  onTasksChange: () => void;
}

// --- Sub-components ---

// ✨ THAY ĐỔI: Component con để hiển thị avatar của người được giao
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

// ✨ THAY ĐỔI: Cập nhật TaskCard để hiển thị nhiều người được giao
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
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="bg-white p-3 mb-3 rounded-md shadow-sm border-l-4"
      style={{ 
        ...style, 
        borderColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#84cc16' 
      }}
    >
        <p className="font-medium text-gray-800 mb-2">{task.title}</p>
        <div className="flex justify-end">
            <div className="flex flex-row-reverse">
                {task.taskAssignees && task.taskAssignees.map(({ user }) => (
                    <AssigneeAvatar key={user.id} user={user} />
                ))}
            </div>
        </div>
    </div>
  );
};

// Cột trạng thái (Không thay đổi)
const KanbanColumn: React.FC<{ status: ProjectStatus; tasks: TaskItem[] }> = ({ status, tasks }) => {
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div className="w-80 bg-gray-50 rounded-lg flex-shrink-0 flex flex-col max-h-full shadow-sm">
      <h3
        style={{ borderTopColor: status.color }}
        className="font-semibold text-gray-800 p-3 border-t-4 rounded-t-lg flex items-center sticky top-0 bg-gray-50 z-10"
      >
        <GripVertical size={18} className="text-gray-400 mr-2" />
        {status.name}
        <span className="ml-2 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.length}</span>
      </h3>
      <div className="flex-grow p-2 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </SortableContext>
      </div>
    </div>
  );
};

// Form thêm cột mới (Không thay đổi)
const AddStatusColumn: React.FC<{ onAdd: (name: string) => Promise<void> }> = ({ onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleSubmit = async () => {
      if (!name.trim()) {
        setIsAdding(false);
        return;
      }
      setIsSubmitting(true);
      await onAdd(name);
      setName('');
      setIsSubmitting(false);
      setIsAdding(false);
    };
  
    if (!isAdding) {
      return (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full h-12 bg-gray-200/50 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center justify-center transition"
        >
          <Plus size={18} className="mr-2" /> Thêm cột mới
        </button>
      );
    }
  
    return (
      <div className="p-3 bg-gray-200 rounded-lg">
        <input
          autoFocus
          placeholder="Nhập tên cột..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-indigo-500"
        />
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

// --- Component chính --- (Không thay đổi logic)
export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({ project, initialTasks, onTasksChange }) => {
    const [statuses, setStatuses] = useState<ProjectStatus[]>([]);
    const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
    const [isLoading, setIsLoading] = useState(true);

    const sensors = useSensors(useSensor(PointerSensor));

    const tasksByStatus = useMemo(() => {
        return statuses.reduce((acc, status) => {
            acc[status.id] = tasks.filter(task => task.statusId === status.id);
            return acc;
        }, {} as { [key: number]: TaskItem[] });
    }, [statuses, tasks]);

    const fetchStatuses = useCallback(async () => {
        if (project) {
            try {
                const data = await getProjectStatuses(project.id);
                setStatuses(data);
            } catch (error) {
                console.error("Failed to fetch statuses", error);
            }
        }
    }, [project]);

    useEffect(() => {
        setIsLoading(true);
        fetchStatuses().finally(() => setIsLoading(false));
    }, [fetchStatuses]);
    
    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
    
        if (!over || active.id === over.id) return;
    
        const activeContainer = active.data.current?.sortable.containerId;
        const overContainer = over.data.current?.sortable?.containerId || over.id;
    
        if (activeContainer !== overContainer) {
            const taskId = Number(active.id);
            const newStatusId = Number(overContainer);
            const originalTask = tasks.find(t => t.id === taskId);
            
            if (!originalTask) return;
            
            setTasks(prevTasks => {
                return prevTasks.map(task => 
                    task.id === taskId ? { ...task, statusId: newStatusId } : task
                );
            });
    
            try {
                await updateTaskStatus(taskId, newStatusId);
            } catch (error) {
                alert('Cập nhật trạng thái công việc thất bại. Đang hoàn tác...');
                setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? originalTask : t));
            }
        }
    };
    
    const handleAddStatus = async (name: string) => {
        if (!project) return;
        try {
            await createProjectStatus(project.id, { name });
            await fetchStatuses();
        } catch (error) {
            alert('Thêm cột mới thất bại.');
            throw error;
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
    }

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