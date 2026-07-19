import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
  Grid,
} from "@mui/material";
import { authApi } from "../../api/authApi";
import { dashboardApi } from "../../api/resourceApi";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PublicIcon from "@mui/icons-material/Public";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const COLORS = ["#10b981", "#cbd5e1", "#8b5cf6", "#3b82f6"];

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

  // --- STYLE 3D NEUMORPHISM GIỮ NGUYÊN ---
  const box3DStyle = {
    background: "linear-gradient(145deg, #ffffff, #f0f2f5)",
    boxShadow: "10px 10px 20px #d1d5df, -10px -10px 20px #ffffff",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.8)",
  };

  const inner3DStyle = {
    background: "linear-gradient(145deg, #f0f2f5, #ffffff)",
    boxShadow: "inset 5px 5px 10px #d1d5df, inset -5px -5px 10px #ffffff",
    borderRadius: "16px",
  };

  const StatCard3D = ({ icon, title, value, color, delay, subText }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{ flex: "1 1 220px", minWidth: "220px" }}
    >
      <Paper sx={{ ...box3DStyle, p: 3, position: "relative", overflow: "hidden" }}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Box sx={{ ...inner3DStyle, width: 60, height: 60, display: "flex", justifyContent: "center", alignItems: "center", color: color }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b", mt: 0.5 }}>{value}</Typography>
            <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 700 }}>{subText}</Typography>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 2, md: 4 }, margin: "0 auto", pb: 5, overflowX: "hidden" }}>
      {/* HEADER BANNER 3D */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Paper
          sx={{
            ...box3DStyle, p: { xs: 3, md: 4 }, mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={3}>
            <Box sx={{ ...inner3DStyle, p: 1, borderRadius: "50%" }}>
              <Avatar src={adminInfo?.data?.avatarUrl} sx={{ width: 64, height: 64, fontWeight: 800, bgcolor: "#3b82f6" }}>
                {!adminInfo?.data?.avatarUrl && (adminInfo?.data?.username?.charAt(0).toUpperCase() || "A")}
              </Avatar>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                Chào mừng trở lại, {adminInfo?.data?.fullName || adminInfo?.data?.username}!
              </Typography>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                <Chip size="small" label="Status" sx={{ bgcolor: "#10b981", color: "white", fontWeight: 800, height: 20 }} />
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                  Trạng thái: <span style={{ color: "#10b981" }}>Trực tuyến</span>
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ ...inner3DStyle, p: 2, px: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>Live System Status</Typography>
              <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 600 }}>● Hệ thống ổn định</Typography>
            </Box>
            <CheckCircleIcon sx={{ color: "#10b981", fontSize: 32 }} />
          </Box>
        </Paper>
      </motion.div>

      {/* 4 THẺ THỐNG KÊ */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <StatCard3D delay={0.1} color="#f59e0b" icon={<GroupIcon fontSize="large" />} title="Tổng Người Dùng" value={stats.totalUsers.toLocaleString()} subText="+12% so với tháng trước" />
        <StatCard3D delay={0.2} color="#3b82f6" icon={<BusinessCenterIcon fontSize="large" />} title="Giai Đoạn Thực Tập" value={stats.activePhases.toLocaleString()} subText="Hoạt động ổn định" />
        <StatCard3D delay={0.3} color="#10b981" icon={<PublicIcon fontSize="large" />} title="Tổng Lượt Truy Cập" value={stats.websiteVisits.toLocaleString()} subText="Dữ liệu tổng quan" />
        <StatCard3D delay={0.4} color="#8b5cf6" icon={<AssignmentIcon fontSize="large" />} title="Nhóm Thực Tập" value={stats.totalAssignments.toLocaleString()} subText="+5 nhóm mới" />
      </Box>


      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" }, 
          gap: 4,
          alignItems: "stretch", 
        }}
      >
        {/* Biểu đồ Đường - Chiếm 2 phần */}
        <Box sx={{ flex: { xs: "1 1 100%", lg: 2 } }}>
          <Paper sx={{ ...box3DStyle, p: 3, height: "100%", minHeight: 420, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
              Xu hướng truy cập website (7 ngày gần nhất)
            </Typography>
            <Box sx={{ flexGrow: 1, width: "100%", minHeight: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.visitorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontWeight: 600 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Line type="monotone" dataKey="value" name="Lượt truy cập" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Biểu đồ Tròn - Chiếm 1 phần */}
        <Box sx={{ flex: { xs: "1 1 100%", lg: 1 } }}>
          <Paper sx={{ ...box3DStyle, p: 3, height: "100%", minHeight: 420, display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b", mb: 1, textAlign: "center" }}>
              Tỷ lệ hoàn thành báo cáo
            </Typography>
            <Box sx={{ flexGrow: 1, width: "100%", minHeight: 250, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {stats.pieData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Chú thích (Legend) cho biểu đồ tròn */}
            <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLORS[0] }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b" }}>Đã nộp</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLORS[1] }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b" }}>Chưa nộp</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

      </Box>
    </Box>
  );
};

export default AdminDashboard;