// src/types/index.ts

// Định nghĩa cấu trúc cho User, khớp với dữ liệu từ Backend
export interface User {
    id: number;
    username: string;
    email: string;
    
}

// Định nghĩa cấu trúc cho TeamMember
export interface TeamMember {
    userId: number;
    teamId: number;
    roleInTeam: 'TeamLeader' | 'Member';
    user: User; // Lồng thông tin User vào đây để dễ truy cập
}

// Định nghĩa cấu trúc cho Team
export interface Team {
    id: number;
    keyCode: string; 
    name: string;
    description: string | null;
    createdByUserId: number;
    teamMembers: {
        userId: number;
        teamId: number;
        roleInTeam: 'TeamLeader' | 'Member';
        user: User;
    }[]; 
}

export interface Project {
  id: number;
  keyCode: string; 
  name: string;
  description: string;
  createdByUserId: number;
   members?: { user: User }[]; 
    teams?: { team: Team }[];
}
// Định nghĩa cấu trúc cho TaskItem
export interface TaskItem {
    id: number;
    title: string;
    description: string | null;
    priority: 'Low' | 'Medium' | 'High';
    startDate: string | null;
    deadline: string | null;
    createdAt: string;
    statusId: number | null;
    
    taskAssignees?: { user: User }[];
    projectId: number; // ID của dự án mà task này thuộc về
}
export interface MyTaskItem {
  id: number;
  title: string;
  deadline: string | null;
  priority: 'Low' | 'Medium' | 'High';
  statusId: number | null;
  project: {
    id: number;
    name: string;
    keyCode: string;
  };
}