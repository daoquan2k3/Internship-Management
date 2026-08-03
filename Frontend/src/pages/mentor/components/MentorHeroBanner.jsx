import { Box, Typography, Paper, Avatar, Chip, Stack } from "@mui/material";
import { motion } from "framer-motion";
import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";

export const MentorHeroBanner = ({ mentorInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          mb: 5,
          borderRadius: 5,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)",
          color: "white",
          boxShadow: "0 12px 32px -8px rgba(0, 77, 64, 0.2)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -20,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
          }}
        />

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
              src={mentorInfo?.data?.avatarUrl || ""}
              sx={{
                width: 100,
                height: 100,
                fontSize: "3rem",
                fontWeight: 800,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "3px solid rgba(255, 255, 255, 0.5)",
                color: "#fff",
              }}
            >
              {!mentorInfo?.data?.avatarUrl &&
                (mentorInfo?.data?.fullName?.charAt(0).toUpperCase() || "M")}
            </Avatar>
          </motion.div>

          <Box textAlign={{ xs: "center", sm: "left" }}>
            <Chip
              icon={<LightbulbCircleIcon sx={{ color: "#fff !important" }} />}
              label="Quản lý Trường học & Doanh nghiệp"
              sx={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontWeight: 600,
                mb: 2,
                backdropFilter: "blur(5px)",
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-1px" }}>
              Chào, {mentorInfo?.data?.fullName || mentorInfo?.data?.username || "Thầy/Cô"}! 🎓
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8 }}>
              Hệ thống điều phối, giám sát hoạt động của các Đại diện và Giảng viên/Cố vấn từ Trường Đại học và Doanh nghiệp.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};
