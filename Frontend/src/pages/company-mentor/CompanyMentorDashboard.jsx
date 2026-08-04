import { useState,  useContext } from "react";
import { Box, Typography, CircularProgress, Paper,  Stack, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GroupWorkIcon from "@mui/icons-material/GroupWork";

import RateReviewIcon from "@mui/icons-material/RateReview";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AuthContext } from "../../context/AuthContext";

const CompanyMentorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, ] = useState(false);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "100%", px: { xs: 2, md: 4 }, margin: "0 auto", pb: 5 }}>
      {/* HERO BANNER */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Paper
          sx={{
            p: { xs: 4, md: 5 },
            mb: 5,
            borderRadius: 5,
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #43a047 100%)",
            color: "white",
            boxShadow: "0 12px 32px -8px rgba(46, 125, 50, 0.35)",
          }}
        >
          <Box
            sx={{
              position: "absolute", top: -60, right: -30, width: 300, height: 300, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3.5} sx={{ position: "relative", zIndex: 1 }}>
            <Avatar
              src={user?.avatarUrl || ""}
              sx={{ width: 84, height: 84, bgcolor: "rgba(255,255,255,0.2)", fontSize: 36, fontWeight: 800, border: "3px solid white" }}
            >
              <GroupWorkIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 850, mb: 1, letterSpacing: "-0.5px" }}>
                Chào Cố vấn Doanh nghiệp, {user?.fullName || user?.username || "Company Mentor"}! 🤝
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 650 }}>
                Trực tiếp hướng dẫn sinh viên thực tập tại doanh nghiệp, phản hồi định kỳ, tạo phiếu đánh giá vòng và thẩm định báo cáo giai đoạn.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      {/* QUICK NAVIGATION */}
      <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 3, pl: 1 }}>
        Khu vực Cố vấn & Hướng dẫn
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
        {/* Card 1: Assigned Students */}
        <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }} style={{ height: "100%" }}>
          <Paper
            onClick={() => navigate("/my-students")}
            sx={{
              p: 2.5, borderRadius: 4, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
              background: "linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, rgba(46, 125, 50, 0.02) 100%)",
              border: "1px solid rgba(46, 125, 50, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              "&:hover": { borderColor: "#2e7d32", boxShadow: "0 12px 28px rgba(46, 125, 50, 0.15)" }
            }}
          >
            <Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "#2e7d32", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <GroupWorkIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1 }}>Sinh viên phụ trách</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
                Xem danh sách sinh viên thực tập được giao phụ trách bởi doanh nghiệp, theo dõi quá trình làm việc.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2.5, color: "#2e7d32", fontWeight: 700, fontSize: "0.85rem" }}>
              Truy cập ngay <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Box>
          </Paper>
        </motion.div>

        {/* Card 2: Periodic Feedback & Mid-term */}
        <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }} style={{ height: "100%" }}>
          <Paper
            onClick={() => navigate("/management/assessment-rounds")}
            sx={{
              p: 2.5, borderRadius: 4, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
              background: "linear-gradient(135deg, rgba(239, 108, 0, 0.08) 0%, rgba(239, 108, 0, 0.02) 100%)",
              border: "1px solid rgba(239, 108, 0, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              "&:hover": { borderColor: "#ef6c00", boxShadow: "0 12px 28px rgba(239, 108, 0, 0.15)" }
            }}
          >
            <Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "#ef6c00", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <RateReviewIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1 }}>Báo cáo định kỳ & Đánh giá giữa kỳ</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
                Nhận và xem phản hồi định kỳ, tạo phiếu đánh giá vòng và gửi đánh giá giữa kỳ cho sinh viên.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2.5, color: "#ef6c00", fontWeight: 700, fontSize: "0.85rem" }}>
              Truy cập ngay <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Box>
          </Paper>
        </motion.div>

        {/* Card 3: Final Report Review */}
        <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }} style={{ height: "100%" }}>
          <Paper
            onClick={() => navigate("/management/reports")}
            sx={{
              p: 2.5, borderRadius: 4, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
              background: "linear-gradient(135deg, rgba(0, 137, 123, 0.08) 0%, rgba(0, 137, 123, 0.02) 100%)",
              border: "1px solid rgba(0, 137, 123, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              "&:hover": { borderColor: "#00897b", boxShadow: "0 12px 28px rgba(0, 137, 123, 0.15)" }
            }}
          >
            <Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "#00897b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <EmojiEventsIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1 }}>Báo cáo cuối kỳ</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
                Nhận và lưu báo cáo cuối kỳ, gửi đánh giá cuối kỳ và phê duyệt báo cáo cho sinh viên.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2.5, color: "#00897b", fontWeight: 700, fontSize: "0.85rem" }}>
              Truy cập ngay <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default CompanyMentorDashboard;
