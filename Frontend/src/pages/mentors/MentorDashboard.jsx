import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import { dashboardApi, mentorApi } from "../../api/resourceApi"; // Đã thêm dashboardApi
import { motion } from "framer-motion";

// Các Icon dành cho Thống Kê Mentor
import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AssessmentIcon from "@mui/icons-material/Assessment";

const MentorDashboard = () => {
  const [mentorInfo, setMentorInfo] = useState(null);

  // Khởi tạo state chứa dữ liệu thống kê thật
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalStudents: 0,
    pendingReports: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Gọi song song 2 API để lấy thông tin Mentor và Thống kê
        const [infoRes, statsRes] = await Promise.all([
          mentorApi.getMentorInfo().catch(() => null),
          dashboardApi.getMentorStats().catch(() => null),
        ]);

        if (infoRes) setMentorInfo(infoRes);
        if (statsRes?.data) setStats(statsRes.data);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Mentor Dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );

  // Thẻ Thống Kê (Stat Card)
  const StatCard = ({ icon, title, value, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ flex: "1 1 240px", minWidth: "240px" }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: `0 12px 28px ${color}20`,
          },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            color: color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b", mt: 0.5 }}>
            {value}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );

  return (
    // Sử dụng thuần Box và maxWidth 100% để tràn lề mượt mà
    <Box sx={{ maxWidth: "100%", px: { xs: 2, md: 4 }, margin: "0 auto", pb: 5 }}>

      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            mb: 5,
            borderRadius: 5,
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)",
            color: "white",
            boxShadow: "0 16px 40px rgba(0, 77, 64, 0.3)",
          }}
        >
          <Box
            sx={{
              position: "absolute", top: -50, right: -20, width: 250, height: 250, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={4} sx={{ position: "relative", zIndex: 1 }}>
            <motion.div initial={{ rotate: -10, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <Avatar
                src={mentorInfo?.data?.avatarUrl || ""}
                sx={{
                  width: 100, height: 100, fontSize: "3rem", fontWeight: 800,
                  background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)",
                  border: "3px solid rgba(255, 255, 255, 0.5)", color: "#fff",
                }}
              >
                {!mentorInfo?.data?.avatarUrl && (mentorInfo?.data?.fullName?.charAt(0).toUpperCase() || "M")}
              </Avatar>
            </motion.div>

            <Box textAlign={{ xs: "center", sm: "left" }}>
              <Chip
                icon={<LightbulbCircleIcon sx={{ color: "#fff !important" }} />}
                label="Mentor Space"
                sx={{ background: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600, mb: 2, backdropFilter: "blur(5px)" }}
              />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-1px" }}>
                Chào, {mentorInfo?.data?.fullName || mentorInfo?.data?.username || "Thầy/Cô"}! 🎓
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8 }}>
                Tổng quan tiến độ thực tập của các nhóm sinh viên phụ trách.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      <Typography variant="h5" sx={{ fontWeight: 800, color: "#004d40", mb: 3, pl: 1 }}>
        Chỉ số đánh giá
      </Typography>

      {/* Khu vực thống kê Mentor - SỬ DỤNG DỮ LIỆU THẬT & FLEXBOX */}
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

    </Box>
  );
};

export default MentorDashboard;