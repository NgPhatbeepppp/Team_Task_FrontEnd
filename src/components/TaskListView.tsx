// src/components/TaskListView.tsx

import React from 'react';
import { TaskItem } from '../types';
import { List } from 'lucide-react';

interface TaskListViewProps {
  tasks: TaskItem[];
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <List className="mr-2" size={20}/>
          Danh sách công việc
        </h2>
      </div>
      <ul>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
              <span className="font-medium text-gray-800">{task.title}</span>
              
             
              <span className="text-sm text-gray-500">
                {task.taskAssignees && task.taskAssignees.length > 0
                  ? task.taskAssignees.map(assignee => assignee.user.username).join(', ')
                  : 'Chưa giao'}
              </span>

              {/* Thêm các thông tin khác như deadline, priority sau */}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 p-6">Dự án này chưa có công việc nào.</p>
        )}
      </ul>
    </div>
  );
};