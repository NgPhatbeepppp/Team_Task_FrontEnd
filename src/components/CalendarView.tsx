// src/components/CalendarView.tsx
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Event, Views } from 'react-big-calendar';


import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { vi } from 'date-fns/locale'; 

import { TaskItem } from '../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';

interface CalendarViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
}

interface CalendarEvent extends Event {
    id: number; 
    resource: TaskItem;
}

const locales = {
  'vi': vi, // Sử dụng key 'vi' cho locale tiếng Việt
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events: CalendarEvent[] = tasks.reduce((acc: CalendarEvent[], task) => {
    if (task.startDate && task.deadline) {
      const endDate = new Date(task.deadline);
      endDate.setDate(endDate.getDate() + 1);

      acc.push({
        id: task.id,
        title: task.title,
        start: new Date(task.startDate),
        end: endDate,
        allDay: true,
        resource: task,
      });
    } 
    else if (task.deadline) {
      acc.push({
        id: task.id,
        title: task.title,
        start: new Date(task.deadline),
        end: new Date(task.deadline),
        allDay: true,
        resource: task,
      });
    }

    return acc;
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-[75vh]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        culture="vi" // Sử dụng key 'vi'
        onSelectEvent={(event) => onSelectTask(event.resource)}
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
