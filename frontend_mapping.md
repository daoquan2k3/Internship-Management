# Tài liệu Cấu trúc & Chức năng Giao diện Frontend (React / Vite)

Tài liệu này cung cấp bức tranh tổng quan về các thư mục và file `.jsx` chính trong thư mục `src` của Frontend, giúp bạn dễ dàng nắm bắt component nào đang phục vụ tính năng gì.

## 1. Các File gốc và Layout chung
- `App.jsx`, `main.jsx`: Điểm bắt đầu (Entry point) của ứng dụng React. Chứa cấu hình Router và Context Provider.
- `LandingPage.jsx`: Trang chủ giới thiệu hệ thống cho người chưa đăng nhập.
- `MainDashboard.jsx`: Component điều hướng (Router Outlet) sau khi đăng nhập, dựa vào Role để chuyển hướng đến Dashboard tương ứng (Teacher, Student, Admin...).

**Thư mục `components/layout/`**:
- `Sidebar.jsx`, `TopBar.jsx`, `AppLayout.jsx`: Các component khung giao diện chính của hệ thống.
- `navigationConfig.jsx`: Chứa cấu hình menu thanh bên (Sidebar) phân quyền theo từng Role (Admin, Teacher, Student...).

## 2. Thư mục `pages/auth/` (Xác thực)
- `LoginPage.jsx`: Màn hình Đăng nhập.
- `RegisterPage.jsx` & `RegisterForm.jsx`: Màn hình và Form Đăng ký tài khoản (hỗ trợ nhiều loại tài khoản: Sinh viên, Giáo viên...).
- `ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx`: Màn hình quên mật khẩu và đặt lại mật khẩu.

## 3. Thư mục `pages/admin/` (Quản trị hệ thống)
- `AdminDashboard.jsx`: Dashboard chính của Admin, chứa biểu đồ và thống kê tổng quan (AdminHeroBanner, AdminCharts).
- Chức năng quản lý chi tiết nằm trong `pages/management/` (Admin dùng chung với UniRep).

## 4. Thư mục `pages/management/` (Dùng chung cho Admin, Teacher, UniRep)
Được chia thành các module chức năng quản lý riêng biệt:
- **`users/`, `students/`, `mentors/`, `universities/`**: Chứa các màn hình dạng Data Table (`UsersManagement.jsx`, `StudentsManagement.jsx`...) để CRUD dữ liệu người dùng và trường học.
- **`companies/`**: Chứa màn hình quản lý công ty đối tác (`CompaniesManagement.jsx`), hỗ trợ CRUD và đánh dấu uy tín (Chỉ Admin).
- **`reports/ReportManagement.jsx`**: Nơi Giáo viên quản lý các báo cáo của lớp, với 3 Tab chính:
  1. *Báo cáo theo giai đoạn*: Xem và chấm điểm báo cáo định kỳ (sử dụng `ReportGradeModal`).
  2. *Báo cáo cuối kỳ*: Duyệt phiếu đánh giá bản cứng và nhập điểm (sử dụng `FinalGradeModal`).
  3. *Phân bổ thực tập*: Xem và xuất Excel danh sách phân bổ.
- **`assessment-rounds/AssessmentRoundsManagement.jsx`**: Quản lý thiết lập các đợt/tuần nộp báo cáo.

## 5. Thư mục `pages/student/` (Không gian của Sinh viên)
- `StudentDashboard.jsx`: Màn hình tổng quan, hiển thị thống kê điểm, thời gian và thông báo (StudentHeroBanner, StudentStatsProgress).
- **`StudentWorkflow.jsx`**: Trái tim của ứng dụng dành cho sinh viên. Chứa luồng các bước thực tập:
  1. Xin gia nhập trường (`JoinUniversityStep.jsx`)
  2. Nộp đơn vào lớp thực tập kèm thông tin doanh nghiệp (`InternshipApplicationStep.jsx`)
  3. Nộp báo cáo định kỳ các tuần (`StudentReportSubmit.jsx`, `RoundReportCard.jsx`)
  4. Nộp phiếu đánh giá cuối kỳ có xác nhận công ty (`FinalEvaluationStep.jsx`)

## 6. Thư mục `pages/teacher/` (Không gian của Giáo viên)
- `TeacherDashboard.jsx`: Thống kê tổng số lớp, số báo cáo chờ duyệt.
- `TeacherApplications.jsx`: Quản lý Đơn đăng ký thực tập của sinh viên. Giáo viên có quyền Duyệt hoặc Từ chối (nhập lý do). Đơn ứng tuyển vào công ty đối tác sẽ hiển thị "Đang chờ DN duyệt".
- `MyStudents.jsx`: Hiển thị danh sách sinh viên hiện tại trong lớp (đã duyệt). Bổ sung thêm cột thông tin Công ty thực tập.
- **`MyMentor.jsx`** (Thực ra nằm ở `pages/student/`): Cố vấn hướng dẫn của tôi. Gồm 2 phần: Cố vấn phân bổ từ hệ thống (lấy từ `/mentors`) và Người hướng dẫn tại doanh nghiệp (do sinh viên tự khai báo `externalMentorName` trong profile).

## 7. Thư mục `pages/unirep/` (Đại diện Trường Đại học)
- `UniRepDashboard.jsx`: Dashboard của đại diện trường.
- `UniversityJoinRequests.jsx`: Nơi Uni Rep duyệt đơn xin gia nhập trường của các Sinh viên/Giáo viên mới đăng ký.
- `UniversityClasses.jsx`: Quản lý danh sách lớp học và phân công giáo viên chủ nhiệm.
- `FinalEvaluationsRep.jsx`: Quản lý chung toàn bộ điểm cuối kỳ của toàn trường.

## 8. Thư mục `pages/company-rep/` (Đại diện Doanh Nghiệp)
- `CompanyRepDashboard.jsx`: Dashboard tổng quan thống kê của đại diện doanh nghiệp.
- `CompanyApplications.jsx`: Quản lý Đơn đăng ký thực tập của sinh viên ứng tuyển vào công ty. Company Rep có quyền Duyệt hoặc Từ chối (nhập lý do). Khi từ chối, đơn sẽ tự động bị xóa thông tin công ty và quay trở về giao diện Giáo viên ở dạng "Chưa có công ty".

## 9. Thư mục `pages/settings/` (Cài đặt & Profile)
- `SettingsPage.jsx`: Trang thiết lập cá nhân chung cho mọi loại tài khoản.
- `ProfileForm.jsx`, `PasswordForm.jsx`: Cập nhật thông tin cá nhân (Profile) và Đổi mật khẩu.

## 9. Thư mục `components/notification/` (Thông báo real-time)
- `NotificationBell.jsx`: Chuông thông báo trên TopBar (Header).
- `NotificationList.jsx`: Hiển thị danh sách các thông báo (khi được RabbitMQ Backend đẩy về).

---
**Tóm tắt luồng dữ liệu (Data Flow):**
1. **Student** thao tác chủ yếu tại `StudentWorkflow.jsx` -> Gọi APIs ở Backend -> Data lưu vào DB.
2. **Teacher** vào `ReportManagement.jsx` hoặc `TeacherApplications.jsx` -> Nhận dữ liệu -> Chấm điểm/Duyệt -> Trigger Notification gửi lại cho Student (đọc ở `NotificationBell.jsx`).
3. **Uni Rep / Admin** xem các chỉ số ở Dashboard và Data Tables trong thư mục `management/` và `unirep/`.
