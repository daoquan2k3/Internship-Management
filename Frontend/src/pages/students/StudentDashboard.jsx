import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, CircularProgress, Grid } from "@mui/material";
import { dashboardApi, studentApi, reportApi } from "../../api/resourceApi";
import { StudentHeroBanner } from "./components/StudentHeroBanner";
import { StudentStatsProgress } from "./components/StudentStatsProgress";
import { StudentUpdates } from "./components/StudentUpdates";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [studentInfo, setStudentInfo] = useState(null);
  
  const [stats, setStats] = useState({
    progress: 0,
    submittedReports: 0,
    averageScore: 0,
    upcomingDeadlines: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [infoRes, statsRes, reportsRes] = await Promise.all([
          studentApi.getCurrentStudentInfo().catch(() => null),
          dashboardApi.getStudentStats().catch(() => null),
          reportApi.getMyReports().catch(() => null),
        ]);

        if (infoRes) setStudentInfo(infoRes);
        if (statsRes?.data) setStats(statsRes.data);
        if (reportsRes?.data?.content) {
            setRecentReports(reportsRes.data.content.slice(0, 3));
        }

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

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 2, md: 4 }, margin: "0 auto", pb: 5 }}>
      
      <StudentHeroBanner studentInfo={studentInfo} user={user} />

      <Grid container spacing={4}>
        {/* Left Column: Stats & Progress */}
        <Grid item xs={12} md={8}>
          <StudentStatsProgress stats={stats} />
        </Grid>

        {/* Right Column: Deadlines & Feedback */}
        <Grid item xs={12} md={4}>
          <StudentUpdates stats={stats} recentReports={recentReports} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;