import { Typography, Paper, Stack, Box, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FlagIcon from "@mui/icons-material/Flag";
import AlarmIcon from "@mui/icons-material/Alarm";

const AssignmentInfoCard = ({ detail }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid rgba(255, 255, 255, 0.1)", mb: 4 }}>
        <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
          {detail.phaseName}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary", mt: 1, mb: 3 }}>
          {detail.assignmentTitle}
        </Typography>

        <Stack direction="row" spacing={4} sx={{ mb: 4, flexWrap: "wrap", rowGap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar src={detail.mentorAvatarUrl} sx={{ bgcolor: "primary.main", color: "#fff" }}>
              {!detail.mentorAvatarUrl && <SupervisorAccountIcon />}
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Mentor Hướng dẫn</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{detail.mentorName}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "error.main", color: "#fff" }}>
              <FlagIcon />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Ngày giao đề tài</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{detail.assignedDate}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "warning.main", color: "#fff" }}>
              <AlarmIcon />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Hạn chót (Deadline)</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: detail.dueDate ? "#b45309" : "#94a3b8" }}>
                {detail.dueDate ? detail.dueDate : "Chưa thiết lập"}
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <AssignmentIcon color="primary" /> Mô tả nhiệm vụ
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, p: 3, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 4, borderLeft: "5px solid #3b82f6" }}>
          {detail.assignmentDescription || "Không có mô tả chi tiết cho đề tài này."}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default AssignmentInfoCard;
