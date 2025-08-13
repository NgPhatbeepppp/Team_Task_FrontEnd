Hệ thống Quản lý Công việc Nhóm – Giao diện Frontend (React)
Tài liệu này cung cấp một cái nhìn tổng quan toàn diện về mã nguồn của thành phần Frontend cho dự án Hệ thống Quản lý Công việc Nhóm. Ứng dụng này được phát triển bằng React và TypeScript, đóng vai trò là giao diện người dùng chính để tương tác với các chức năng quản lý công việc, dự án và đội nhóm.

Mục Lục
Tổng quan
Nền tảng Công nghệ
Các Tính năng Cốt lõi
Hướng dẫn Cài đặt và Vận hành
Điều kiện tiên quyết
Quy trình Cài đặt
Các Tập lệnh (Scripts) Sẵn có
Cấu trúc Thư mục

Tổng quan
Ứng dụng được kiến trúc dưới dạng một Single Page Application (SPA) nhằm mang lại trải nghiệm người dùng liền mạch và có tính tương tác cao. Hệ thống giao tiếp với lớp Backend thông qua một tập hợp các RESTful APIs được định nghĩa rõ ràng để xử lý logic nghiệp vụ và thao tác dữ liệu.

Nền tảng Công nghệ
Nền tảng công nghệ của dự án được lựa chọn cẩn thận để đảm bảo hiệu suất, khả năng bảo trì và trải nghiệm phát triển tối ưu:

Framework: React (v19)

Ngôn ngữ: TypeScript

Thiết kế Giao diện: Tailwind CSS

Định tuyến: React Router DOM

Tương tác API: Axios

Quản lý Trạng thái: React Context API

Trực quan hóa Dữ liệu: Recharts

Chức năng Kéo/Thả: @dnd-kit

Hiển thị Lịch: React Big Calendar

Thư viện Icons: Lucide React & Heroicons

Các Tính năng Cốt lõi
Ứng dụng cung cấp một loạt các chức năng nghiệp vụ, được phân chia thành các module chính:

Bảng điều khiển (Dashboard): Trình bày một giao diện tổng quan với các biểu đồ thống kê về độ ưu tiên của công việc, phân bổ nhiệm vụ theo từng dự án, và danh sách các nhiệm vụ sắp đến hạn.

Quản lý Dự án: Cung cấp các chức năng để xem, tạo mới và mời thành viên hoặc các nhóm vào một dự án cụ thể.

Không gian làm việc Dự án:

Cho phép chuyển đổi linh hoạt giữa các chế độ xem khác nhau bao gồm Danh sách (List), Bảng (Kanban), và Lịch (Calendar).

Hỗ trợ các thao tác tạo, xem chi tiết và cập nhật thông tin công việc.

Tích hợp chức năng kéo và thả để thay đổi trạng thái công việc một cách trực quan trên bảng Kanban.

Quản lý Nhóm: Bao gồm các công cụ để xem danh sách nhóm, khởi tạo nhóm mới, quản lý thành viên và phân quyền trưởng nhóm.

Hệ thống Thông báo & Lời mời: Một trung tâm để quản lý các lời mời tham gia dự án hoặc nhóm đang chờ xử lý.

Hồ sơ Người dùng: Cho phép người dùng xem và chỉnh sửa thông tin cá nhân của họ.

Hướng dẫn Cài đặt và Vận hành
Để thiết lập và chạy dự án trên môi trường cục bộ, vui lòng tuân thủ các hướng dẫn dưới đây.

Điều kiện tiên quyết
Trước khi bắt đầu, cần đảm bảo rằng các công cụ sau đã được cài đặt trên hệ thống của bạn:

Node.js (phiên bản 16.x trở lên được khuyến nghị)

Trình quản lý gói npm hoặc yarn

Hệ thống Backend API của dự án phải đang hoạt động để cung cấp dữ liệu.

Quy trình Cài đặt
Sao chép (Clone) mã nguồn từ repository:

    git clone https://github.com/NgPhatbeepppp/Team_Task_FrontEnd.git
    cd team_task_frontend

Cài đặt các gói phụ thuộc (dependencies):

    npm install

Hoặc sử dụng yarn:

    yarn install

Cấu hình địa chỉ của Backend API:

Truy cập và mở tệp src/services/api.ts.

Điều chỉnh giá trị của thuộc tính baseURL để trỏ chính xác đến địa chỉ của máy chủ Backend.

// src/services/api.ts
const api = axios.create({
  baseURL: 'http://localhost:5250/api', // <-- Xác minh rằng URL này là chính xác
  timeout: 10000,
});

Khởi chạy ứng dụng:

    npm start

Lệnh này sẽ khởi động ứng dụng trong chế độ phát triển (development mode). Giao diện sẽ tự động được mở trên trình duyệt tại địa chỉ http://localhost:3000.

Các Tập lệnh (Scripts) Sẵn có
Dự án được cấu hình sẵn với các tập lệnh sau để hỗ trợ quá trình phát triển và triển khai:
    
    npm start: Khởi chạy ứng dụng trong môi trường phát triển.
    
    npm run build: Biên dịch và đóng gói ứng dụng cho môi trường sản phẩm (production) vào thư mục build.
    
    npm test: Kích hoạt trình chạy kiểm thử (test runner) trong chế độ theo dõi tương tác.

Cấu trúc Thư mục
Mã nguồn của dự án được tổ chức theo một cấu trúc thư mục rõ ràng và có hệ thống nhằm tạo điều kiện thuận lợi cho việc bảo trì và mở rộng trong tương lai:

src
├── components/      # Chứa các thành phần React có khả năng tái sử dụng.
├── contexts/        # Chứa các React Context để quản lý trạng thái toàn cục.
├── hooks/           # Chứa các custom hook để đóng gói logic tái sử dụng.
├── pages/           # Chứa các thành phần chính đại diện cho mỗi trang của ứng dụng.
├── services/        # Chứa logic để tương tác và xử lý dữ liệu từ API.
└── types/           # Chứa các định nghĩa kiểu dữ liệu của TypeScript.  
