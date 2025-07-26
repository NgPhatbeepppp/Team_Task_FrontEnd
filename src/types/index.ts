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
    name: string;
    description: string | null;
    createdByUserId: number;
    teamMembers: TeamMember[]; 
}
