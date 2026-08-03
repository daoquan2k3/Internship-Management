import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { dashboardApi, mentorApi } from "../../api/resourceApi";
import { MentorHeroBanner } from "./components/MentorHeroBanner";
import { MentorStats } from "./components/MentorStats";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [mentorInfo, setMentorInfo] = useState(null);

  // Khởi tạo state chứa dữ liệu thống kê thật
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalStudents: 0,
    pendingReports: 0,
    completionRate: 0,
    totalTeachers: 0,
    totalUniReps: 0,
    totalUniversities: 0,
    totalClasses: 0,
    totalCompanyReps: 0,
    totalCompanyMentors: 0,
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

  return (
    // Sử dụng thuần Box và maxWidth 100% để tràn lề mượt mà
    <Box sx={{ maxWidth: "100%", px: { xs: 2, md: 4 }, margin: "0 auto", pb: 5 }}>

      <MentorHeroBanner mentorInfo={mentorInfo} />

      <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 3, pl: 1 }}>
        Chỉ số hệ thống
      </Typography>

      <MentorStats stats={stats} />

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 3, pl: 1 }}>
          Điều hướng quản lý nhanh
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
          <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Paper
              onClick={() => navigate("/management/users")}
              sx={{
                p: 3, borderRadius: 4, cursor: "pointer", height: "100%",
                background: "linear-gradient(135deg, rgba(0, 137, 123, 0.08) 0%, rgba(0, 137, 123, 0.02) 100%)",
                border: "1px solid rgba(0, 137, 123, 0.2)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                "&:hover": { borderColor: "#00897b", boxShadow: "0 12px 28px rgba(0, 137, 123, 0.15)" }
              }}
            >
              <Box>
                <Box sx={{ width: 50, height: 50, borderRadius: 3, bgcolor: "#00897b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <PeopleAltIcon fontSize="medium" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Giảng viên & Đại diện
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Quản lý danh sách, thêm mới hoặc phân công nhiệm vụ cho Giảng viên phụ trách và Đại diện trường.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 3, color: "#00897b", fontWeight: 700, fontSize: "0.9rem" }}>
                Truy cập ngay <ArrowForwardIcon sx={{ ml: 1, fontSize: "1rem" }} />
              </Box>
            </Paper>
          </motion.div>

          <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Paper
              onClick={() => navigate("/management/users")}
              sx={{
                p: 3, borderRadius: 4, cursor: "pointer", height: "100%",
                background: "linear-gradient(135deg, rgba(2, 136, 209, 0.08) 0%, rgba(2, 136, 209, 0.02) 100%)",
                border: "1px solid rgba(2, 136, 209, 0.2)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                "&:hover": { borderColor: "#0288d1", boxShadow: "0 12px 28px rgba(2, 136, 209, 0.15)" }
              }}
            >
              <Box>
                <Box sx={{ width: 50, height: 50, borderRadius: 3, bgcolor: "#0288d1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <ManageAccountsIcon fontSize="medium" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Tài khoản hệ thống
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Kiểm tra trạng thái hoạt động, khóa/mở khóa hoặc tạo tài khoản mới cho các thành viên trong hệ thống.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 3, color: "#0288d1", fontWeight: 700, fontSize: "0.9rem" }}>
                Truy cập ngay <ArrowForwardIcon sx={{ ml: 1, fontSize: "1rem" }} />
              </Box>
            </Paper>
          </motion.div>

          <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Paper
              onClick={() => navigate("/management/users")}
              sx={{
                p: 3, borderRadius: 4, cursor: "pointer", height: "100%",
                background: "linear-gradient(135deg, rgba(123, 31, 162, 0.08) 0%, rgba(123, 31, 162, 0.02) 100%)",
                border: "1px solid rgba(123, 31, 162, 0.2)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                "&:hover": { borderColor: "#7b1fa2", boxShadow: "0 12px 28px rgba(123, 31, 162, 0.15)" }
              }}
            >
              <Box>
                <Box sx={{ width: 50, height: 50, borderRadius: 3, bgcolor: "#7b1fa2", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <BusinessCenterIcon fontSize="medium" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Đại diện & Cố vấn DN
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Quản lý danh sách, theo dõi hoạt động và kết nối với các Đại diện và Cố vấn từ các Doanh nghiệp đối tác.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 3, color: "#7b1fa2", fontWeight: 700, fontSize: "0.9rem" }}>
                Truy cập ngay <ArrowForwardIcon sx={{ ml: 1, fontSize: "1rem" }} />
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Box>

    </Box>
  );
};

export default MentorDashboard;
