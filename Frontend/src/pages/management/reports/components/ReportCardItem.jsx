import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Button,
  Chip,
  Divider,
  Collapse,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";
import StarIcon from "@mui/icons-material/Star";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ReplayIcon from "@mui/icons-material/Replay";
import { motion } from "framer-motion";

const ReportCardItem = ({
  report,
  index,
  analyzingId,
  handleAnalyzeAI,
  handleOpenGradeDialog,
  handleDownload,
}) => {
  const [showAI, setShowAI] = useState(false);
  const hasAI = Boolean(report.aiSummary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 28px -8px rgba(0,0,0,0.1)",
            borderColor: "primary.light",
          },
        }}
      >
        {/* Background decorative bubble */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(21,101,192,0.08) 0%, rgba(21,101,192,0) 70%)",
            zIndex: 0,
          }}
        />

        {/* STATUS CHIP (Góc trên cùng) */}
        <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
          {report.reportStatus === "GRADED" ? (
            <Chip
              icon={<StarIcon sx={{ color: "#f59e0b !important", fontSize: 16 }} />}
              label={`${report.score} Điểm`}
              size="small"
              sx={{
                fontWeight: 800,
                bgcolor: "#ecfdf5",
                color: "#10b981",
                border: "1px solid #a7f3d0",
                boxShadow: "0 2px 6px rgba(16,185,129,0.15)",
              }}
            />
          ) : (
            <Chip
              label="Chờ chấm"
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: "#fffbeb",
                color: "#f59e0b",
                border: "1px solid #fde68a",
              }}
            />
          )}
        </Box>

        {/* TITLE & ID */}
        <Stack
          direction="row"
          alignItems="flex-start"
          sx={{ position: "relative", zIndex: 1, mb: 2.5, pr: 8 }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: "rgba(21,101,192,0.08)",
              color: "primary.main",
              mr: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AssignmentTurnedInIcon />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                fontSize: "1.05rem",
                lineHeight: 1.3,
                mb: 0.5,
                wordBreak: "break-word",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {report.title}
            </Typography>
            <Chip
              label={`ID: ${report.reportId}`}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.68rem",
                height: 20,
                bgcolor: "action.hover",
                color: "text.secondary",
              }}
            />
          </Box>
        </Stack>

        {/* STUDENT INFO BOX */}
        <Stack
          spacing={1.2}
          sx={{
            mb: 2.5,
            position: "relative",
            zIndex: 1,
            bgcolor: "action.hover",
            p: 2,
            borderRadius: 3,
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.2}>
            <BadgeIcon sx={{ color: "text.secondary", fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
              Mã SV:{" "}
              <span style={{ fontWeight: 700, color: "#1976d2" }}>
                {report.studentCode}
              </span>
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1.2}>
            <PersonIcon sx={{ color: "text.secondary", fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
              Họ tên:{" "}
              <span style={{ fontWeight: 600, color: "#212121" }}>
                {report.studentName}
              </span>
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1.2}>
            <CalendarMonthIcon sx={{ color: "text.secondary", fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
              Ngày nộp:{" "}
              <span style={{ fontWeight: 500, color: "#e65100" }}>
                {report.uploadTime}
              </span>
            </Typography>
          </Stack>
        </Stack>

        {/* AI INSIGHTS SECTION */}
        <Box sx={{ mb: 2.5, position: "relative", zIndex: 1, flexGrow: 1 }}>
          {hasAI ? (
            <Box
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: showAI ? "#9c27b0" : "rgba(156, 39, 176, 0.25)",
                bgcolor: showAI ? "rgba(156, 39, 176, 0.04)" : "rgba(156, 39, 176, 0.02)",
                transition: "all 0.25s ease",
                overflow: "hidden",
              }}
            >
              {/* AI HEADER / TOGGLE BUTTON */}
              <Box
                onClick={() => setShowAI(!showAI)}
                sx={{
                  p: 1.5,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                  "&:hover": { bgcolor: "rgba(156, 39, 176, 0.08)" },
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <AutoAwesomeIcon sx={{ color: "#9c27b0", fontSize: 20 }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#9c27b0", fontWeight: 700, fontSize: "0.9rem" }}
                  >
                    Phân tích AI (Gemini)
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" gap={1}>
                  {!showAI && report.aiSentiment && (
                    <Chip
                      label={report.aiSentiment}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        bgcolor: report.aiSentiment?.includes("TÍCH")
                          ? "#ecfdf5"
                          : report.aiSentiment?.includes("TIÊU")
                          ? "#fef2f2"
                          : "#eff6ff",
                        color: report.aiSentiment?.includes("TÍCH")
                          ? "#10b981"
                          : report.aiSentiment?.includes("TIÊU")
                          ? "#ef4444"
                          : "#3b82f6",
                      }}
                    />
                  )}
                  <Chip
                    label={showAI ? "Thu gọn" : "Xem chi tiết"}
                    size="small"
                    icon={showAI ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{
                      height: 24,
                      fontWeight: 600,
                      bgcolor: "rgba(156, 39, 176, 0.1)",
                      color: "#9c27b0",
                      "& .MuiChip-icon": { color: "#9c27b0" },
                    }}
                  />
                </Stack>
              </Box>

              {/* AI COLLAPSIBLE CONTENT */}
              <Collapse in={showAI}>
                <Box
                  sx={{
                    p: 2,
                    pt: 0.5,
                    borderTop: "1px dashed rgba(156, 39, 176, 0.2)",
                  }}
                >
                  <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#9c27b0",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        📌 Tóm tắt nội dung:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: "text.primary",
                          pl: 1.5,
                          borderLeft: "2px solid #9c27b0",
                          lineHeight: 1.5,
                        }}
                      >
                        {report.aiSummary}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#d32f2f",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        ⚠️ Khó khăn / Hạn chế:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: "text.primary",
                          pl: 1.5,
                          borderLeft: "2px solid #d32f2f",
                          lineHeight: 1.5,
                        }}
                      >
                        {report.aiBlockers}
                      </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" gap={1} sx={{ pt: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#1976d2",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        💡 Đánh giá thái độ:
                      </Typography>
                      <Chip
                        label={report.aiSentiment}
                        size="small"
                        sx={{
                          height: 22,
                          fontWeight: 700,
                          bgcolor: report.aiSentiment?.includes("TÍCH")
                            ? "#ecfdf5"
                            : report.aiSentiment?.includes("TIÊU")
                            ? "#fef2f2"
                            : "#eff6ff",
                          color: report.aiSentiment?.includes("TÍCH")
                            ? "#10b981"
                            : report.aiSentiment?.includes("TIÊU")
                            ? "#ef4444"
                            : "#3b82f6",
                        }}
                      />
                    </Stack>

                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "rgba(46, 125, 50, 0.06)",
                        borderRadius: 2,
                        border: "1px solid rgba(46, 125, 50, 0.2)",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: "#2e7d32",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          💬 Gợi ý nhận xét cho Mentor:
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{ color: "#1b5e20", fontStyle: "italic", lineHeight: 1.5 }}
                      >
                        "{report.aiSuggestedFeedback}"
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => handleAnalyzeAI(report)}
                        disabled={analyzingId === report.reportId}
                        startIcon={
                          analyzingId === report.reportId ? (
                            <CircularProgress size={14} />
                          ) : (
                            <ReplayIcon sx={{ fontSize: 16 }} />
                          )
                        }
                        sx={{
                          fontSize: "0.75rem",
                          color: "#9c27b0",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        {analyzingId === report.reportId
                          ? "Đang phân tích lại..."
                          : "Phân tích lại bằng AI"}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleAnalyzeAI(report)}
              disabled={analyzingId === report.reportId}
              startIcon={
                analyzingId === report.reportId ? (
                  <CircularProgress size={18} color="secondary" />
                ) : (
                  <AutoAwesomeIcon />
                )
              }
              sx={{
                py: 1.2,
                borderRadius: 2.5,
                fontWeight: 700,
                border: "1.5px dashed",
                borderColor: "#9c27b0",
                color: "#9c27b0",
                bgcolor: "rgba(156, 39, 176, 0.02)",
                transition: "all 0.2s ease",
                "&:hover": {
                  border: "1.5px solid",
                  borderColor: "#7b1fa2",
                  bgcolor: "rgba(156, 39, 176, 0.08)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(156, 39, 176, 0.15)",
                },
              }}
            >
              {analyzingId === report.reportId
                ? "AI ĐANG PHÂN TÍCH..."
                : "PHÂN TÍCH BÁO CÁO BẰNG AI"}
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

        {/* BOTTOM ACTION BUTTONS */}
        <Box sx={{ display: "flex", gap: 1.5, position: "relative", zIndex: 1 }}>
          <Button
            startIcon={<EditNoteIcon />}
            size="medium"
            variant={report.reportStatus === "GRADED" ? "outlined" : "contained"}
            color={report.reportStatus === "GRADED" ? "primary" : "warning"}
            onClick={() => handleOpenGradeDialog(report)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              flex: 1,
              py: 1,
              boxShadow:
                report.reportStatus !== "GRADED"
                  ? "0 4px 12px rgba(245, 158, 11, 0.25)"
                  : "none",
              textTransform: "none",
              fontSize: "0.85rem",
            }}
          >
            {report.reportStatus === "GRADED" ? "Sửa điểm" : "Chấm điểm"}
          </Button>

          <Button
            startIcon={<DownloadIcon />}
            size="medium"
            variant="contained"
            color="primary"
            onClick={() => handleDownload(report)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              flex: 1,
              py: 1,
              boxShadow: "0 4px 12px rgba(21, 101, 192, 0.25)",
              textTransform: "none",
              fontSize: "0.85rem",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Tải xuống
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ReportCardItem;
