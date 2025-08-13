import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getMyTasks, getTaskById, updateTask } from '../services/taskService';
import { MyTaskItem, TaskItem } from '../types';
import { Loader2 } from 'lucide-react';
import { Calendar, dateFnsLocalizer, Event, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { vi } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/CalendarView.css'; // Tái sử dụng CSS đã có
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { getProjectStatuses } from '../services/projectStatusService';
import { ProjectStatus } from '../services/projectStatusService';
import { useToast } from '../hooks/useToast';

// Định nghĩa kiểu cho sự kiện trên lịch
interface CalendarEvent extends Event {
    id: number;
    resource: MyTaskItem;
}

const locales = {
  'vi': vi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const MyCalendarPage = () => {
    const [tasks, setTasks] = useState<MyTaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    // State cho modal chi tiết
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    const [selectedTaskStatuses, setSelectedTaskStatuses] = useState<ProjectStatus[]>([]);
    const { addToast } = useToast();

    // Hàm tải danh sách nhiệm vụ
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const myTasks = await getMyTasks();
            setTasks(myTasks);
            setError(null);
        } catch (err) {
            setError('Không thể tải lịch nhiệm vụ. Vui lòng thử lại.');
            console.error("Lỗi khi tải nhiệm vụ:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Xử lý khi người dùng nhấp vào một nhiệm vụ trên lịch
    const handleSelectTask = async (task: MyTaskItem) => {
        try {
            // Tải thông tin chi tiết của task và các trạng thái của dự án tương ứng
            const [fullTask, statuses] = await Promise.all([
                getTaskById(task.id),
                getProjectStatuses(task.project.id)
            ]);
            setSelectedTask(fullTask);
            setSelectedTaskStatuses(statuses);
            setIsDetailsModalOpen(true);
        } catch (error) {
            addToast({ message: 'Không thể tải chi tiết công việc.', type: 'error' });
        }
    };

    // Xử lý khi cập nhật một nhiệm vụ từ modal
    const handleUpdateTask = async (taskId: number, taskData: Partial<TaskItem> & { assignedUserIds?: number[] }) => {
        try {
            await updateTask(taskId, taskData);
            await fetchTasks(); // Tải lại toàn bộ nhiệm vụ để cập nhật lịch
            addToast({ message: 'Cập nhật công việc thành công!', type: 'success' });
        } catch (error) {
            addToast({ message: 'Cập nhật thất bại.', type: 'error' });
            throw error;
        }
    };

    // Chuyển đổi danh sách nhiệm vụ thành định dạng sự kiện cho lịch
    const events: CalendarEvent[] = tasks.reduce((acc: CalendarEvent[], task) => {
        const eventTitle = `[${task.project.keyCode}] ${task.title}`;
        if (task.startDate && task.deadline) {
            const endDate = new Date(task.deadline);
            endDate.setDate(endDate.getDate() + 1);
            acc.push({
                id: task.id,
                title: eventTitle,
                start: new Date(task.startDate),
                end: endDate,
                allDay: true,
                resource: task,
            });
        } else if (task.deadline) {
            acc.push({
                id: task.id,
                title: eventTitle,
                start: new Date(task.deadline),
                end: new Date(task.deadline),
                allDay: true,
                resource: task,
            });
        }
        return acc;
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center p-10">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                </div>
            );
        }
        if (error) {
            return <div className="text-center py-10 text-red-500">{error}</div>;
        }
        return (
            <div className="bg-white p-4 rounded-lg shadow h-[80vh]">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    culture="vi"
                    onSelectEvent={(event) => handleSelectTask(event.resource)}
                    date={currentDate}
                    onNavigate={date => setCurrentDate(date)}
                    views={[Views.MONTH]}
                    messages={{
                        next: "Sau",
                        previous: "Trước",
                        today: "Hôm nay",
                        month: "Tháng",
                        week: "Tuần",
                        day: "Ngày",
                        agenda: "Lịch trình",
                        date: "Ngày",
                        time: "Thời gian",
                        event: "Sự kiện",
                        noEventsInRange: "Không có công việc nào trong khoảng thời gian này.",
                    }}
                />
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar activeItem="Lịch" />
            <main className="flex-grow p-6 sm:p-8 flex flex-col md:ml-64">
                <div className="max-w-full mx-auto w-full">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">Lịch của tôi</h1>
                        <p className="text-gray-600 mt-1">Tất cả nhiệm vụ của bạn trên một chế độ xem lịch.</p>
                    </header>
                    {renderContent()}
                </div>
            </main>
            <TaskDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                task={selectedTask}
                statuses={selectedTaskStatuses}
                onUpdate={handleUpdateTask}
            />
        </div>
    );
};

export default MyCalendarPage;