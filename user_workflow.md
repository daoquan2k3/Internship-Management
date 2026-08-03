# Luồng Quy Trình Người Dùng (User Workflow) - Hệ thống Quản lý Thực tập

Tài liệu này mô tả chi tiết quy trình nghiệp vụ (workflow) của từng đối tượng người dùng (Role) khi sử dụng Hệ thống Quản lý Thực tập.

---

## 1. Sinh Viên (Student)

Luồng làm việc của sinh viên diễn ra chủ yếu tại **Quy trình thực tập (`StudentWorkflow`)** bao gồm các bước sau:

1. **Đăng ký và xin gia nhập trường (Join University):**
   - Sinh viên đăng ký tài khoản với role `ROLE_STUDENT`.
   - Lựa chọn Trường Đại học mình đang theo học từ danh sách để gửi **Đơn xin gia nhập**.
   - Chờ Đại diện trường (Uni Rep) duyệt yêu cầu.

2. **Nộp đơn xin thực tập (Internship Application):**
   - Sau khi được trường duyệt, sinh viên chọn lớp thực tập (do Giáo viên quản lý).
   - Nộp đơn đăng ký thực tập, với 3 lựa chọn về công ty:
     - **Ứng tuyển công ty đối tác:** Chọn từ danh sách công ty đã có trên hệ thống. (Đơn sẽ do Đại diện công ty đó duyệt).
     - **Tự điền công ty:** Tự nhập thông tin công ty mình tìm được. Hệ thống sẽ check trùng lặp mã số thuế. (Đơn này do Giáo viên duyệt).
     - **Chưa có công ty:** Gửi thẳng vào lớp để chờ Trường/Giáo viên sắp xếp. (Đơn này do Giáo viên duyệt).

3. **Thực tập và Nộp báo cáo định kỳ (Periodic Reports):**
   - Sau khi đơn được duyệt, sinh viên chính thức được phân bổ (Placement).
   - Sinh viên xem danh sách các Tuần/Vòng đánh giá (Assessment Rounds) do giáo viên cấu hình.
   - Nộp báo cáo hàng tuần/tháng (có upload file).
   - Đọc nhận xét và xem điểm do Mentor/Giáo viên chấm.

4. **Đánh giá cuối kỳ (Final Evaluation):**
   - Tải về mẫu phiếu đánh giá cuối kỳ.
   - Điền điểm và lấy chữ ký xác nhận bản cứng từ doanh nghiệp.
   - Scan và nộp phiếu đánh giá (File PDF) lên hệ thống, kèm theo điểm số công ty tự đánh giá.
   - Chờ Giáo viên phê duyệt và nhập điểm tổng kết.

---

## 2. Giáo Viên Phụ Trách (Teacher)

Giáo viên chủ nhiệm lớp thực tập đóng vai trò theo sát tiến độ của sinh viên:

1. **Tạo và Cấu hình Đợt đánh giá:**
   - Vào **Vòng đánh giá giữa kỳ**, thiết lập thời gian (Start Date, End Date) cho các đợt nộp báo cáo (Ví dụ: Tuần 1, Tuần 2, Báo cáo giữa kỳ).

2. **Quản lý Sinh viên và Duyệt đơn ứng tuyển:**
   - Xem danh sách sinh viên lớp mình tại **Sinh viên hướng dẫn**.
   - Tại **Đơn xin vào lớp**, duyệt các đơn ứng tuyển của sinh viên. (Lưu ý: Giáo viên chỉ duyệt những sinh viên chưa có công ty hoặc tự tìm công ty bên ngoài. Những sinh viên ứng tuyển công ty trên hệ thống sẽ do công ty đó duyệt).
   - Xác nhận sinh viên đã nộp bản cứng hoặc đủ điều kiện tín chỉ.

3. **Chấm điểm Báo cáo Định kỳ & Cuối kỳ:**
   - Vào **Quản lý Báo cáo & Đánh giá**.
   - Xem và chấm điểm báo cáo hàng tuần của sinh viên. (Có sự hỗ trợ từ AI chấm điểm tự động/nhận xét).
   - Ở cuối kỳ, đối chiếu file scan phiếu đánh giá của sinh viên để chốt điểm số cuối cùng.
   - Có thể xuất điểm và báo cáo ra file Excel.

---

## 3. Đại Diện Doanh Nghiệp (Company Rep)

Đại diện công ty quản lý hoạt động tiếp nhận thực tập sinh:

1. **Duyệt đơn ứng tuyển của sinh viên:**
   - Vào mục **Sinh viên & Đơn vào**.
   - Kiểm tra CV và duyệt các sinh viên chọn công ty của mình khi nộp đơn. Việc duyệt này sẽ tự động thêm sinh viên vào danh sách thực tập tại doanh nghiệp (Placement).

2. **Quản lý Cố vấn Nội bộ (Company Mentor):**
   - Vào mục **Người hướng dẫn nội bộ**.
   - Tạo tài khoản hoặc thêm các nhân viên của công ty làm Cố vấn (Mentor).
   - Gán Cố vấn (Assign Mentor) cho từng sinh viên đang thực tập tại công ty.

---

## 4. Cố Vấn Doanh Nghiệp (Company Mentor)

Người hướng dẫn trực tiếp sinh viên tại nơi làm việc:

1. **Theo dõi tiến độ:** Xem danh sách sinh viên mình được phân công phụ trách.
2. **Chấm điểm báo cáo:** Đọc báo cáo định kỳ của sinh viên và gửi nhận xét, phản hồi, chấm điểm chuyên môn.

---

## 5. Đại Diện Trường Đại Học (University Rep)

Người quản lý toàn bộ quá trình thực tập của một trường:

1. **Duyệt yêu cầu tham gia:** Duyệt đơn xin gia nhập trường của Sinh viên và Giáo viên mới đăng ký.
2. **Quản lý Lớp thực tập:** 
   - Tạo các lớp thực tập.
   - Phân công Giáo viên chủ nhiệm cho từng lớp.
3. **Quản lý Tổng thể:** Theo dõi tiến độ chung, xem và xuất các file đánh giá cuối kỳ của toàn trường.

---

## 6. Quản Trị Viên Hệ Thống (Admin)

Super Admin kiểm soát toàn bộ hệ thống (dành cho người vận hành nền tảng):

1. **Quản lý Trường học:** Khởi tạo, chỉnh sửa các Trường Đại Học tham gia nền tảng. Cấp tài khoản cho Uni Rep.
2. **Quản lý Người dùng toàn cục:** Kiểm soát, khóa, sửa mọi tài khoản trên hệ thống (Students, Mentors, Teachers...).
3. **Quản lý Phân quyền:** Phân vai trò (Role) cho người dùng.
4. **Theo dõi Log & Thống kê:** Xem lưu lượng truy cập hệ thống (System Traffic), thống kê số lượng hồ sơ để phục vụ vận hành.
