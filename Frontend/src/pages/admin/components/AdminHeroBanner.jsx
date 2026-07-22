import { Box, Typography, Paper, Avatar, Chip, Stack } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const AdminHeroBanner = ({ adminInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 3,
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box sx={{ p: 1, borderRadius: "50%", bgcolor: "action.hover" }}>
            <Avatar
              src={adminInfo?.data?.avatarUrl}
              sx={{ width: 64, height: 64, fontWeight: 800, bgcolor: "primary.main" }}
            >
              {!adminInfo?.data?.avatarUrl &&
                (adminInfo?.data?.username?.charAt(0).toUpperCase() || "A")}
            </Avatar>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Chào mừng trở lại, {adminInfo?.data?.fullName || adminInfo?.data?.username}!
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
              <Chip
                size="small"
                label="Status"
                color="success"
                sx={{ fontWeight: 800, height: 20 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Trạng thái: <span style={{ color: "#10b981" }}>Trực tuyến</span>
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "action.hover",
            borderRadius: 4,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              Live System Status
            </Typography>
            <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 600 }}>
              ● Hệ thống ổn định
            </Typography>
          </Box>
          <CheckCircleIcon sx={{ color: "#10b981", fontSize: 32 }} />
        </Box>
      </Paper>
    </motion.div>
  );
};
