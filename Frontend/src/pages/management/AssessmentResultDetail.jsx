import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Verified as VerifiedIcon,
  RateReview as RateReviewIcon,
  DateRange as DateRangeIcon,
  TrackChanges as TrackChangesIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import { assessmentResultApi } from "../../api/resourceApi";
import { motion } from "framer-motion";

const AssessmentResultDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await assessmentResultApi.getResultById(id);
        setResult(res?.data || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 4,
          borderRadius: "50px",
          px: 3,
          fontWeight: 700,
          bgcolor: "white",
          "&:hover": { bgcolor: "#f0f0f0" },
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        Quay lại danh sách
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          {/* Header Banner */}
          <Box
            sx={{
              p: 4,
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              color: "white",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <Chip
              label="Giấy Báo Điểm"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 800,
                mb: 2,
                px: 1,
              }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, mb: 1, letterSpacing: "-0.5px" }}
            >
              {result?.assignmentName || "Tên phân công trống"}
            </Typography>
          </Box>

          {/* Body Content */}
          <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "#ffffff" }}>
            {/* Thông tin sinh viên & Mentor */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ mb: 4 }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2.5,
                  bgcolor: "#f8fafc",
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Avatar
                  src={result?.studentAvatarUrl}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "#e0e7ff",
                    color: "#1e40af",
                    fontWeight: "bold",
                  }}
                >
                  {result?.studentAvatarUrl ? null : <PersonOutlineIcon />}
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Sinh viên được chấm
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}
                  >
                    {result?.studentName || "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", fontWeight: 600 }}
                  >
                    MSSV: {result?.studentCode || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2.5,
                  bgcolor: "#fff7ed",
                  borderRadius: 3,
                  border: "1px solid #dcfce7",
                }}
              >
                <Avatar
                  src={result?.evaluatorAvatarUrl}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "#dcfce7",
                    color: "#166534",
                    fontWeight: "bold",
                  }}
                >
                  {result?.evaluatorAvatarUrl ? null : <PersonOutlineIcon />}
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Mentor đánh giá
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}
                  >
                    {result?.evaluatorName || "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", fontWeight: 600 }}
                  >
                    Ngày: {result?.evaluationDate || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ mb: 4, borderStyle: "dashed" }} />

            {/* Điểm số & Chi tiết Tiêu chí */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
              }}
            >
              {/* Khung Điểm */}
              <Box
                sx={{
                  flex: 1,
                  textAlign: "center",
                  p: 4,
                  bgcolor: "#f8fafc",
                  borderRadius: 4,
                  border: "2px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <EmojiEventsIcon
                  sx={{ fontSize: 48, color: "#f59e0b", mb: 1, mx: "auto" }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Điểm số đạt được
                </Typography>
                <Typography
                  variant="h2"
                  sx={{ fontWeight: 900, color: "#10b981", mt: 1 }}
                >
                  {result?.score !== undefined ? result.score : "N/A"}
                </Typography>
                <Chip
                  label={`Mức đóng góp: ${result?.contribution || "100%"}`}
                  sx={{
                    mt: 2,
                    fontWeight: 700,
                    bgcolor: "#e0e7ff",
                    color: "#1e40af",
                  }}
                />
              </Box>

              {/* Khung Nhận xét */}
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#64748b",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    <TrackChangesIcon fontSize="small" /> VÒNG ĐÁNH GIÁ
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#1e293b" }}
                  >
                    {result?.roundName || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#64748b",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    <VerifiedIcon fontSize="small" /> TIÊU CHÍ CHẤM ĐIỂM
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#1e293b" }}
                  >
                    {result?.criterionName || "N/A"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "#fffbeb",
                    borderRadius: 3,
                    borderLeft: "4px solid #f59e0b",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#b45309",
                      fontWeight: 800,
                      mb: 1,
                    }}
                  >
                    <RateReviewIcon fontSize="small" /> NHẬN XÉT CỦA MENTOR
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: result?.comments ? "normal" : "italic",
                      color: result?.comments ? "#334155" : "#94a3b8",
                      lineHeight: 1.8,
                    }}
                  >
                    {result?.comments ||
                      result?.comment ||
                      "Mentor không để lại nhận xét chi tiết cho tiêu chí này."}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AssessmentResultDetail;
