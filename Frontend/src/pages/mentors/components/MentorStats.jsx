import { Box } from "@mui/material";
import StatCard from "../../../components/StatCard";

import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AssessmentIcon from "@mui/icons-material/Assessment";

export const MentorStats = ({ stats }) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      <StatCard
        delay={0.1}
        color="#00897b"
        icon={<GroupsIcon fontSize="large" />}
        title="Nhóm Phụ Trách"
        value={stats.totalGroups < 10 ? `0${stats.totalGroups}` : stats.totalGroups}
      />
      <StatCard
        delay={0.2}
        color="#0288d1"
        icon={<SchoolIcon fontSize="large" />}
        title="Tổng Sinh Viên"
        value={stats.totalStudents < 10 ? `0${stats.totalStudents}` : stats.totalStudents}
      />
      <StatCard
        delay={0.3}
        color="#e53935"
        icon={<AssignmentLateIcon fontSize="large" />}
        title="Báo Cáo Chờ Chấm"
        value={stats.pendingReports < 10 ? `0${stats.pendingReports}` : stats.pendingReports}
      />
      <StatCard
        delay={0.4}
        color="#fbc02d"
        icon={<AssessmentIcon fontSize="large" />}
        title="Tỷ Lệ Hoàn Thành"
        value={`${stats.completionRate}%`}
      />
    </Box>
  );
};
