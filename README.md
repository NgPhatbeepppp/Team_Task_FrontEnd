# 🎯 Hệ thống Quản lý Công việc Nhóm – Giao diện Frontend (React)

Tài liệu này cung cấp cái nhìn tổng quan toàn diện về mã nguồn **Frontend** của dự án **Hệ thống Quản lý Công việc Nhóm**.  
Ứng dụng được phát triển bằng **React** và **TypeScript**, đóng vai trò là **giao diện người dùng** chính để tương tác với các chức năng quản lý công việc, dự án và nhóm.

---

## 📑 Mục Lục
- [Tổng quan](#tổng-quan)
- [Nền tảng Công nghệ](#nền-tảng-công-nghệ)
- [Các Tính năng Cốt lõi](#các-tính-năng-cốt-lõi)
- [Hướng dẫn Cài đặt và Vận hành](#hướng-dẫn-cài-đặt-và-vận-hành)
  - [Điều kiện tiên quyết](#điều-kiện-tiên-quyết)
  - [Quy trình Cài đặt](#quy-trình-cài-đặt)
  - [Các Tập lệnh (Scripts) Sẵn có](#các-tập-lệnh-scripts-sẵn-có)
- [Cấu trúc Thư mục](#cấu-trúc-thư-mục)

---

## 🖥 Tổng quan
Ứng dụng được xây dựng dưới dạng **Single Page Application (SPA)** nhằm mang lại trải nghiệm người dùng liền mạch và tương tác cao.  
Hệ thống giao tiếp với **Backend** thông qua **RESTful APIs** để xử lý logic nghiệp vụ và dữ liệu.

---

## ⚙ Nền tảng Công nghệ
- **Framework:** React v19
- **Ngôn ngữ:** TypeScript
- **Thiết kế giao diện:** Tailwind CSS
- **Định tuyến:** React Router DOM
- **Tương tác API:** Axios
- **Quản lý trạng thái:** React Context API
- **Trực quan hóa dữ liệu:** Recharts
- **Kéo/Thả:** @dnd-kit
- **Lịch:** React Big Calendar
- **Icons:** Lucide React, Heroicons

---

## 🚀 Các Tính năng Cốt lõi

### **Bảng điều khiển (Dashboard)**
- Thống kê độ ưu tiên công việc.
- Phân bổ nhiệm vụ theo dự án.
- Danh sách công việc sắp đến hạn.

### **Quản lý Dự án**
- Xem, tạo mới dự án.
- Mời thành viên hoặc nhóm vào dự án.

### **Không gian làm việc Dự án**
- Chuyển đổi giữa **List**, **Kanban**, **Calendar**.
- Tạo, xem, cập nhật công việc.
- Kéo/thả để thay đổi trạng thái trên Kanban.

### **Quản lý Nhóm**
- Xem danh sách nhóm, tạo nhóm mới.
- Quản lý thành viên, phân quyền trưởng nhóm.

### **Hệ thống Thông báo & Lời mời**
- Quản lý các lời mời tham gia dự án hoặc nhóm.

### **Hồ sơ Người dùng**
- Xem và chỉnh sửa thông tin cá nhân.

---

## 🛠 Hướng dẫn Cài đặt và Vận hành

### **Điều kiện tiên quyết**
- Node.js >= 16.x  
- npm hoặc yarn  
- Backend API của dự án đang chạy.

### **Quy trình Cài đặt**

1. **Clone repository**
   ```bash
   git clone https://github.com/NgPhatbeepppp/Team_Task_FrontEnd.git
   cd team_task_frontend
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Cấu hình Backend API**
   - Mở file `src/services/api.ts`  
   - Chỉnh `baseURL` để trỏ đúng đến địa chỉ Backend:
     ```ts
     const api = axios.create({
       baseURL: 'http://localhost:5250/api', // Xác minh URL này
       timeout: 10000,
     });
     ```

4. **Chạy ứng dụng**
   ```bash
   npm start
   ```
   Truy cập: [http://localhost:3000](http://localhost:3000)  

---

### **Các Tập lệnh (Scripts) Sẵn có**
| Lệnh | Mô tả |
|------|-------|
| `npm start` | Khởi chạy ứng dụng ở chế độ phát triển |
| `npm run build` | Build ứng dụng cho môi trường production vào thư mục `build` |
| `npm test` | Chạy bộ kiểm thử trong chế độ watch |

---

## 📂 Cấu trúc Thư mục
```plaintext
src/
├── components/      # Các thành phần React tái sử dụng
├── contexts/        # React Context quản lý trạng thái toàn cục
├── hooks/           # Custom hooks
├── pages/           # Các trang chính của ứng dụng
├── services/        # Tương tác với API
└── types/           # Định nghĩa kiểu dữ liệu TypeScript
```
---
