// src/pages/ProjectsPage.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { InviteToProjectModal } from '../components/InviteToProjectModal';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { getMyProjects, createProject } from '../services/projectService';
import { Project } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { user } = useAuth();

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const userProjects = await getMyProjects();
            setProjects(userProjects);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách dự án. Vui lòng thử lại.');
            console.error("Lỗi khi fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const handleOpenInviteModal = (project: Project) => {
        setSelectedProject(project);
        setIsInviteModalOpen(true);
    };

    const handleCloseInviteModal = () => {
        setSelectedProject(null);
        setIsInviteModalOpen(false);
    };

    const handleCreateProject = async (projectData: { name: string; description: string | null }) => {
        try {
            await createProject(projectData);
            fetchProjects();
        } catch (err) {
            alert('Tạo dự án thất bại.');
            throw err;
        }
    };
    
    const renderContent = () => {
        if (loading) return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
        if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
        if (projects.length === 0) return (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700">Không tìm thấy dự án nào</h3>
                <p className="mt-2 text-gray-500">Bạn chưa tham gia dự án nào. Hãy tạo một dự án mới để bắt đầu!</p>
            </div>
        );

        return (
            // --- THAY ĐỔI BỐ CỤC LƯỚI ---
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {projects.map(project => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onOpenInviteModal={handleOpenInviteModal}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar activeItem="Quản lý dự án" />
            <main className="flex-grow p-6 sm:p-8 md:ml-64">
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Dự Án Của Tôi</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Tất cả các dự án bạn đang tham gia.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 md:mt-0 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-transform hover:scale-105"
                        >
                            + Tạo Dự Án Mới
                        </button>
                    </header>
                    {renderContent()}
                </div>
            </main>

            <InviteToProjectModal
                isOpen={isInviteModalOpen}
                onClose={handleCloseInviteModal}
                project={selectedProject}
            />
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateProject}
            />
        </div>
    );
};
export default ProjectsPage;