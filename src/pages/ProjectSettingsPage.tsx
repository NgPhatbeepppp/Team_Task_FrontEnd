import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getProjectById } from '../services/projectService';
import { Project } from '../types';
import { Loader2, ArrowLeft } from 'lucide-react';
import { MemberManagement } from '../components/MemberManagement';
import { Toast } from '../components/Toast'; // ✨ THÊM TOAST

const ProjectSettingsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✨ TOAST THÔNG BÁO
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setError('ID dự án không hợp lệ.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getProjectById(Number(projectId));
      setProject(data);
    } catch (err) {
      setError('Không thể tải thông tin dự án.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSuccess = (msg: string) => {
    setToastMessage(msg);
    setToastType('success');
    setShowToast(true);
  };

  const handleError = (msg: string) => {
    setToastMessage(msg);
    setToastType('error');
    setShowToast(true);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
    }
    if (error) {
      return <div className="text-center text-red-500 p-10">{error}</div>;
    }
    if (project) {
      return (
        <div className="space-y-8">
          <MemberManagement 
            project={project} 
            onMemberRemoved={fetchProject} 
            onSuccess={handleSuccess} // ✨ THÊM HÀM TOAST
            onError={handleError}     // ✨ THÊM HÀM TOAST
          />
          {/* WorkflowEditor component sẽ được thêm vào đây sau */}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem="Quản lý dự án" />
      <main className="flex-grow p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link to={`/project/${projectId}`} className="flex items-center text-sm text-indigo-600 hover:underline mb-2">
              <ArrowLeft size={16} className="mr-1" />
              Quay lại dự án
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Cài đặt Dự án: {project?.name}</h1>
          </header>
          {renderContent()}
        </div>
      </main>

      {/* ✨ TOAST THÔNG BÁO */}
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ProjectSettingsPage;

