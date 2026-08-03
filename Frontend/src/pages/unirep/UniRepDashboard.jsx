import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Paper, Avatar, Chip, Stack, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { dashboardApi, mentorApi } from "../../api/resourceApi";
import StatCard from "../../components/StatCard";

// Icons
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const RepDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingJoinRequests: 0,
    totalEvaluations: 0,
    pendingEvaluations: 0,
    approvedEvaluations: 0,
    completionRate: 0,
    universityName: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [infoRes, statsRes] = await Promise.all([
          mentorApi.getMentorInfo().catch(() => null),
          dashboardApi.getRepStats().catch(() => null),
        ]);

        if (infoRes) setUserInfo(infoRes);
        if (statsRes?.data) setStats(statsRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Rep Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  const formatVal = (val) => (val !== undefined && val < 10 ? `0${val}` : val || "0");

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 2, md: 4 }, margin: "0 auto", pb: 5 }}>
      {/* HERO BANNER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: { xs: 4, md: 5 },
            mb: 5,
            borderRadius: 5,
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
            color: "white",
            boxShadow: "0 12px 32px -8px rgba(26, 35, 126, 0.35)",
          }}
        >
          {/* Decorative shapes */}
          <Box
            sx={{
              position: "absolute",
              top: -60,
              right: -30,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -40,
              right: 150,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={4}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3.5}>
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Avatar
                  src={userInfo?.data?.avatarUrl || ""}
                  sx={{
                    width: 96,
                    height: 96,
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "3px solid rgba(255, 255, 255, 0.5)",
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
                  }}
                >
                  {!userInfo?.data?.avatarUrl &&
                    (userInfo?.data?.fullName?.charAt(0).toUpperCase() || "R")}
                </Avatar>
              </motion.div>

              <Box textAlign={{ xs: "center", sm: "left" }}>
                <Chip
                  icon={<AccountBalanceIcon sx={{ color: "#fff !important", fontSize: 18 }} />}
                  label={stats.universityName || "Cơ sở Đào tạo"}
                  sx={{
                    background: "rgba(255,255,255,0.18)",
                    color: "white",
                    fontWeight: 700,
                    mb: 1.5,
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    px: 0.5
                  }}
                />
                <Typography variant="h3" sx={{ fontWeight: 850, mb: 1, letterSpacing: "-0.5px" }}>
                  Chào, {userInfo?.data?.fullName || userInfo?.data?.username || "Đại diện trường"}! 🏫
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 400, opacity: 0.85, maxWidth: 600 }}>
                  Quản lý lớp thực tập, phê duyệt yêu cầu gia nhập và xét duyệt phiếu đánh giá cuối kỳ cho sinh viên.
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </motion.div>

      {/* STATS SECTION */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, px: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
            Chỉ số hoạt động trường
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cập nhật thời gian thực
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              delay={0.1}
              color="#1a237e"
              icon={<ClassIcon fontSize="large" />}
              title="Lớp Thực Tập"
              value={formatVal(stats.totalClasses)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              delay={0.2}
              color="#0288d1"
              icon={<GroupsIcon fontSize="large" />}
              title="Tổng Sinh Viên"
              value={formatVal(stats.totalStudents)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              delay={0.3}
              color="#ff9800"
              icon={<PersonAddIcon fontSize="large" />}
              title="Đơn Vào Trường Chờ Duyệt"
              value={formatVal(stats.pendingJoinRequests)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              delay={0.4}
              color="#00897b"
              icon={<AssessmentIcon fontSize="large" />}
              title="Tổng Phiếu Đánh Giá"
              value={formatVal(stats.totalEvaluations)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              delay={0.5}
              color="#e53935"
              icon={<AssignmentLateIcon fontSize="large" />}
              title="Phiếu Đánh Giá Chờ Duyệt"
              value={formatVal(stats.pendingEvaluations)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              delay={0.6}
              color="#4caf50"
              icon={<VerifiedIcon fontSize="large" />}
              title="Tỷ Lệ Duyệt Đánh Giá"
              value={`${stats.completionRate}%`}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RepDashboard;
