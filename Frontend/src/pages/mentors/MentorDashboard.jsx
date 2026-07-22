import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { dashboardApi, mentorApi } from "../../api/resourceApi";
import { MentorHeroBanner } from "./components/MentorHeroBanner";
import { MentorStats } from "./components/MentorStats";

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

  return (
    // Sử dụng thuần Box và maxWidth 100% để tràn lề mượt mà
    <Box sx={{ maxWidth: "100%", px: { xs: 2, md: 4 }, margin: "0 auto", pb: 5 }}>

      <MentorHeroBanner mentorInfo={mentorInfo} />

      <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 3, pl: 1 }}>
        Chỉ số đánh giá
      </Typography>

      <MentorStats stats={stats} />

    </Box>
  );
};

export default MentorDashboard;