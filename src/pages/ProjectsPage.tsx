// src/pages/ProjectsPage.tsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { InviteToProjectModal } from '../components/InviteToProjectModal';
import { getMyProjects, createProject } from '../services/projectService';
import { Project } from '../types';
import { useAuth } from '../hooks/useAuth';

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { user } = useAuth();

    // --- DATA FETCHING ---
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

    // --- MODAL HANDLERS ---
    const handleOpenInviteModal = (project: Project) => {
        setSelectedProject(project);
        setIsInviteModalOpen(true);
    };

    const handleCloseInviteModal = () => {
        setSelectedProject(null);
        setIsInviteModalOpen(false);
    };

    // --- ACTION HANDLERS ---
    const handleCreateProject = async () => {
        const name = prompt('Nhập tên dự án mới:');
        if (name && name.trim()) {
            const description = prompt('Nhập mô tả cho dự án (không bắt buộc):') || '';
            try {
                await createProject({ name, description });
                fetchProjects(); // Tải lại danh sách dự án
            } catch (err) {
                alert('Tạo dự án thất bại.');
            }
        }
    };
    
    // --- RENDER LOGIC ---
    const renderContent = () => {
        if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
        if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
        if (projects.length === 0) return <div className="text-center py-10">Bạn chưa có dự án nào. Hãy tạo một dự án mới!</div>;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeItem="Quản lý dự án" />
            <main className="flex-grow p-6 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">Dự Án Của Tôi</h1>
                        <button
                            onClick={handleCreateProject}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-transform hover:scale-105"
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
        </div>
    );
};
export default ProjectsPage; 