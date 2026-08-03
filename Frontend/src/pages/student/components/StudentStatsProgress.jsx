import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import StatCard from "../../../components/StatCard";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import GradeIcon from "@mui/icons-material/Grade";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

export const StudentStatsProgress = ({ stats }) => {
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        Tổng quan học tập
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <StatCard
            delay={0.1}
            color="#8b5cf6"
            icon={<TrendingUpIcon fontSize="large" />}
            title="Tiến Độ Thực Tập"
            value={`${stats.progress}%`}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            delay={0.2}
            color="#10b981"
            icon={<TaskAltIcon fontSize="large" />}
            title="Báo Cáo Đã Nộp"
            value={
              stats.submittedReports < 10
                ? `0${stats.submittedReports}`
                : stats.submittedReports
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            delay={0.3}
            color="#f59e0b"
            icon={<GradeIcon fontSize="large" />}
            title="Điểm Tạm Tính"
            value={stats.averageScore > 0 ? stats.averageScore : "--"}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            delay={0.4}
            color="#ef4444"
            icon={<PendingActionsIcon fontSize="large" />}
            title="Nhiệm Vụ Tới Hạn"
            value={
              stats.upcomingDeadlines < 10
                ? `0${stats.upcomingDeadlines}`
                : stats.upcomingDeadlines
            }
          />
        </Grid>
      </Grid>

      {/* Circular Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card
          sx={{
            p: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={stats.progress}
              size={160}
              thickness={4}
              color="primary"
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h3"
                component="div"
                color="text.primary"
                sx={{ fontWeight: 800 }}
              >
                {Math.round(stats.progress)}%
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Tiến độ chung
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bạn đã hoàn thành {stats.progress}% chặng đường thực tập. Hãy tiếp
              tục duy trì tiến độ báo cáo và hoàn thành các nhiệm vụ được giao
              nhé!
            </Typography>
          </Box>
        </Card>
      </motion.div>
    </>
  );
};
