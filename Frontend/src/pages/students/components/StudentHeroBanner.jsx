import { Box, Typography, Paper, Avatar, Chip, Stack } from "@mui/material";
import { motion } from "framer-motion";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

export const StudentHeroBanner = ({ studentInfo, user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          mb: 4,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          spacing={4}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Avatar
              src={studentInfo?.data?.avatarUrl}
              sx={{
                width: 100,
                height: 100,
                fontSize: "3rem",
                fontWeight: 800,
                border: "3px solid rgba(255, 255, 255, 0.5)",
              }}
            >
              {!studentInfo?.data?.avatarUrl &&
                (studentInfo?.data?.fullName?.charAt(0).toUpperCase() ||
                  user?.username?.charAt(0).toUpperCase() ||
                  "S")}
            </Avatar>
          </motion.div>

          <Box textAlign={{ xs: "center", sm: "left" }}>
            <Chip
              icon={<RocketLaunchIcon />}
              label="Student Workspace"
              color="primary"
              variant="outlined"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mb: 1, letterSpacing: "-1px" }}
            >
              Chào, {studentInfo?.data?.fullName || user?.username}! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Cùng theo dõi tiến độ và hoàn thành các nhiệm vụ xuất sắc nhé.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};
