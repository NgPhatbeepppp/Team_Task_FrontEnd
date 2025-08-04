import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { MyTaskItem, Project } from '../types';
import { InvitationDto } from '../services/invitationService';
import { getMyTasks } from '../services/taskService';
import { getMyProjects } from '../services/projectService';
import { getPendingInvitations } from '../services/invitationService';
import { Loader2, Bell, Folder, CheckCircle, Clock } from 'lucide-react';
import { DashboardCharts } from '../components/DashboardCharts'; // ✅ THÊM MỚI

// --- Component Card thống kê ---
const StatCard: React.FC<{ title: string; value: number | string; icon: React.ElementType; linkTo: string }> = ({ title, value, icon: Icon, linkTo }) => (
  <Link to={linkTo} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center">
    <div className="bg-indigo-100 p-3 rounded-full mr-4">
      <Icon className="w-6 h-6 text-indigo-600" />
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  </Link>
);

// --- Component chính của trang ---
const HomePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ tasks: 0, projects: 0, invitations: 0 });
  const [allTasks, setAllTasks] = useState<MyTaskItem[]>([]); // ✅ THÊM MỚI: State cho tất cả tasks
  const [upcomingTasks, setUpcomingTasks] = useState<MyTaskItem[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasks, projects, invitations] = await Promise.all([
          getMyTasks(),
          getMyProjects(),
          getPendingInvitations(),
        ]);

        setAllTasks(tasks); // ✅ THÊM MỚI: Lưu tất cả tasks để dùng cho biểu đồ

        const sortedTasks = tasks
          .filter(t => t.deadline)
          .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
          .slice(0, 5);
        
        setStats({
          tasks: tasks.length,
          projects: projects.length,
          invitations: invitations.length,
        });
        
        setUpcomingTasks(sortedTasks);
        setRecentProjects(projects.slice(0, 4));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem="Trang chủ" />
      <main className="flex-grow p-6 sm:p-8 flex flex-col md:ml-64">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Chào mừng trở lại, {user?.fullName || user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">Đây là tổng quan nhanh về không gian làm việc của bạn.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Nhiệm vụ của bạn" value={stats.tasks} icon={CheckCircle} linkTo="/tasks" />
            <StatCard title="Dự án đang tham gia" value={stats.projects} icon={Folder} linkTo="/projects" />
            <StatCard title="Lời mời đang chờ" value={stats.invitations} icon={Bell} linkTo="/notifications" />
          </div>

          {/* ✅ THÊM MỚI: Hiển thị các biểu đồ */}
          <DashboardCharts tasks={allTasks} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Cột nhiệm vụ sắp đến hạn */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Nhiệm vụ sắp đến hạn
              </h2>
              <ul className="space-y-3">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map(task => (
                    <li key={task.id} className="p-3 rounded-md border hover:bg-gray-50 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{task.title}</p>
                        <Link to={`/project/${task.project.id}`} className="text-xs text-indigo-600 hover:underline">
                          {task.project.name}
                        </Link>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(task.deadline!).toLocaleDateString('vi-VN')}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Không có nhiệm vụ nào sắp đến hạn.</p>
                )}
              </ul>
            </div>

            {/* Cột dự án gần đây */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Folder className="w-5 h-5 mr-2 text-blue-500" />
                Dự án của bạn
              </h2>
              <ul className="space-y-3">
                {recentProjects.length > 0 ? (
                  recentProjects.map(project => (
                    <li key={project.id}>
                      <Link to={`/project/${project.id}`} className="block p-3 rounded-md border font-medium text-gray-800 hover:bg-gray-50">
                        {project.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Bạn chưa tham gia dự án nào.</p>
                )}
                <li className="pt-2">
                    <Link to="/projects" className="text-sm font-semibold text-indigo-600 hover:underline">
                        Xem tất cả dự án →
                    </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
