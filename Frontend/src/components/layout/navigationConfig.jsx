import {
  People as PeopleIcon,
  School as SchoolIcon,
  RateReview as RateReviewIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  UploadFile as UploadFileIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
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
    ],
  },
  {
    label: "My Mentor",
    icon: <PersonIcon />,
    path: "/my-mentor",
    roles: ["STUDENT", "ROLE_STUDENT"],
  },
  {
    label: "My Students",
    icon: <GroupIcon />,
    path: "/my-students",
    roles: ["MENTOR", "ROLE_MENTOR"],
  },
  {
    label: "Nộp Báo cáo",
    icon: <UploadFileIcon />,
    path: "/submit-report",
    roles: ["STUDENT", "ROLE_STUDENT"],
  },
  {
    label: "Quản lý người dùng",
    icon: <PeopleIcon />,
    roles: ["ADMIN", "ROLE_ADMIN"],
    children: [
      { label: "Danh sách người dùng", path: "/management/users" },
      { label: "Danh sách sinh viên", path: "/management/students" },
      { label: "Danh sách giảng viên", path: "/management/mentors" },
    ],
  },
  {
    label: "Quản lý thực tập",
    icon: <SchoolIcon />,
    roles: [
      "ADMIN",
      "ROLE_ADMIN",
      "MENTOR",
      "ROLE_MENTOR",
      "STUDENT",
      "ROLE_STUDENT",
    ],
    children: [
      { label: "Kỳ thực tập", path: "/management/phases" },
      { label: "Nhiệm vụ thực tập", path: "/management/assignments" },
    ],
  },
  {
    label: "Quản lý Báo cáo",
    icon: <AssignmentTurnedInIcon />,
    path: "/management/reports",
    roles: ["ADMIN", "ROLE_ADMIN", "MENTOR", "ROLE_MENTOR"],
  },
  {
    label: "Đánh giá thực tập",
    icon: <RateReviewIcon />,
    roles: [
      "ADMIN",
      "ROLE_ADMIN",
      "MENTOR",
      "ROLE_MENTOR",
      "STUDENT",
      "ROLE_STUDENT",
    ],
    children: [
      { label: "Tiêu chí đánh giá", path: "/management/evaluation-criteria" },
      { label: "Vòng đánh giá", path: "/management/assessment-rounds" },
      { label: "Kết quả đánh giá", path: "/management/assessment-results" },
    ],
  },
];
