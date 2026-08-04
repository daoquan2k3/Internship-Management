import { useState, useContext } from "react";
import { Box, Typography, CircularProgress, Paper, Stack, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AuthContext } from "../../context/AuthContext";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading] = useState(false);

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
            background: "linear-gradient(135deg, #006064 0%, #00838f 50%, #0097a7 100%)",
            color: "white",
            boxShadow: "0 12px 32px -8px rgba(0, 96, 100, 0.35)",
          }}
        >
          <Box
            sx={{
              position: "absolute", top: -60, right: -30, width: 300, height: 300, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3.5} sx={{ position: "relative", zIndex: 1 }}>
            <Avatar
              src={user?.avatarUrl || ""}
              sx={{ width: 84, height: 84, bgcolor: "rgba(255,255,255,0.2)", fontSize: 36, fontWeight: 800, border: "3px solid white" }}
            >
              {user?.fullName?.charAt(0)?.toUpperCase() || "T"}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 850, mb: 1, letterSpacing: "-0.5px" }}>
                Chào Giảng viên, {user?.fullName || user?.username || "Giáo viên phụ trách"}! 👨‍🏫
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 650 }}>
                Quản lý sinh viên hướng dẫn, phê duyệt đơn xin vào lớp, thiết lập vòng đánh giá giữa kỳ và chấm điểm báo cáo thực tập.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      {/* QUICK NAVIGATION */}
      <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 3, pl: 1 }}>
        Khu vực quản lý giảng dạy
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5 }}>
        {/* Card 1: My Students */}
        <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }} style={{ height: "100%" }}>
          <Paper
            onClick={() => navigate("/my-students")}
            sx={{
              p: 2.5, borderRadius: 4, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
              background: "linear-gradient(135deg, rgba(0, 151, 167, 0.08) 0%, rgba(0, 151, 167, 0.02) 100%)",
              border: "1px solid rgba(0, 151, 167, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              "&:hover": { borderColor: "#0097a7", boxShadow: "0 12px 28px rgba(0, 151, 167, 0.15)" }
            }}
          >
            <Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "#0097a7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <GroupIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1 }}>Sinh viên hướng dẫn</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
                Xem danh sách sinh viên được phân công, theo dõi tiến độ thực tập và thông tin liên hệ.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2.5, color: "#0097a7", fontWeight: 700, fontSize: "0.85rem" }}>
              Truy cập ngay <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Box>
          </Paper>
        </motion.div>

        {/* Card 2: Applications */}
        <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }} style={{ height: "100%" }}>
          <Paper
            onClick={() => navigate("/teacher/applications")}
            sx={{
              p: 2.5, borderRadius: 4, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
              background: "linear-gradient(135deg, rgba(2, 136, 209, 0.08) 0%, rgba(2, 136, 209, 0.02) 100%)",
              border: "1px solid rgba(2, 136, 209, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              "&:hover": { borderColor: "#0288d1", boxShadow: "0 12px 28px rgba(2, 136, 209, 0.15)" }
            }}
          >
            <Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "#0288d1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <AssignmentIndIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1 }}>Đơn xin vào lớp</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
                Kiểm tra điều kiện thực tập (bản cứng, tín chỉ) và phê duyệt đơn xin gia nhập lớp.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2.5, color: "#0288d1", fontWeight: 700, fontSize: "0.85rem" }}>
              Truy cập ngay <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Box>
          </Paper>
        </motion.div>

        {/* Card 3: Assessment Rounds */}
        <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }} style={{ height: "100%" }}>
          <Paper
            onClick={() => navigate("/management/assessment-rounds")}
            sx={{
              p: 2.5, borderRadius: 4, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
              background: "linear-gradient(135deg, rgba(255, 152, 0, 0.08) 0%, rgba(255, 152, 0, 0.02) 100%)",
              border: "1px solid rgba(255, 152, 0, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              "&:hover": { borderColor: "#ff9800", boxShadow: "0 12px 28px rgba(255, 152, 0, 0.15)" }
            }}
          >
            <Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "#ff9800", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <AssessmentIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1 }}>Vòng đánh giá giữa kỳ</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
                Tạo mới, chỉnh sửa và theo dõi các đợt đánh giá định kỳ cho lớp thực tập phụ trách.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2.5, color: "#ff9800", fontWeight: 700, fontSize: "0.85rem" }}>
              Truy cập ngay <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Box>
          </Paper>
        </motion.div>

        {/* Card 4: Reports & Final Evaluations */}
        <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }} style={{ height: "100%" }}>
          <Paper
            onClick={() => navigate("/management/reports")}
            sx={{
              p: 2.5, borderRadius: 4, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
              background: "linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.02) 100%)",
              border: "1px solid rgba(76, 175, 80, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              "&:hover": { borderColor: "#4caf50", boxShadow: "0 12px 28px rgba(76, 175, 80, 0.15)" }
            }}
          >
            <Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "#4caf50", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <AssignmentTurnedInIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1 }}>Báo cáo & Đánh giá</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
                Chấm điểm báo cáo tuần, phân tích AI tự động, thu bản cứng và viết lời phê cuối kỳ.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2.5, color: "#4caf50", fontWeight: 700, fontSize: "0.85rem" }}>
              Truy cập ngay <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
