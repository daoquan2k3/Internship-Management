# Tổng hợp Biểu đồ Use Case Phân rã bằng Mermaid (Từ 3.3.5 đến 3.3.16)

Dưới đây là mã nguồn Mermaid cho tất cả các biểu đồ Use Case phân rã. Bạn có thể xem trước nội dung này bằng cách render file trên GitHub hoặc copy dán vào [Mermaid Live Editor](https://mermaid.live/).

## 3.3.5 Quản lý hồ sơ cá nhân
```mermaid
flowchart LR
    %% Actor
    User["👤 Người dùng"]:::actor

    %% System
    subgraph System["Module Quản lý Tài khoản"]
        direction TB
        UC_Update(["Cập nhật thông tin"]):::uc
        UC_Avatar(["Tải ảnh đại diện"]):::uc
        UC_Validate(["Kiểm tra hợp lệ/trùng lặp"]):::uc
        UC_Upload(["Upload ảnh (Cloudinary API)"]):::uc
        UC_ErrFormat(["Báo lỗi sai định dạng"]):::uc
        UC_ErrSize(["Báo lỗi file ảnh"]):::uc
    end

    %% Association
    User --- UC_Update
    User --- UC_Avatar

    %% Include
    UC_Update -. "<<include>>" .-> UC_Validate
    UC_Avatar -. "<<include>>" .-> UC_Upload

    %% Extend
    UC_ErrFormat -. "<<extend>>" .-> UC_Update
    UC_ErrSize -. "<<extend>>" .-> UC_Avatar

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.6 Quản lý tài khoản người dùng
```mermaid
flowchart LR
    Admin["👤 Quản trị viên (Admin)"]:::actor

    subgraph System["Module Quản lý Tài khoản"]
        direction TB
        UC_Manage(["Quản lý tài khoản"]):::uc
        UC_List(["Hiển thị danh sách"]):::uc
        UC_Auth(["Kiểm tra quyền hạn"]):::uc
        UC_Search(["Tìm kiếm/Lọc tài khoản"]):::uc
        UC_Delete(["Xóa (Vô hiệu hóa)"]):::uc
        UC_Warn(["Cảnh báo dữ liệu liên kết"]):::uc
    end

    Admin --- UC_Manage
    Admin --- UC_Delete
    Admin --- UC_Search

    UC_Manage -. "<<include>>" .-> UC_List
    UC_Manage -. "<<include>>" .-> UC_Auth
    
    UC_Search -. "<<extend>>" .-> UC_Manage
    UC_Warn -. "<<extend>>" .-> UC_Delete

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.7 Dashboard & Thống kê
```mermaid
flowchart LR
    User["👤 Người dùng chung"]:::actor
    Admin["👤 Admin"]:::actor
    GV["👤 Giáo viên"]:::actor

    subgraph System["Hệ thống Quản lý Thực tập"]
        direction TB
        UC_Dash(["Dashboard & Thống kê"]):::uc
        UC_Role(["Nhận diện vai trò"]):::uc
        UC_StatAdmin(["Xem thống kê tổng"]):::uc
        UC_StatGV(["Xem tiến độ"]):::uc
        UC_Export(["Xuất báo cáo thống kê"]):::uc
    end

    User --- UC_Dash
    Admin --- UC_StatAdmin
    GV --- UC_StatGV

    UC_Dash -. "<<include>>" .-> UC_Role
    UC_StatAdmin -. "<<extend>>" .-> UC_Dash
    UC_StatGV -. "<<extend>>" .-> UC_Dash
    UC_Export -. "<<extend>>" .-> UC_StatAdmin

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.8 Quản lý trường đại học
```mermaid
flowchart LR
    Admin["👤 Admin"]:::actor

    subgraph System["Module Cấu hình Tổ chức"]
        direction TB
        UC_Manage(["Quản lý trường"]):::uc
        UC_List(["Hiển thị danh sách"]):::uc
        UC_Add(["Thêm/Cập nhật trường"]):::uc
        UC_Code(["Tự động cấp mã trường"]):::uc
        UC_Search(["Tìm kiếm trường"]):::uc
        UC_Err(["Báo lỗi thiếu thông tin"]):::uc
    end

    Admin --- UC_Manage
    Admin --- UC_Add

    UC_Manage -. "<<include>>" .-> UC_List
    UC_Add -. "<<include>>" .-> UC_Code
    
    UC_Search -. "<<extend>>" .-> UC_Manage
    UC_Err -. "<<extend>>" .-> UC_Add

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.9 Quản lý công ty
```mermaid
flowchart LR
    Admin["👤 Admin"]:::actor

    subgraph System["Module Cấu hình Tổ chức"]
        direction TB
        UC_Manage(["Quản lý công ty"]):::uc
        UC_List(["Hiển thị danh sách"]):::uc
        UC_Add(["Thêm công ty"]):::uc
        UC_Delete(["Xóa công ty"]):::uc
        UC_Approve(["Phê duyệt công ty mới"]):::uc
        UC_Warn(["Cảnh báo từ chối xóa"]):::uc
    end

    Admin --- UC_Manage
    Admin --- UC_Add
    Admin --- UC_Delete

    UC_Manage -. "<<include>>" .-> UC_List
    UC_Approve -. "<<extend>>" .-> UC_Add
    UC_Warn -. "<<extend>>" .-> UC_Delete

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.10 Quản lý nhân sự tổ chức
```mermaid
flowchart LR
    Rep["👤 Đại diện (Trường/DN/Admin)"]:::actor

    subgraph System["Module Cấu hình Tổ chức"]
        direction TB
        UC_Manage(["Quản lý nhân sự"]):::uc
        UC_List(["Hiển thị danh sách"]):::uc
        UC_Add(["Thêm nhân sự"]):::uc
        UC_Account(["Tạo tài khoản hệ thống"]):::uc
        UC_Mail(["Gửi email thông báo"]):::uc
        UC_Err(["Báo lỗi trùng email"]):::uc
    end

    Rep --- UC_Manage
    Rep --- UC_Add

    UC_Manage -. "<<include>>" .-> UC_List
    UC_Add -. "<<include>>" .-> UC_Account
    UC_Account -. "<<include>>" .-> UC_Mail
    UC_Err -. "<<extend>>" .-> UC_Add

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.11 Quản lý lớp thực tập
```mermaid
flowchart LR
    Rep["👤 Đại diện trường"]:::actor

    subgraph System["Module Cấu hình Tổ chức"]
        direction TB
        UC_Manage(["Quản lý lớp"]):::uc
        UC_List(["Hiển thị danh sách"]):::uc
        UC_Add(["Thêm lớp mới"]):::uc
        UC_Assign(["Phân công Giáo viên"]):::uc
        UC_Excel(["Nhập danh sách lớp (Excel)"]):::uc
        UC_Err(["Báo lỗi phân công sai role"]):::uc
    end

    Rep --- UC_Manage
    Rep --- UC_Add
    Rep --- UC_Assign

    UC_Manage -. "<<include>>" .-> UC_List
    UC_Add -. "<<include>>" .-> UC_Assign
    UC_Excel -. "<<extend>>" .-> UC_Add
    UC_Err -. "<<extend>>" .-> UC_Assign

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.12 Quản lý gia nhập trường học
```mermaid
flowchart LR
    SV["👤 Sinh viên"]:::actor
    Rep["👤 Đại diện/GV"]:::actor

    subgraph System["Module Quy trình Thực tập"]
        direction TB
        UC_Req(["Gửi yêu cầu gia nhập"]):::uc
        UC_Status(["Chuyển trạng thái Chờ duyệt"]):::uc
        UC_View(["Xem danh sách duyệt"]):::uc
        UC_Approve(["Phê duyệt/Từ chối"]):::uc
        UC_Assign(["Gán vào tổ chức"]):::uc
        UC_Err(["Báo lỗi đã có trường"]):::uc
    end

    SV --- UC_Req
    Rep --- UC_View
    Rep --- UC_Approve

    UC_Req -. "<<include>>" .-> UC_Status
    UC_Approve -. "<<extend>>" .-> UC_View
    UC_Approve -. "<<include>>" .-> UC_Assign
    UC_Err -. "<<extend>>" .-> UC_Req

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.13 Quản lý gia nhập công ty
```mermaid
flowchart LR
    SV["👤 Sinh viên"]:::actor
    Rep["👤 Đại diện DN"]:::actor

    subgraph System["Module Quy trình Thực tập"]
        direction TB
        UC_Apply(["Ứng tuyển công ty"]):::uc
        UC_Notify(["Gửi thông báo cho DN"]):::uc
        UC_View(["Xem danh sách đơn"]):::uc
        UC_Approve(["Chấp nhận/Từ chối"]):::uc
        UC_Cancel(["Hủy ứng tuyển"]):::uc
        UC_Pass(["Chuyển trạng thái Đã đậu"]):::uc
        UC_Fail(["Chuyển trạng thái Từ chối"]):::uc
    end

    SV --- UC_Apply
    SV --- UC_Cancel
    Rep --- UC_View
    Rep --- UC_Approve

    UC_Apply -. "<<include>>" .-> UC_Notify
    UC_Cancel -. "<<extend>>" .-> UC_Apply
    UC_Approve -. "<<extend>>" .-> UC_View
    UC_Approve -. "<<include>>" .-> UC_Pass
    UC_Approve -. "<<include>>" .-> UC_Fail

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.14 Phân công cố vấn thực tập
```mermaid
flowchart LR
    Rep["👤 Đại diện DN"]:::actor

    subgraph System["Module Quy trình Thực tập"]
        direction TB
        UC_Assign(["Phân công Cố vấn"]):::uc
        UC_List(["Hiển thị DS SV chưa phân công"]):::uc
        UC_Save(["Lưu thông tin liên kết"]):::uc
        UC_Change(["Thay đổi Cố vấn"]):::uc
        UC_Err(["Báo lỗi vượt quá số lượng"]):::uc
    end

    Rep --- UC_Assign
    Rep --- UC_Change

    UC_Assign -. "<<include>>" .-> UC_List
    UC_Assign -. "<<include>>" .-> UC_Save
    UC_Change -. "<<extend>>" .-> UC_Assign
    UC_Err -. "<<extend>>" .-> UC_Assign

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.15 Quản lý báo cáo định kỳ
```mermaid
flowchart LR
    SV["👤 Sinh viên"]:::actor
    GV["👤 Giáo viên"]:::actor

    subgraph System["Module Quy trình Thực tập"]
        direction TB
        UC_Submit(["Nộp báo cáo"]):::uc
        UC_Grade(["Chấm điểm báo cáo"]):::uc
        UC_Save(["Lưu bài nộp"]):::uc
        UC_Update(["Cập nhật điểm & thông báo"]):::uc
        UC_ReSubmit(["Yêu cầu nộp lại"]):::uc
        UC_Block(["Chặn nộp bài"]):::uc
    end

    SV --- UC_Submit
    GV --- UC_Grade

    UC_Submit -. "<<include>>" .-> UC_Save
    UC_Grade -. "<<include>>" .-> UC_Update
    UC_ReSubmit -. "<<extend>>" .-> UC_Grade
    UC_Block -. "<<extend>>" .-> UC_Submit

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```

## 3.3.16 Quản lý báo cáo cuối kỳ
```mermaid
flowchart LR
    SV["👤 Sinh viên"]:::actor
    GV["👤 Giáo viên"]:::actor
    Admin["👤 Đại diện trường"]:::actor

    subgraph System["Module Quy trình Thực tập"]
        direction TB
        UC_Submit(["Nộp báo cáo tổng kết"]):::uc
        UC_Grade(["Chấm điểm cuối cùng"]):::uc
        UC_Approve(["Duyệt hoàn thành"]):::uc
        UC_Verify(["Xác nhận bản cứng & Điểm DN"]):::uc
        UC_Calc(["Tự động tính điểm trung bình"]):::uc
        UC_Reject(["Treo điểm / Từ chối duyệt"]):::uc
    end

    SV --- UC_Submit
    GV --- UC_Grade
    Admin --- UC_Approve

    UC_Grade -. "<<include>>" .-> UC_Verify
    UC_Grade -. "<<include>>" .-> UC_Calc
    UC_Approve -. "<<extend>>" .-> UC_Grade
    UC_Reject -. "<<extend>>" .-> UC_Grade

    classDef actor fill:transparent,stroke:none,font-size:16px,font-weight:bold;
    classDef uc fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:20,ry:20;
    style System fill:#fafafa,stroke:#888,stroke-width:2px,stroke-dasharray: 5 5, rx:10;
```
