import { Box } from "@mui/material";
import StatCard from "../../../components/StatCard";

import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

export const MentorStats = ({ stats }) => {
  const teachersCount = stats.totalTeachers ?? stats.totalGroups ?? 0;
  const uniRepsCount = stats.totalUniReps ?? stats.totalStudents ?? 0;
  const companyRepsCount = stats.totalCompanyReps ?? stats.pendingReports ?? 0;
  const companyMentorsCount = stats.totalCompanyMentors ?? stats.completionRate ?? 0;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      <StatCard
        delay={0.1}
        color="#00897b"
        icon={<SchoolIcon fontSize="large" />}
        title="Giảng Viên Phụ Trách"
        value={teachersCount < 10 ? `0${teachersCount}` : teachersCount}
      />
      <StatCard
        delay={0.2}
        color="#0288d1"
        icon={<GroupsIcon fontSize="large" />}
        title="Đại Diện Trường"
        value={uniRepsCount < 10 ? `0${uniRepsCount}` : uniRepsCount}
      />
      <StatCard
        delay={0.3}
        color="#7b1fa2"
        icon={<BusinessCenterIcon fontSize="large" />}
        title="Đại Diện Doanh Nghiệp"
        value={companyRepsCount < 10 ? `0${companyRepsCount}` : companyRepsCount}
      />
      <StatCard
        delay={0.4}
        color="#fbc02d"
        icon={<SupervisorAccountIcon fontSize="large" />}
        title="Cố Vấn Doanh Nghiệp"
        value={companyMentorsCount < 10 ? `0${companyMentorsCount}` : companyMentorsCount}
      />
    </Box>
  );
};
