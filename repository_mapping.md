# Tài liệu Ánh xạ Backend Repositories (JPA/Query)

Tài liệu này giải thích công dụng của các hàm Query tùy chỉnh (`@Query` hoặc Spring Data Method) trong từng file Repository của Backend và ý nghĩa của chúng khi phục vụ cho Frontend.

## 1. IUserRepository.java
- `findByUsername`, `findByEmail`: Tìm kiếm User để xác thực đăng nhập (`AuthService`) hoặc kiểm tra email tồn tại.
- `existsByUsername`, `existsByEmail`: Validate form đăng ký để tránh trùng lặp tài khoản.
- `searchUsers`: Truy vấn tìm kiếm User kết hợp phân trang, lọc theo tên, email. Dùng ở trang **Admin - Quản lý tài khoản**.
- `countByRole`: Lấy số lượng người dùng theo Role (Sinh viên, Giáo viên, Mentor...). Phục vụ hiển thị biểu đồ tròn tại **Admin Dashboard**.

## 2. IStudentRepository.java / IMentorRepository.java / CompanyRepository.java
- `findByStudentCode` / `findByUser_UserId`: Tìm thông tin chi tiết Sinh viên/Mentor theo mã số hoặc ID tài khoản đăng nhập. Dùng khi user xem Profile của mình hoặc Teacher click vào tên sinh viên.
- `searchStudents`, `searchMentors`, `searchCompanies`: Sử dụng `@Query` (JPQL) kèm phân trang để lấy danh sách Entity. Phục vụ cho các trang **Quản lý danh mục (Admin/UniRep)**.

## 3. UniversityRepository.java & UniversityJoinRequestRepository.java
- `searchUniversities`: Tìm kiếm trường theo tên/mã, có phân trang. Dùng ở màn hình **Chọn trường**.
- `findByUser_UserId`: Tìm thông tin đại diện trường thông qua User.
- `findByUniversity_UniversityIdAndStatus`: Lấy danh sách sinh viên/giáo viên đang xin gia nhập trường theo trạng thái (PENDING/APPROVED). Dùng ở màn hình **Duyệt yêu cầu** của Uni Rep.

## 4. UniversityClassRepository.java
- `searchClasses`: Tìm lớp học theo mã/tên. Phục vụ màn hình **Quản lý Lớp**.
- `findByTeacher_TeacherId`: Truy vấn danh sách các lớp mà một giáo viên đang làm chủ nhiệm. Phục vụ hiển thị Dropdown **"Chọn lớp"** ở đầu trang `TeacherDashboard` và `ReportManagement`.
- `findByUniversity_UniversityId`: Truy vấn lớp thuộc 1 trường.
- `countClassesByUniversityAndTeacher`: Lấy tổng số lớp. Phục vụ Dashboard Thống kê.

## 5. InternshipApplicationRepository.java
- `findByUniversityClass_ClassId`: Truy vấn toàn bộ đơn đăng ký vào một lớp cụ thể. Phục vụ **Danh sách duyệt đơn** của Giáo viên (`TeacherApplications.jsx`).
- `findByStudent_StudentId`: Lấy lịch sử nộp đơn của 1 Sinh viên. Dùng hiển thị trạng thái đơn ở **Student Dashboard**.
- `countByUniversityClass_ClassIdAndStatus`: Đếm số đơn chờ duyệt/đã duyệt trong 1 lớp. Phục vụ các chỉ số Badge hiển thị số lượng chờ ở giao diện Giáo viên.
- `findByCompany_CompanyId`: Lấy danh sách các đơn ứng tuyển nộp thẳng vào một công ty cụ thể. Phục vụ giao diện duyệt đơn của Đại diện công ty (`CompanyApplications.jsx`).

## 6. InternshipPlacementRepository.java
- `findByUniversityClass_ClassId`: Lấy toàn bộ danh sách phân bổ của một lớp. Dùng ở Tab **Phân bổ thực tập** (`ReportManagement.jsx`) và tính năng **Xuất Excel phân bổ**.
- `findByCompany_CompanyId`: Lấy danh sách sinh viên được phân bổ về một công ty. Dùng ở màn hình của **Company Rep**.
- `findByStudent_StudentIdAndUniversityClass_ClassId`: Tránh trùng lặp khi duyệt đơn (mỗi sinh viên chỉ có 1 placement trong 1 lớp).

## 7. IReportRepository.java
- `searchReports`: JPQL truy vấn phức tạp kết hợp `studentName`, `studentCode`, `classId`, `roundId`. Dùng để xuất ra danh sách Báo cáo lọc theo mọi tiêu chí trên trang **Quản lý Báo cáo (`ReportManagement.jsx`)**.
- `findByStudentIdAndRoundId`: Kiểm tra xem sinh viên đã nộp báo cáo cho Tuần/Vòng cụ thể hay chưa. (Phục vụ Validate nộp báo cáo).
- `countByRoundIdAndStatus`: Lấy thống kê số báo cáo "Đã chấm điểm" / "Chờ chấm" trong 1 tuần đánh giá. Phục vụ Progress Bar hiển thị tiến độ chấm điểm.

## 8. IAssessmentRoundsRepository.java
- `searchRounds`: JPQL tìm kiếm danh sách đợt đánh giá thuộc 1 lớp. Dùng cho giao diện **Cấu hình Đợt đánh giá** của Giáo viên.
- `findActiveRoundForClass`: Tìm đợt đánh giá đang "Mở" (Active) theo ngày tháng. Giúp Frontend tự động focus vào Tuần cần nộp báo cáo hiện hành.

## 9. IAssessmentResultRepository.java
- `findByReport_ReportId`: Lấy điểm của một báo cáo cụ thể.
- `findByStudent_StudentIdAndRound_RoundId`: Lấy điểm của sinh viên trong một tuần nhất định. Dùng ở trang xem chi tiết điểm `StudentWorkflow.jsx`.
- Các hàm thống kê đếm điểm (ví dụ: đếm số lượng đạt >= 5, trượt < 5): Sử dụng Native Query hoặc JPQL `COUNT(r)`. Dùng hiển thị biểu đồ cột phân bổ điểm số ở **Teacher Dashboard**.

## 10. FinalEvaluationFormRepository.java
- `findByUniversityClass_ClassId`: Lấy danh sách phiếu đánh giá cuối kỳ của toàn bộ sinh viên trong lớp. Dùng ở Tab **Báo cáo cuối kỳ** (`ReportManagement.jsx`).
- `findByStudent_StudentId`: Lấy phiếu đánh giá cuối kỳ cá nhân.
- `countFormsByClassAndTeacherStatus`: Đếm số lượng sinh viên đã nộp phiếu nhưng Giáo viên chưa duyệt (PENDING). Phục vụ Alert/Badge nhắc nhở giáo viên chấm điểm.

## 11. INotificationRepository.java
- `findByRecipientId`: Lấy danh sách thông báo của User. Dùng để đổ dữ liệu vào **Quả chuông Thông báo (Notification Dropdown)** ở header giao diện.
- `markAsRead`: JPQL `UPDATE` trạng thái đã đọc của thông báo. Dùng khi user click vào thông báo.

## 12. SiteTrafficRepository.java (Lưu lượng truy cập)
- `getRecentTraffic`: Lấy số lượt truy cập trong 7 ngày gần nhất. Phục vụ trực tiếp cho Biểu đồ đường (Line Chart) trên **Admin Dashboard**.
