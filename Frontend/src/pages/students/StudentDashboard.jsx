import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import { dashboardApi, studentApi } from "../../api/resourceApi"; // Đảm bảo import dashboardApi
import { motion } from "framer-motion";

// Các Icon dành cho Thống Kê Sinh Viên
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import GradeIcon from "@mui/icons-material/Grade";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [studentInfo, setStudentInfo] = useState(null);
  
  // State lưu trữ dữ liệu thật từ Backend
  const [stats, setStats] = useState({
    progress: 0,
    submittedReports: 0,
    averageScore: 0,
    upcomingDeadlines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Gọi song song 2 API để tối ưu tốc độ tải trang
        const [infoRes, statsRes] = await Promise.all([
          studentApi.getCurrentStudentInfo().catch(() => null),
          dashboardApi.getStudentStats().catch(() => null),
        ]);

        if (infoRes) setStudentInfo(infoRes);
        if (statsRes?.data) setStats(statsRes.data);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Student Dashboard", err);
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

  // Thẻ Thống Kê (Stat Card) với Flexbox
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
    // FIX LỖI UI LỆCH: Sử dụng maxWidth 100% kèm padding 2 bên
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
            background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
            color: "white",
            boxShadow: "0 16px 40px rgba(13, 71, 161, 0.3)",
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
                src={studentInfo?.data?.avatarUrl}
                sx={{
                  width: 100, height: 100, fontSize: "3rem", fontWeight: 800,
                  background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)",
                  border: "3px solid rgba(255, 255, 255, 0.5)", color: "#fff",
                }}
              >
                {!studentInfo?.data?.avatarUrl && (studentInfo?.data?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "S")}
              </Avatar>
            </motion.div>

            <Box textAlign={{ xs: "center", sm: "left" }}>
              <Chip
                icon={<RocketLaunchIcon sx={{ color: "#fff !important" }} />}
                label="Internship Workspace"
                sx={{ background: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600, mb: 2, backdropFilter: "blur(5px)" }}
              />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-1px" }}>
                Chào, {studentInfo?.data?.fullName || user?.username}! 👋
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8 }}>
                Nắm bắt tiến độ và hoàn thành các nhiệm vụ trong kỳ thực tập của bạn.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      <Typography variant="h5" sx={{ fontWeight: 800, color: "#1565c0", mb: 3, pl: 1 }}>
        Tổng quan học tập
      </Typography>

      {/* Khu vực thống kê Sinh viên - Dữ liệu Động */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <StatCard
          delay={0.1}
          color="#3b82f6"
          icon={<TrendingUpIcon fontSize="large" />}
          title="Tiến Độ Thực Tập"
          value={`${stats.progress}%`}
        />
        <StatCard
          delay={0.2}
          color="#10b981"
          icon={<TaskAltIcon fontSize="large" />}
          title="Báo Cáo Đã Nộp"
          value={stats.submittedReports < 10 ? `0${stats.submittedReports}` : stats.submittedReports}
        />
        <StatCard
          delay={0.3}
          color="#f59e0b"
          icon={<GradeIcon fontSize="large" />}
          title="Điểm Tạm Tính"
          value={stats.averageScore > 0 ? stats.averageScore : "--"}
        />
        <StatCard
          delay={0.4}
          color="#f43f5e"
          icon={<PendingActionsIcon fontSize="large" />}
          title="Nhiệm Vụ Tới Hạn"
          value={stats.upcomingDeadlines < 10 ? `0${stats.upcomingDeadlines}` : stats.upcomingDeadlines}
        />
      </Box>
    </Box>
  );
};

export default StudentDashboard;