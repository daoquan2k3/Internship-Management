# Tài liệu Ánh xạ Backend Services và Frontend UI

Tài liệu này giải thích công dụng của từng hàm trong các file Service của Backend, và chúng được gọi từ chức năng nào ở Frontend.

## 1. IAuthService.java (Xác thực và Phân quyền)
- `login`: Đăng nhập vào hệ thống. Frontend sử dụng ở trang **Đăng nhập** (`/auth/login`).
- `register`: Đăng ký tài khoản mới. Frontend sử dụng ở trang **Đăng ký** (`/auth/register`).

## 2. IUserService.java (Quản lý tài khoản chung)
- `getAllUsers`, `getUserById`: Lấy danh sách hoặc chi tiết người dùng. Frontend dùng ở **Quản lý tài khoản (Admin)**.
- `updateUser`, `deleteUser`: Cập nhật/Xóa tài khoản. Frontend dùng ở **Quản lý tài khoản**.
- `getMyProfile`, `updateMyProfile`, `changePassword`: Lấy/cập nhật thông tin cá nhân. Dùng ở trang **Thiết lập tài khoản (Settings)**.

## 3. IUniversityService.java (Quản lý Trường Đại học)
- `createUniversity`, `updateUniversity`, `deleteUniversity`: Quản lý trường. Dùng ở **Admin Dashboard**.
- `getAllUniversities`: Lấy danh sách trường. Frontend gọi khi Sinh viên/Giáo viên muốn chọn trường để nộp đơn xin tham gia.

## 4. IUniversityJoinRequestService.java (Yêu cầu tham gia Trường Đại học)
- `createRequest`: Nộp đơn xin gia nhập trường. Dùng ở bước đầu tiên khi Sinh viên/Giáo viên mới đăng ký tài khoản.
- `updateStatus`: Duyệt đơn (Chấp nhận/Từ chối). Dùng ở màn hình **Duyệt yêu cầu** của University Rep.
- `getRequestsByUniversity`, `getMyRequests`: Lấy danh sách đơn xin gia nhập của trường hoặc của chính User đang đăng nhập.

## 5. IUniversityClassService.java (Quản lý Lớp Thực Tập)
- `createClass`, `updateClass`: Uni Rep tạo và sửa lớp thực tập. Dùng ở **Quản lý Lớp (Uni Rep)**.
- `assignTeacher`: Phân công giáo viên chủ nhiệm lớp. Dùng ở **Quản lý Lớp (Uni Rep)**.
- `getClassesByUniversity`, `getAllClasses`, `getMyClasses`: Lấy danh sách lớp. Dùng trong dropdown chọn lớp của Sinh viên khi nộp đơn (`InternshipApplicationStep.jsx`), và ở Dashboard của Giáo viên.

## 6. InternshipApplicationService.java (Đơn đăng ký vào lớp thực tập)
- `submitApplication`: Sinh viên nộp đơn xin vào lớp (kèm thông tin công ty và file). Có kiểm tra xem mã số thuế nhập vào đã tồn tại trên hệ thống chưa. Frontend dùng ở `InternshipApplicationStep.jsx` (Student).
- `updateCompanyInfo`, `updateConditions`: Cập nhật thông tin công ty hoặc điều kiện (bản cứng, tín chỉ).
- `approveApplication`: Duyệt đơn (Được gọi bởi Giáo viên đối với đơn không có cty/nhập tay, hoặc Công ty đối với đơn ứng tuyển).
- `rejectApplication`: Từ chối đơn (kèm lý do `RejectApplicationRequest`). Nếu Giáo viên từ chối, đơn chuyển trạng thái `REJECTED`. Nếu Đại diện công ty từ chối, xóa thông tin công ty (giữ `PENDING`) để thành đơn "Chưa có công ty" và Giáo viên có thể duyệt sau. Gửi email/notification kèm lý do đầy đủ.
- `getApplicationsByClass`, `getMyApplications`, `getApplicationsByCompany`: Lấy danh sách đơn của lớp, của cá nhân, hoặc của công ty cụ thể.
- `getAllCompanies`: Lấy danh sách các công ty trên hệ thống. Dùng ở dropdown chọn công ty lúc nộp đơn.
- `updateConditions`: Cập nhật trạng thái bản cứng và tín chỉ của đơn. Dùng ở bảng Quản lý Đơn của Giáo viên.

## 7. IInternshipPlacementService.java (Phân bổ Thực tập)
- `createPlacement`: Tự động tạo bản ghi phân bổ khi Giáo viên duyệt đơn. Không gọi trực tiếp từ Frontend.
- `getPlacementsByClass`: Lấy danh sách sinh viên đã phân bổ. Dùng ở **Tab Phân bổ thực tập** trong `ReportManagement.jsx` (Giáo viên).
- `assignMentor`, `updateCompany`: Cập nhật người hướng dẫn (Mentor) hoặc doanh nghiệp nếu có thay đổi. Dùng ở tính năng Chỉnh sửa phân bổ. `assignMentor` đồng thời đồng bộ tên và SĐT của mentor hệ thống sang trường `externalMentorName` và `externalMentorPhone` của Profile Student.
- `exportExcel`: Tải danh sách phân bổ dưới dạng Excel. Dùng ở nút **"Xuất Data"** của Tab Phân bổ.

## 8. IAssessmentRoundsService.java (Vòng/Tuần đánh giá)
- `createRound`, `updateRound`, `deleteRound`: Giáo viên tạo các mốc nộp báo cáo định kỳ (Tuần 1, Tuần 2...). Dùng ở trang **Cấu hình Đợt đánh giá (Teacher)**.
- `getAllRounds`: Lấy danh sách đợt đánh giá để lọc. Dùng ở dropdown lọc của `ReportManagement.jsx`.

## 9. IReportService.java (Báo cáo thực tập định kỳ)
- `submitReport`: Sinh viên nộp báo cáo tuần/tháng. Dùng ở **Workflow của Sinh viên** (`StudentWorkflow.jsx`).
- `gradeReport`, `saveBulkGrades`: Mentor/Giáo viên chấm điểm báo cáo. Dùng trong Modal **Chấm Điểm** của `ReportManagement.jsx`. (Hàm này có gửi Notification RabbitMQ).
- `getAllReports`: Hiển thị danh sách báo cáo. Dùng ở Tab **Báo cáo theo giai đoạn** trong `ReportManagement.jsx`.
- `analyzeReportAI`: Chức năng phân tích báo cáo bằng AI. Dùng ở nút **Phân tích AI** trên từng card báo cáo.
- `exportExcel`, `exportZip`: Xuất điểm hoặc tải toàn bộ file báo cáo.

## 10. IAssessmentResultService.java (Kết quả đánh giá từng đợt)
- `createAssessmentResult`, `updateAssessmentResult`: Ghi nhận kết quả chấm điểm định kỳ vào DB, liên kết với Report. (Kích hoạt Notification).
- `getResultsByRound`: Lấy danh sách kết quả của một đợt. Thường kết hợp chung với `ReportService`.

## 11. IFinalEvaluationFormService.java (Phiếu Đánh Giá Cuối Kỳ)
- `submitForm`: Sinh viên nộp phiếu đánh giá cuối kỳ đã có chữ ký, điểm từ doanh nghiệp. Dùng ở `FinalEvaluationStep.jsx` (Student).
- `updateCompanyScore`: Sửa điểm công ty nếu cần. Dùng ở Modal **Sửa điểm doanh nghiệp** trong `ReportManagement.jsx`.
- `evaluateByTeacher`: Giáo viên chấm điểm cuối kỳ và phê duyệt. Dùng ở Modal **Chấm điểm cuối kỳ** trong `ReportManagement.jsx`.
- `getFormsForTeacher`, `getMyForms`: Lấy danh sách báo cáo cuối kỳ để hiển thị ở Tab **Báo cáo cuối kỳ**.
- `exportExcel`, `exportZip`: Tải danh sách điểm cuối kỳ.

## 12. IStudentService.java & IMentorService.java
- Cung cấp các thao tác CRUD cơ bản cho hồ sơ Sinh viên và Mentor.
- `getStudentByCode`, `getMentorById`: Lấy thông tin chi tiết. Dùng ở màn hình **Hồ sơ Cá nhân**.

## 13. IDashboardService.java (Thống kê Tổng quan)
- `getAdminDashboard`, `getUniversityRepDashboard`, `getTeacherDashboard`, `getStudentDashboard`: Trả về số liệu tổng quan (số lượng sinh viên, báo cáo, tỷ lệ đạt/trượt...).
- Frontend sử dụng các hàm này trong các component hiển thị Biểu đồ và Card Thống Kê ở màn hình chính (Ví dụ: `TeacherDashboard.jsx`, `MainDashboard.jsx`).

## 14. InternshipPhaseService.java & InternshipAssignmentService.java
- (Legacy/Cũ) Các service liên quan đến mô hình phân công, đợt thực tập cũ, một số chức năng đã được tối giản và thay thế bằng `IAssessmentRounds` và `IInternshipPlacement`. Mọi tính năng phân công mới đã tự động gắn vào Application & Placement.

## 15. ICompanyService.java (Quản lý Công ty)
- `searchCompanies`: Tìm kiếm và phân trang danh sách công ty. Frontend gọi ở trang **Quản lý Công ty**.
- `getCompanyById`: Lấy thông tin chi tiết một công ty.
- `createCompany`: Thêm mới công ty (Chỉ Admin). Nếu là Admin tạo, hệ thống tự động đánh dấu uy tín (`isVerified = true`).
- `updateCompany`, `deleteCompany`: Cập nhật/Xóa (Soft delete) công ty (Chỉ Admin).
