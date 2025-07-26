import React, { useState, useEffect, useCallback } from 'react';
import {
  getPendingInvitations,
  acceptInvitation,
  rejectInvitation,
  InvitationDto,
} from '../services/invitationService';
import Sidebar from '../components/Sidebar';
import { Mail, Check, X, Loader2, Bell } from 'lucide-react';

// --- Component Card cho mỗi lời mời ---
interface InvitationCardProps {
  invitation: InvitationDto;
  onAction: () => void; // Callback để làm mới danh sách
}

const InvitationCard: React.FC<InvitationCardProps> = ({ invitation, onAction }) => {
  const [isLoading, setIsLoading] = useState(false);

  const invitationTypeText = invitation.invitationType === 'Project' ? 'dự án' : 'nhóm';

  const handleAction = async (action: 'accept' | 'reject') => {
    setIsLoading(true);
    try {
      if (action === 'accept') {
        await acceptInvitation(invitation);
        alert('Đã chấp nhận lời mời!');
      } else {
        await rejectInvitation(invitation);
        alert('Đã từ chối lời mời.');
      }
      onAction(); // Gọi lại hàm để tải lại danh sách
    } catch (error) {
      alert(`Đã có lỗi xảy ra: ${error}`);
      setIsLoading(false);
    }
    // Component sẽ tự unmount sau khi onAction() chạy, không cần setLoading(false)
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between transition-transform transform hover:scale-[1.02]">
      <div className="flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-gray-800">
            <span className="font-semibold">{invitation.inviterName}</span> đã mời bạn tham gia vào {invitationTypeText}{' '}
            <span className="font-semibold">"{invitation.targetName}"</span>.
          </p>
          <p className="text-xs text-gray-500">{new Date(invitation.sentAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
        ) : (
          <>
            <button
              onClick={() => handleAction('accept')}
              disabled={isLoading}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-gray-300 transition"
              title="Chấp nhận"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleAction('reject')}
              disabled={isLoading}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:bg-gray-300 transition"
              title="Từ chối"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};


// --- Component Tab Lời mời ---
const InvitationTab: React.FC = () => {
  const [invitations, setInvitations] = useState<InvitationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPendingInvitations();
      setInvitations(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách lời mời. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  if (loading) {
    return <div className="text-center py-10">Đang tải lời mời...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {invitations.length > 0 ? (
        invitations.map((inv) => (
          <InvitationCard key={inv.invitationId + inv.invitationType} invitation={inv} onAction={fetchInvitations} />
        ))
      ) : (
        <p className="text-center text-gray-500 py-10">Bạn không có lời mời nào đang chờ.</p>
      )}
    </div>
  );
};


// --- Component Trang chính ---
const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invitations' | 'notifications'>('invitations');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="Lời mời & Thông báo" />
      <main className="flex-grow p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Lời mời & Thông báo</h1>
            <p className="text-gray-600 mt-1">Quản lý các lời mời tham gia và cập nhật từ hệ thống.</p>
          </header>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('invitations')}
                className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'invitations'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mail className="w-5 h-5"/>
                Lời mời
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Bell className="w-5 h-5"/>
                Thông báo
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'invitations' && <InvitationTab />}
            {activeTab === 'notifications' && (
              <div className="text-center text-gray-500 py-10">
                <p>Chức năng thông báo sẽ được phát triển sau.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;