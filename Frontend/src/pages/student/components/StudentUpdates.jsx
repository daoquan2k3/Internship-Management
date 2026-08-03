import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EventIcon from "@mui/icons-material/Event";
import FeedbackIcon from "@mui/icons-material/Feedback";

export const StudentUpdates = ({ stats, recentReports }) => {
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        Cập nhật gần đây
      </Typography>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <EventIcon color="primary" /> Upcoming Deadlines
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.upcomingDeadlines > 0 ? (
              <Typography
                variant="body2"
                color="warning.main"
                sx={{ fontWeight: 600 }}
              >
                Bạn có {stats.upcomingDeadlines} nhiệm vụ sắp đến hạn trong tuần này! Hãy kiểm tra tab Báo cáo.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Không có deadline nào sắp tới. Bạn đang làm rất tốt! 🎉
              </Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <FeedbackIcon color="secondary" /> Lịch sử báo cáo
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <ListItem
                    key={report.reportId}
                    disableGutters
                    sx={{ alignItems: "flex-start" }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: report.score ? "success.main" : "warning.main",
                        }}
                      >
                        {report.score ? (
                          <TaskAltIcon fontSize="small" />
                        ) : (
                          <PendingActionsIcon fontSize="small" />
                        )}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={report.title}
                      primaryTypographyProps={{
                        variant: "subtitle2",
                        fontWeight: 600,
                      }}
                      secondary={
                        report.score ? `Điểm: ${report.score}` : "Đang chờ chấm"
                      }
                      secondaryTypographyProps={{
                        variant: "caption",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có báo cáo nào được nộp.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
