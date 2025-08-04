import React from 'react';
import { MyTaskItem } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { countBy } from 'lodash';

interface DashboardChartsProps {
  tasks: MyTaskItem[];
}

// Định nghĩa màu sắc cho các mức độ ưu tiên
const COLORS = {
  High: '#ef4444',   // red-500
  Medium: '#f59e0b', // amber-500
  Low: '#84cc16',    // lime-500
};

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ tasks }) => {
  // Chuẩn bị dữ liệu cho Biểu đồ tròn (Độ ưu tiên)
  const priorityData = Object.entries(countBy(tasks, 'priority')).map(([name, value]) => ({
    name: name === 'High' ? 'Cao' : name === 'Medium' ? 'Trung bình' : 'Thấp',
    value,
    // Thêm key gốc để map màu cho đúng
    originalKey: name as keyof typeof COLORS
  }));

  // Chuẩn bị dữ liệu cho Biểu đồ cột (Dự án)
  const projectData = Object.entries(countBy(tasks, 'project.name')).map(([name, value]) => ({
    name,
    'Số nhiệm vụ': value,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Biểu đồ phân bổ độ ưu tiên */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Nhiệm vụ theo độ ưu tiên</h3>
        {priorityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                // ✅ THAY ĐỔI: Kiểm tra 'percent' trước khi sử dụng
                label={({ name, percent }) => 
                  percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name
                }
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.originalKey]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} nhiệm vụ`, 'Số lượng']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-10">Không có dữ liệu ưu tiên để hiển thị.</p>
        )}
      </div>

      {/* Biểu đồ số lượng nhiệm vụ theo dự án */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Nhiệm vụ theo dự án</h3>
        {projectData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Legend />
              <Bar dataKey="Số nhiệm vụ" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-10">Không có dữ liệu dự án để hiển thị.</p>
        )}
      </div>
    </div>
  );
};
