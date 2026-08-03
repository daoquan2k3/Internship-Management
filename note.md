ROLE_ADMIN:
- dashboard
USER_MANAGERMENT:
- add/update/delete user:
- filter by role:
- add/update/delete student + search student + list 
- add/update/delete teacher/unirep/comprep/compmentor + search + list
SCHOOL_MANAGERMENT:
- add/update/delete school + search
- list school
REPORT_MANAGERMENT:
- Báo cáo theo giai đoạn:
    - lọc theo lớp/tuần
    - tìm kiếm
    - Xuất excel/zip file
    - chấm điểm/tải file báo cáo
    - phân tích báo cáo bằng AI
- Báo cáo cuối kỳ:
    - Xuất excel/zip file theo lớp or all
    - chấm điểm/tải file báo cáo
    - chỉnh sửa điểm + lọc + tìm kiếm

ROLE_MENTOR(Quản lý các đại diện và giáo viên)
- Dashboard
- thêm sửa xóa lọc tìm kiếm các đại diện

ROLE_UNIREP (Đại diện trường)
- Dashboard:
    - Thống kê chỉ số hoạt động trường (tổng lớp thực tập, tổng sinh viên, đơn gia nhập chờ duyệt, tổng phiếu đánh giá cuối kỳ)
- Quản lý Yêu cầu gia nhập trường:
    - Xem danh sách yêu cầu gia nhập theo cơ sở đào tạo / trường học
    - Lọc theo trạng thái (Pending, Approved, Rejected) & tìm kiếm sinh viên
    - Phê duyệt / từ chối đơn gia nhập trường của sinh viên
    - Chỉnh sửa trạng thái yêu cầu
- Quản lý Lớp thực tập:
    - Xem danh sách lớp thực tập theo trường (lọc theo học kỳ, năm học)
    - Thêm / sửa / xóa lớp thực tập
    - Phân công Giảng viên phụ trách lớp học
    - Thêm sinh viên vào lớp / xóa sinh viên khỏi lớp học
- Duyệt Đánh giá cuối kỳ (Cấp Trường):
    - Xem danh sách phiếu đánh giá cuối kỳ theo lớp thực tập
    - Kiểm tra và cập nhật trạng thái nộp bản cứng báo cáo (Đã nộp / Chưa nộp)
    - Phê duyệt / từ chối phiếu đánh giá cuối kỳ của sinh viên (chốt điểm cấp trường)
    - Xem trực tuyến hoặc tải trực tiếp các file báo cáo đính kèm (PDF, DOCX, XLSX...)

ROLE_TEACHER (Giáo viên phụ trách)
- Dashboard
- Quản lý Sinh viên hướng dẫn (My Students):
    - Xem danh sách sinh viên được phân công hướng dẫn (Grid / Table view)
    - Theo dõi tiến độ thực tập và thông tin liên hệ của từng sinh viên
- Quản lý Đơn xin vào lớp thực tập:
    - Xem danh sách đơn đăng ký vào lớp thực tập của sinh viên
    - Cập nhật điều kiện thực tập (xác nhận nộp bản cứng, đủ điều kiện tín chỉ)
    - Phê duyệt đơn xin vào lớp thực tập
- Quản lý Vòng đánh giá giữa kỳ:
    - Tạo mới, chỉnh sửa và theo dõi các vòng đánh giá (Assessment Rounds) cho lớp thực tập
- Quản lý Báo cáo & Đánh giá:
    - Báo cáo theo giai đoạn: lọc theo lớp/tuần, tìm kiếm sinh viên, xuất file Excel/ZIP, chấm điểm / nhận xét / tải file báo cáo, phân tích báo cáo tự động bằng AI
    - Báo cáo cuối kỳ: xem danh sách theo lớp, quản lý thu bản cứng, chấm điểm và nhận xét báo cáo cuối kỳ, xuất file Excel/ZIP toàn bộ báo cáo

ROLE_STUDENT (Sinh viên thực tập)
- Dashboard:
    - Xem tổng quan tiến độ thực tập, thống kê điểm số, thông báo mới và lịch sử báo cáo gần đây
- Quy trình Thực tập (Workflow 4 bước):
    - Bước 1 (Xin gia nhập trường): Gửi yêu cầu gia nhập cơ sở đào tạo / trường học, xem trạng thái phê duyệt
    - Bước 2 (Đăng ký lớp thực tập): Chọn lớp thực tập, điền thông tin doanh nghiệp / vị trí thực tập, gửi đơn xin vào lớp. (Lưu ý: Sinh viên có thể đăng ký tối đa 2 lớp cùng lúc, hoặc sau khi hoàn thành 1 lớp (đến bước 4) có thể quay lại đăng ký tiếp, hoặc đăng ký lại nếu lớp trước đó bị đánh giá trượt).
    - Bước 3 (Nộp báo cáo định kỳ): Upload file báo cáo theo tuần/vòng đánh giá, ghi chú nội dung công việc, theo dõi điểm số và nhận xét từ giảng viên/mentor
    - Bước 4 (Nộp Báo cáo & Đánh giá cuối kỳ): Nộp file báo cáo tổng kết (DOCX/PDF), tự đánh giá kết quả, theo dõi điểm số và lời phê từ Cố vấn DN, Giảng viên và Đại diện trường
- Người hướng dẫn của tôi (My Mentor):
    - Xem thông tin chi tiết (họ tên, email, số điện thoại, đơn vị công tác) của Giảng viên phụ trách và Cố vấn doanh nghiệp

ROLE_COMPANY_REP (Đại diện doanh nghiệp)
- Dashboard:
    - Thống kê tổng số sinh viên thực tập, chỉ số hoạt động chung của doanh nghiệp.
- Danh sách Sinh viên & Đơn vào:
    - Xem danh sách tất cả sinh viên đang thực tập tại doanh nghiệp, kèm thông tin cơ sở đào tạo và đơn vị phụ trách.
    - Duyệt và phê duyệt đơn xin vào thực tập.
- Quản lý Đơn xin vào lớp thực tập (của sinh viên):
    - Phê duyệt đơn xin vào lớp thực tập, xác nhận vị trí công việc.
    - Từ chối đơn kèm lý do, đồng thời gửi thông báo tới Sinh viên & Trường.
- Quản lý Người hướng dẫn nội bộ (Company Mentor):
    - Thêm mới, cập nhật hoặc xóa Người hướng dẫn nội bộ (Company Mentor).
    - Gán Company Mentor phụ trách từng sinh viên hoặc từng nhóm sinh viên.

ROLE_COMPANY_MENTOR (Cố vấn doanh nghiệp)
- Dashboard:
    - Thống kê số lượng sinh viên được giao phụ trách.
- Danh sách Sinh viên phụ trách (My Students):
    - Xem danh sách sinh viên được giao phụ trách bởi doanh nghiệp.

---

## MAPPING CÁC ENTITY VÀ CHỨC NĂNG TƯƠNG ỨNG

Dưới đây là danh sách các Entity (Bảng dữ liệu) phụ trách cho các nghiệp vụ đã nêu ở trên:

1. **User.java / Student.java / Mentor.java / Company.java / University.java**
   - **Phụ trách**: Quản lý tài khoản, phân quyền (Role) và thông tin hồ sơ của các bên tham gia (Admin, UniRep, Teacher, CompanyRep, CompanyMentor, Student).
   - **Nghiệp vụ**: User Management, School Management, Quản lý đại diện, Cố vấn doanh nghiệp.

2. **UniversityJoinRequest.java**
   - **Phụ trách**: Xử lý yêu cầu gia nhập cơ sở đào tạo của sinh viên.
   - **Nghiệp vụ**: Bước 1 của sinh viên (Xin gia nhập trường), UniRep duyệt đơn gia nhập.

3. **UniversityClass.java**
   - **Phụ trách**: Quản lý các lớp thực tập.
   - **Nghiệp vụ**: UniRep thêm/sửa/xóa lớp, phân công giảng viên. Sinh viên chọn lớp để đăng ký.

4. **InternshipApplication.java**
   - **Phụ trách**: Quản lý đơn xin vào lớp thực tập của sinh viên (bao gồm thông tin doanh nghiệp/vị trí sinh viên tự điền).
   - **Nghiệp vụ**: Bước 2 của sinh viên. Teacher và CompanyRep phê duyệt đơn. UniRep cập nhật điều kiện (tín chỉ, bản cứng).

5. **InternshipAssignment.java**
   - **Phụ trách**: Liên kết chính thức giữa Sinh viên, Lớp thực tập, Giảng viên và Cố vấn doanh nghiệp sau khi đơn được duyệt.
   - **Nghiệp vụ**: Cung cấp dữ liệu cho "My Students" (Teacher, Company Mentor) và "My Mentor" (Student).

6. **InternshipPhase.java / AssessmentRound.java**
   - **Phụ trách**: Cấu hình các giai đoạn và vòng đánh giá giữa kỳ.
   - **Nghiệp vụ**: Teacher tạo mới, theo dõi các vòng đánh giá (Assessment Rounds) theo thời gian.

7. **Report.java / AssessmentResult.java**
   - **Phụ trách**: Lưu trữ file báo cáo định kỳ (tuần/vòng), nhận xét, điểm số và kết quả phân tích AI.
   - **Nghiệp vụ**: Bước 3 của sinh viên (nộp báo cáo định kỳ). Teacher chấm điểm, AI phân tích, xuất file Excel/ZIP.

8. **FinalEvaluationForm.java**
   - **Phụ trách**: Quản lý phiếu đánh giá, báo cáo tổng kết cuối kỳ và trạng thái nộp bản cứng.
   - **Nghiệp vụ**: Bước 4 của sinh viên. Teacher, Company Mentor chấm điểm/nhận xét. UniRep duyệt điểm cấp trường và xác nhận bản cứng. Xuất file tổng hợp.

9. **Notification.java**
    - **Phụ trách**: Hệ thống thông báo tự động.
    - **Nghiệp vụ**: Gửi thông báo khi đơn được duyệt/từ chối, có báo cáo mới, hoặc thông báo chung trên Dashboard của mọi Role.

10. **SiteTraffic.java**
    - **Phụ trách**: Theo dõi lưu lượng truy cập hệ thống.
    - **Nghiệp vụ**: Cung cấp một số chỉ số thống kê truy cập trên Dashboard (giữ lại theo yêu cầu đặc thù).

