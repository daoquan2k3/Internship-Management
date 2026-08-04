import {
  People as PeopleIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

export const allMenuItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: [
      "ADMIN",
      "ROLE_ADMIN",
      "MENTOR",
      "ROLE_MENTOR",
      "STUDENT",
      "ROLE_STUDENT",
      "TEACHER",
      "ROLE_TEACHER",
      "UNIVERSITY_REP",
      "ROLE_UNIVERSITY_REP",
      "COMPANY_MENTOR",
      "ROLE_COMPANY_MENTOR",
      "COMPANY_REP",
      "ROLE_COMPANY_REP",
    ],
  },
  {
    label: "Quy trình Thực tập",
    icon: <SchoolIcon />,
    path: "/my-internship",
    roles: ["STUDENT", "ROLE_STUDENT"],
  },
  {
    label: "Người hướng dẫn của tôi",
    icon: <PersonIcon />,
    path: "/my-mentor",
    roles: ["STUDENT", "ROLE_STUDENT"],
  },
  {
    label: "Sinh viên hướng dẫn",
    icon: <GroupIcon />,
    path: "/my-students",
    roles: ["TEACHER", "ROLE_TEACHER", "COMPANY_MENTOR", "ROLE_COMPANY_MENTOR"],
  },
  {
    label: "Quản lý người dùng",
    icon: <PeopleIcon />,
    roles: ["ADMIN", "ROLE_ADMIN", "MENTOR", "ROLE_MENTOR"],
    children: [
      { label: "Danh sách người dùng", path: "/management/users" },
      { label: "Danh sách sinh viên", path: "/management/students", roles: ["ADMIN", "ROLE_ADMIN"] },
      { label: "Danh sách đại diện/giảng viên", path: "/management/mentors", roles: ["ADMIN", "ROLE_ADMIN"] },
    ],
  },
  {
    label: "Quản lý Trường học",
    icon: <SchoolIcon />,
    path: "/admin/universities",
    roles: ["ADMIN", "ROLE_ADMIN"],
  },
  {
    label: "Quản lý Công ty",
    icon: <BusinessIcon />,
    path: "/admin/companies",
    roles: ["ADMIN", "ROLE_ADMIN"],
  },
  {
    label: "Quản lý Sinh viên (Trường)",
    icon: <GroupIcon />,
    roles: ["UNIVERSITY_REP", "ROLE_UNIVERSITY_REP", "ADMIN", "ROLE_ADMIN"],
    children: [
      { label: "Yêu cầu gia nhập trường", path: "/rep/join-requests" },
      { label: "Quản lý lớp thực tập", path: "/rep/classes" },
      { label: "Duyệt đánh giá cuối kỳ", path: "/rep/final-evaluations" },
    ],
  },
  {
    label: "Giáo viên phụ trách",
    icon: <GroupIcon />,
    roles: ["TEACHER", "ROLE_TEACHER"],
    children: [
      { label: "Đơn xin vào lớp", path: "/teacher/applications" },
      { label: "Vòng đánh giá giữa kỳ", path: "/management/assessment-rounds" },
      { label: "Quản lý Báo cáo & Đánh giá", path: "/management/reports" },
    ],
  },
  {
    label: "Đại diện doanh nghiệp",
    icon: <PeopleIcon />,
    roles: ["COMPANY_REP", "ROLE_COMPANY_REP"],
    children: [
      { label: "Sinh viên & Đơn vào", path: "/company-rep/applications" },
      { label: "Người hướng dẫn nội bộ", path: "/management/users" },
      { label: "Nhóm Phân công", path: "/management/assignments" },
    ],
  },

  {
    label: "Quản lý Báo cáo & Đánh giá",
    icon: <AssignmentTurnedInIcon />,
    path: "/management/reports",
    roles: ["ADMIN", "ROLE_ADMIN"],
  },
];
