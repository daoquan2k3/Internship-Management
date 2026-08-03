import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Chip, Stack, Grid, IconButton,
  CircularProgress, Alert, Paper, Divider, FormControlLabel, Checkbox, Switch
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  OpenInNew as OpenInNewIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningAmberIcon
} from "@mui/icons-material";
import { finalEvaluationFormApi } from "../../../api/universityApi";
import { toast } from "react-toastify";

const FinalEvaluationStep = ({ finalForm, classId, onRefresh, onBack }) => {
  const [file, setFile] = useState(null); // Phiếu đánh giá công ty (có dấu mộc)
  const [summaryFile, setSummaryFile] = useState(null); // Báo cáo tổng hợp thực tập
  const [isHardCopy, setIsHardCopy] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingHardCopy, setIsUpdatingHardCopy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (finalForm) {
      setIsHardCopy(finalForm.isHardCopySubmitted ?? finalForm.hardCopySubmitted ?? false);
    }
  }, [finalForm]);

  // Helper: mở file Cloudinary đúng cách theo loại
  const openCloudinaryFile = async (url, label) => {
    if (!url) return;
    const urlLower = url.toLowerCase();
    const isPdf = urlLower.includes('.pdf') || urlLower.includes('/pdf');
    const isImage = urlLower.match(/\.(jpg|jpeg|png|gif|webp|svg)/);
    if (isPdf || isImage) { window.open(url, '_blank', 'noreferrer'); return; }
    let ext = 'docx';
    const extMatch = urlLower.match(/\.(docx?|doc|xlsx?|pptx?)(\?|$)/);
    if (extMatch) ext = extMatch[1];
    const fileName = `${label}.${ext}`;
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const mimeType = ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/msword';
      const typedBlob = new Blob([blob], { type: mimeType });
      const objectUrl = window.URL.createObjectURL(typedBlob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch { window.open(url, '_blank', 'noreferrer'); }
  };

  const handleFileChange = (e, setFileState, label) => {
    const selected = e.target.files[0];
    if (selected) {
      const maxSize = 15 * 1024 * 1024; // 15MB
      if (selected.size > maxSize) {
        toast.error(`Kích thước file ${label} vượt quá giới hạn (15MB).`);
        return;
      }
      setFileState(selected);
      setError(null);
    }
  };

  const handleToggleHardCopyInView = async (e) => {
    const newStatus = e.target.checked;
    setIsUpdatingHardCopy(true);
    try {
      await finalEvaluationFormApi.updateHardCopyStatus(finalForm.id, newStatus);
      setIsHardCopy(newStatus);
      toast.success(newStatus ? "Đã xác nhận nộp bản cứng!" : "Đã chuyển về chưa nộp bản cứng.");
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Cập nhật trạng thái bản cứng thất bại.";
      toast.error(msg);
      console.error(err);
    } finally {
      setIsUpdatingHardCopy(false);
    }
  };

  const handleSubmit = async () => {
    if (!file || !summaryFile || !classId) {
      setError("Vui lòng tải lên đầy đủ Phiếu đánh giá của Công ty và Báo cáo tổng hợp thực tập.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await finalEvaluationFormApi.submitForm(
        file,
        summaryFile,
        classId,
        null,
        null,
        isHardCopy
      );
      toast.success(isResubmitting ? "Nộp lại hồ sơ thành công!" : "Nộp hồ sơ tổng kết thực tập thành công!");
      setIsResubmitting(false);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Nộp hồ sơ thất bại.";
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (finalForm && !isResubmitting) {
    const statusMap = {
      PENDING: { label: "Đang chờ khoa duyệt", color: "warning", bgcolor: "warning.50", textcolor: "warning.700" },
      APPROVED: { label: "Đã duyệt hoàn thành", color: "success", bgcolor: "success.50", textcolor: "success.700" },
      REJECTED: { label: "Cần chỉnh sửa/Từ chối", color: "error", bgcolor: "error.50", textcolor: "error.700" },
    };
    const statusKey = finalForm.universityRepStatus || finalForm.status || finalForm.teacherStatus;
    const currentStatus = statusMap[statusKey] || { label: "Đang xử lý", color: "default", bgcolor: "action.selected", textcolor: "text.primary" };
    const isApproved = statusKey === "APPROVED" || currentStatus.color === "success";
    const isRejected = statusKey === "REJECTED" || currentStatus.color === "error";

    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          border: (theme) => theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #e2e8f0",
          borderRadius: 4,
          bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 52, height: 52, borderRadius: 3,
                bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.15)" : "success.50",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: (theme) => theme.palette.mode === "dark" ? "#34d399" : "success.main"
              }}
            >
              <AssignmentIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                Hồ sơ Đánh giá Cuối kỳ
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Bạn đã nộp hồ sơ tổng kết thực tập lên hệ thống
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              label={currentStatus.label}
              color={currentStatus.color}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
            <Chip
              label={isHardCopy ? "Đã nộp bản cứng" : "Chưa nộp bản cứng"}
              color={isHardCopy ? "success" : "default"}
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: 2 }}
            />
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Thông báo lỗi khi hồ sơ bị từ chối / yêu cầu chỉnh sửa */}
        {isRejected && (
          <Alert
            severity="error"
            icon={<WarningAmberIcon fontSize="large" />}
            sx={{
              mb: 3,
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #fca5a5",
              bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(239, 68, 68, 0.15)" : "#fef2f2",
              "& .MuiAlert-message": { width: "100%" }
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#dc2626", mb: 0.5 }}>
              Hồ sơ đánh giá cuối kỳ chưa đạt yêu cầu hoặc cần chỉnh sửa
            </Typography>
            <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#fca5a5" : "#991b1b", mb: 1.5 }}>
              Giảng viên hoặc Khoa/Nhà trường đã yêu cầu bạn rà soát lại thông tin trong phiếu đánh giá hoặc báo cáo tổng hợp.
            </Typography>
            {(finalForm.companyFeedback || finalForm.teacherFeedback || finalForm.feedback) && (
              <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.7)", borderRadius: 2, border: "1px dashed #f87171", mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#dc2626", textTransform: "uppercase", display: "block" }}>
                  Lời nhắn / Yêu cầu chỉnh sửa:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#b91c1c" }}>
                  "{finalForm.companyFeedback || finalForm.teacherFeedback || finalForm.feedback}"
                </Typography>
              </Box>
            )}
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#dc2626" }}>
              👉 Vui lòng nhấn nút "Chỉnh sửa & Nộp lại hồ sơ ngay" bên dưới để cập nhật lại tài liệu mới nhất.
            </Typography>
          </Alert>
        )}

        {/* Khung xác nhận nộp bản cứng */}
        <Box
          sx={{
            p: 2.5, mb: 3, borderRadius: 3,
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.08)" : "#f0fdf4",
            border: (theme) => theme.palette.mode === "dark" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid #bbf7d0",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                Xác nhận nộp bản cứng cho Khoa
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Bật nút này nếu bạn đã nộp Phiếu đánh giá (có dấu mộc đỏ) trực tiếp tại văn phòng Khoa/GV hướng dẫn
              </Typography>
            </Box>
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={isHardCopy}
                onChange={handleToggleHardCopyInView}
                disabled={isUpdatingHardCopy}
                color="success"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 700, color: isHardCopy ? "success.main" : "text.secondary" }}>
                {isUpdatingHardCopy ? "Đang lưu..." : (isHardCopy ? "ĐÃ NỘP BẢN CỨNG" : "CHƯA NỘP")}
              </Typography>
            }
            labelPlacement="start"
            sx={{ m: 0 }}
          />
        </Box>

        <Box
          sx={{
            p: 3, mb: 3, borderRadius: 3,
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.04)" : "#f8fafc",
            border: (theme) => theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.5px", mb: 2 }}>
            Tài liệu đã nộp cho Khoa
          </Typography>

          <Grid container spacing={2}>
            {finalForm.scannedFormUrl && (
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<DescriptionIcon sx={{ color: "#ef4444" }} />}
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  onClick={() => openCloudinaryFile(finalForm.scannedFormUrl, 'Phieu_danh_gia_cong_ty')}
                  fullWidth
                  sx={{ justifyContent: "space-between", py: 1.5, px: 2.5, borderRadius: 2, textTransform: "none", fontWeight: 600, textAlign: "left", bgcolor: "background.paper" }}
                >
                  <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    1. Phiếu đánh giá của công ty (Mộc đỏ)
                  </Box>
                </Button>
              </Grid>
            )}

            {finalForm.summaryReportUrl ? (
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<DescriptionIcon sx={{ color: "#3b82f6" }} />}
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  onClick={() => openCloudinaryFile(finalForm.summaryReportUrl, 'Bao_cao_tong_hop_thuc_tap')}
                  fullWidth
                  sx={{ justifyContent: "space-between", py: 1.5, px: 2.5, borderRadius: 2, textTransform: "none", fontWeight: 600, textAlign: "left", bgcolor: "background.paper" }}
                >
                  <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    2. Báo cáo tổng hợp thực tập (Word/PDF)
                  </Box>
                </Button>
              </Grid>
            ) : (
              <Grid item xs={12} md={6}>
                <Alert severity="info" sx={{ py: 0.8 }}>
                  Chưa có file báo cáo tổng hợp (dữ liệu cũ)
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Nút Nộp lại hồ sơ hoặc thông báo hoàn tất */}
        {isApproved ? (
          <Box sx={{ p: 2.5, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.12)" : "#ecfdf5", borderRadius: 3, border: "1px solid #10b981", textAlign: "center", mt: 2 }}>
            <Typography variant="subtitle1" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#34d399" : "#047857", fontWeight: 800 }}>
              🎉 Hồ sơ đánh giá của bạn đã được phê duyệt hoàn tất.
            </Typography>
            <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#6ee7b7" : "#059669", mt: 0.5 }}>
              Bạn đã chính thức hoàn thành toàn bộ yêu cầu của học phần thực tập!
            </Typography>
          </Box>
        ) : (
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant={isRejected ? "contained" : "outlined"}
              color={isRejected ? "error" : "primary"}
              startIcon={<EditIcon />}
              onClick={() => {
                setIsResubmitting(true);
                setFile(null);
                setSummaryFile(null);
              }}
              sx={{ py: 1.2, px: 3, borderRadius: 2, fontWeight: 700, textTransform: "none", boxShadow: isRejected ? "0 4px 14px rgba(239, 68, 68, 0.3)" : "none" }}
            >
              {isRejected ? "Chỉnh sửa & Nộp lại hồ sơ ngay" : "Nộp lại / Cập nhật tài liệu mới"}
            </Button>
          </Stack>
        )}
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 4 },
        border: (theme) => theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #e2e8f0",
        borderRadius: 4,
        bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "#ffffff",
      }}
    >
      <Button
        variant="text"
        onClick={isResubmitting ? () => setIsResubmitting(false) : onBack}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
      >
        {isResubmitting ? "Hủy nộp lại và quay về bài đã nộp" : "Trở lại màn hình quy trình"}
      </Button>

      <Box mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: (theme) => theme.palette.mode === "dark" ? "primary.light" : "primary.main", mb: 1 }}>
          {isResubmitting ? "Nộp Lại Hồ sơ Tổng kết Thực tập" : "Nộp Hồ sơ Tổng kết Thực tập"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vui lòng chuẩn bị đầy đủ <b>02 loại tài liệu</b> dưới đây theo đúng hướng dẫn của khoa để {isResubmitting ? "nộp lại" : "nộp"} lên hệ thống:
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid container spacing={3} mb={4}>
        {/* Box Upload 1: Phiếu đánh giá */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: (theme) => theme.palette.mode === "dark" ? "2px dashed rgba(255, 255, 255, 0.2)" : "2px dashed #cbd5e1",
              borderRadius: 3, p: 3, textAlign: "center", height: "100%",
              bgcolor: file ? "action.hover" : "background.paper",
              transition: "all 0.2s",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Box mb={2}>
              <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "error.50", color: "error.main", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
                <AssignmentIcon />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                1. Đơn đánh giá doanh nghiệp
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
                Là Đơn đánh giá doanh nghiệp (File Word/PDF/Ảnh) có <b>dấu mộc xác nhận</b> và điểm số được chấm trong đó.
              </Typography>
            </Box>

            {file ? (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ p: 1.5, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(0,0,0,0.3)" : "#fff", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                <AttachFileIcon sx={{ color: "#ef4444", fontSize: 24 }} />
                <Box sx={{ textAlign: "left", overflow: "hidden", flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", noWrap: true, textOverflow: "ellipsis", overflow: "hidden" }}>{file.name}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</Typography>
                </Box>
                <IconButton size="small" onClick={() => setFile(null)} sx={{ color: "#ef4444" }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            ) : (
              <Button component="label" variant="outlined" color="error" startIcon={<CloudUploadIcon />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
                Chọn file Đơn đánh giá doanh nghiệp (.pdf, .docx, ảnh)
                <input type="file" hidden onChange={(e) => handleFileChange(e, setFile, "Đơn đánh giá doanh nghiệp")} accept=".pdf,.docx,.doc,image/*" />
              </Button>
            )}
          </Box>
        </Grid>

        {/* Box Upload 2: Báo cáo tổng hợp */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: (theme) => theme.palette.mode === "dark" ? "2px dashed rgba(255, 255, 255, 0.2)" : "2px dashed #cbd5e1",
              borderRadius: 3, p: 3, textAlign: "center", height: "100%",
              bgcolor: summaryFile ? "action.hover" : "background.paper",
              transition: "all 0.2s",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Box mb={2}>
              <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "primary.50", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
                <DescriptionIcon />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                2. Báo cáo Tổng hợp Thực tập
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
                Là file báo cáo tổng hợp (Word/PDF) mô tả chi tiết toàn bộ nội dung công việc và kết quả đạt được trong suốt quá trình thực tập.
              </Typography>
            </Box>

            {summaryFile ? (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ p: 1.5, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(0,0,0,0.3)" : "#fff", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                <AttachFileIcon sx={{ color: "#3b82f6", fontSize: 24 }} />
                <Box sx={{ textAlign: "left", overflow: "hidden", flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", noWrap: true, textOverflow: "ellipsis", overflow: "hidden" }}>{summaryFile.name}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>{(summaryFile.size / (1024 * 1024)).toFixed(2)} MB</Typography>
                </Box>
                <IconButton size="small" onClick={() => setSummaryFile(null)} sx={{ color: "#ef4444" }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            ) : (
              <Button component="label" variant="outlined" color="primary" startIcon={<CloudUploadIcon />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
                Chọn file Báo cáo tổng hợp (.docx, .pdf)
                <input type="file" hidden onChange={(e) => handleFileChange(e, setSummaryFile, "Báo cáo tổng hợp")} accept=".pdf,.docx,.doc" />
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, p: 2, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isHardCopy}
              onChange={(e) => setIsHardCopy(e.target.checked)}
              color="success"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              Tôi xác nhận đã nộp (hoặc sẽ nộp sớm) Phiếu đánh giá bản cứng có dấu mộc đỏ tại văn phòng Khoa/GV
            </Typography>
          }
        />
      </Box>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!file || !summaryFile || isLoading}
          onClick={handleSubmit}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          sx={{ py: 1.5, px: 4, borderRadius: 2.5, fontWeight: 700, boxShadow: 4 }}
        >
          {isLoading ? "ĐANG TẢI HỒ SƠ LÊN..." : (isResubmitting ? "XÁC NHẬN NỘP LẠI HỒ SƠ" : "XÁC NHẬN NỘP HỒ SƠ TỔNG KẾT")}
        </Button>

        {isResubmitting && (
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            disabled={isLoading}
            onClick={() => setIsResubmitting(false)}
            sx={{ py: 1.5, px: 3, borderRadius: 2.5, fontWeight: 600 }}
          >
            Hủy bỏ
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default FinalEvaluationStep;
