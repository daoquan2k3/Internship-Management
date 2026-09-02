import { useState, useRef } from "react";
import {
  Box, Typography, Paper, Stack, Button, TextField, CircularProgress, Alert, IconButton, Divider, Grid
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StarIcon from "@mui/icons-material/Star";
import { toast } from "react-toastify";
import { reportApi } from "../../../api/resourceApi";

const RoundReportCard = ({ round, report, onUploadSuccess, handleDownload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [showGrading, setShowGrading] = useState(false);
  const fileInputRef = useRef(null);

  const parseDateStr = (dateStr) => {
    if (!dateStr) return new Date();
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const now = new Date();
  const startDate = parseDateStr(round.startDate);
  // Add 1 day to endDate to make it inclusive (e.g. 23:59:59)
  const endDate = parseDateStr(round.endDate);
  endDate.setHours(23, 59, 59, 999);

  const isBeforeStart = now < startDate;
  const isAfterEnd = now > endDate;

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validExtensions.includes(file.type)) {
        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        if (ext !== ".pdf" && ext !== ".docx") {
          setError("Hệ thống chỉ hỗ trợ tải lên file PDF hoặc DOCX.");
          return;
        }
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Kích thước file vượt quá giới hạn (10MB).");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !title.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và chọn file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await reportApi.uploadReport(selectedFile, title, round.id || round.roundId);

      if (response?.data?.success || response.success) {
        toast.success("Tải báo cáo lên thành công!");
        setTitle("");
        handleRemoveFile();
        setIsResubmitting(false);
        onUploadSuccess(); // Refresh
      } else {
        const errorMsg = response?.data?.errorDescription || response?.data?.error || response?.data?.message || "Upload thất bại";
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error(err);
      let errorMsg = err?.response?.data?.errorDescription || err?.response?.data?.error || err?.response?.data?.message || err?.message || "Có lỗi xảy ra khi tải file. Vui lòng thử lại.";
      if (errorMsg === "Unauthorized" || err?.response?.status === 401 || errorMsg?.includes("Token has expired")) {
        errorMsg = "Lỗi xác thực (401): Phiên đăng nhập đã hết hạn";
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", mb: 4 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
          {round.roundName}
        </Typography>
        <Typography variant="body2" sx={{ color: isAfterEnd && !report ? "error.main" : "text.secondary", fontWeight: 600, ml: "auto" }}>
          {round.startDate} - {round.endDate}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {round.description}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {report && !isResubmitting ? (
        <Box
          sx={{
            p: 2.5,
            border: (theme) => theme.palette.mode === 'dark' ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #e2e8f0",
            borderRadius: 3,
            bgcolor: (theme) => report.reportStatus === "GRADED"
              ? (theme.palette.mode === 'dark' ? "rgba(16, 185, 129, 0.1)" : "#f8fafc")
              : (theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.04)" : "#f8fafc")
          }}
        >
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" width="100%">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1, mr: 2 }}>
              <Box
                sx={{
                  width: 48, height: 48, borderRadius: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(56, 189, 248, 0.15)" : "primary.50",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: (theme) => theme.palette.mode === 'dark' ? "#38bdf8" : "primary.main"
                }}
              >
                <AssignmentIcon />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {report.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                    Nộp lúc: {report.uploadTime}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" mt={0.5}>
                  <Box
                    sx={{
                      px: 1.5, py: 0.25, borderRadius: 8, fontSize: "0.75rem", fontWeight: 700,
                      bgcolor: (theme) => report.reportStatus === "GRADED"
                        ? (theme.palette.mode === 'dark' ? "rgba(16, 185, 129, 0.2)" : "success.50")
                        : (theme.palette.mode === 'dark' ? "rgba(245, 158, 11, 0.2)" : "warning.50"),
                      color: (theme) => report.reportStatus === "GRADED"
                        ? (theme.palette.mode === 'dark' ? "#34d399" : "success.700")
                        : (theme.palette.mode === 'dark' ? "#fbbf24" : "warning.700"),
                    }}
                  >
                    {report.reportStatus === "GRADED" ? "Đã chấm điểm" : "Chờ đánh giá"}
                  </Box>
                </Stack>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              {report.reportStatus === "GRADED" && (
                <Button
                  size="small"
                  variant={showGrading ? "contained" : "outlined"}
                  color="success"
                  onClick={() => setShowGrading(!showGrading)}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                  startIcon={<StarIcon />}
                >
                  Điểm số
                </Button>
              )}
              <Button
                size="small"
                variant="outlined"
                onClick={() => setIsResubmitting(true)}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                Nộp lại
              </Button>
              <IconButton
                size="small"
                sx={{
                  color: (theme) => theme.palette.mode === 'dark' ? "#38bdf8" : "primary.main",
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(56, 189, 248, 0.15)" : "primary.50",
                  "&:hover": { bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(56, 189, 248, 0.25)" : "primary.100" }
                }}
                onClick={() => handleDownload(report)}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {showGrading && report.reportStatus === "GRADED" && (
            <Box
              sx={{
                mt: 3, p: 3,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(0, 0, 0, 0.25)" : "#fff",
                borderRadius: 2,
                border: (theme) => theme.palette.mode === 'dark' ? "1px dashed rgba(255, 255, 255, 0.15)" : "1px dashed #cbd5e1"
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main", mb: 2, display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1 }} /> Kết quả đánh giá
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Điểm số</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {report.score} / 10
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="subtitle2" color="text.secondary">Nhận xét của giáo viên</Typography>
                  <Typography variant="body1" sx={{ color: "text.primary", mt: 0.5, whiteSpace: "pre-wrap" }}>
                    {report.feedback || "Không có nhận xét."}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      ) : (isBeforeStart && !isResubmitting) ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Đợt nộp báo cáo này chưa bắt đầu. Hãy quay lại vào ngày {round.startDate}.
        </Alert>
      ) : (isAfterEnd && !isResubmitting) ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Đã quá hạn nộp báo cáo cho đợt này.
        </Alert>
      ) : (
        <Box>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          <Stack spacing={3}>
            <TextField
              label="Tiêu đề báo cáo (Ví dụ: Báo cáo tuần 1 - Xây dựng DB)"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
            <Box
              sx={{
                border: (theme) => theme.palette.mode === 'dark' ? "2px dashed rgba(255, 255, 255, 0.2)" : "2px dashed #cbd5e1",
                borderRadius: 3, p: 3, textAlign: "center",
                bgcolor: selectedFile ? "action.hover" : "background.paper",
                transition: "all 0.2s", "&:hover": { borderColor: "primary.main", bgcolor: "action.selected" },
              }}
            >
              {selectedFile ? (
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                  <AttachFileIcon sx={{ color: "#3b82f6", fontSize: 32 }} />
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>{selectedFile.name}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={handleRemoveFile} sx={{ color: "#ef4444" }}>
                    <CloseIcon />
                  </IconButton>
                </Stack>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary", mb: 1 }}>
                    Kéo thả file vào đây hoặc nhấp để duyệt
                  </Typography>
                  <Button component="label" variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: "none" }}>
                    Chọn tập tin
                    <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} accept=".pdf,.docx" />
                  </Button>
                </>
              )}
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isUploading}
                startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, flex: 1 }}
              >
                {isUploading ? "ĐANG TẢI LÊN..." : isResubmitting ? "XÁC NHẬN NỘP LẠI" : "XÁC NHẬN NỘP BÁO CÁO"}
              </Button>
              {isResubmitting && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setIsResubmitting(false)}
                  disabled={isUploading}
                  sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
                >
                  HỦY
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default RoundReportCard;
