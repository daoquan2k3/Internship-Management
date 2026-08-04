import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { authApi } from "../../api/authApi";
import { dashboardApi } from "../../api/resourceApi";
import StatCard from "../../components/StatCard";
import { AdminHeroBanner } from "./components/AdminHeroBanner";
import { AdminCharts } from "./components/AdminCharts";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PublicIcon from "@mui/icons-material/Public";



const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePhases: 0,
    totalAssignments: 0,
    totalReports: 0,
    websiteVisits: 0,
    visitorData: [],
    sourceData: [],
    pieData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          authApi.getMe(),
          dashboardApi.getStats()
        ]);
        setAdminInfo(userRes);
        if (statsRes?.data) {
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 2, md: 4 }, margin: "0 auto", pb: 5, overflowX: "hidden" }}>
      {/* HEADER BANNER */}
      <AdminHeroBanner adminInfo={adminInfo} />

      {/* 4 THẺ THỐNG KÊ */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 3, mb: 4 }}>
        <StatCard delay={0.1} color="#f59e0b" icon={<GroupIcon fontSize="large" />} title="Tổng Người Dùng" value={stats.totalUsers.toLocaleString()} />

        <StatCard delay={0.3} color="#10b981" icon={<PublicIcon fontSize="large" />} title="Tổng Lượt Truy Cập" value={stats.websiteVisits.toLocaleString()} />
        <StatCard delay={0.4} color="#8b5cf6" icon={<AssignmentIcon fontSize="large" />} title="Nhóm Thực Tập" value={stats.totalAssignments.toLocaleString()} />
      </Box>

      {/* CHARTS */}
      <AdminCharts visitorData={stats.visitorData} pieData={stats.pieData} />
    </Box>
  );
};

export default AdminDashboard;