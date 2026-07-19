import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Button,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import StarIcon from "@mui/icons-material/Star";
import { reportApi } from "../../api/resourceApi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);

  // --- STATE CHO CHỨC NĂNG CHẤM ĐIỂM ---
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [gradeData, setGradeData] = useState({ score: "", feedback: "" });
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportApi.getAllReports();
      setReports(res?.content || []);
    } catch (err) {
      console.error("Lỗi khi tải báo cáo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      toast.info("Đang khởi tạo dữ liệu Excel...");
      const response = await reportApi.exportExcel(searchTerm, 0, 100);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bao_Cao_Thuc_Tap_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Xuất file thành công!");
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      toast.error("Không thể xuất file. Vui lòng thử lại!");
    } finally {
      setExporting(false);
    }
  };

  const handleExportZip = async () => {
    try {
      setExportingZip(true);
      toast.info("Đang nén toàn bộ file, vui lòng đợi...");
      const response = await reportApi.exportZip(searchTerm, 0, 100);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Tat_Ca_Bao_Cao_${new Date().getTime()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tải toàn bộ báo cáo thành công!");
    } catch (error) {
      console.error("Lỗi xuất ZIP:", error);
      toast.error("Không thể nén file. Vui lòng thử lại!");
    } finally {
      setExportingZip(false);
    }
  };

  const handleDownload = async (report) => {
    const toastId = toast.loading("Đang xử lý tải file, vui lòng đợi...");
    try {
      if (!report.fileUrl) {
        toast.update(toastId, { render: "Không tìm thấy đường dẫn file!", type: "error", isLoading: false, autoClose: 3000 });
        return;
      }
      const response = await fetch(report.fileUrl, { method: "GET", mode: "cors" });
      if (!response.ok) throw new Error("Lỗi mạng");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileExtension = report.fileUrl.split('.').pop();
      const fallbackName = `Bao_cao_so_${report.reportId}.${fileExtension}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", report.originalFileName || fallbackName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.update(toastId, { render: "Tải xuống thành công!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      toast.update(toastId, { render: "Tải xuống thất bại. Vui lòng thử lại!", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  // --- XỬ LÝ MỞ DIALOG CHẤM ĐIỂM ---
  const handleOpenGradeDialog = (report) => {
    setSelectedReport(report);
    setGradeData({
      score: report.score || "",
      feedback: report.feedback || "",
    });
    setOpenGradeDialog(true);
  };

  const handleCloseGradeDialog = () => {
    setOpenGradeDialog(false);
    setSelectedReport(null);
  };

  const handleSubmitGrade = async () => {
    if (!gradeData.score || gradeData.score < 0 || gradeData.score > 10) {
      toast.warning("Vui lòng nhập điểm hợp lệ từ 0 đến 10!");
      return;
    }

    try {
      setSubmittingGrade(true);
      await reportApi.gradeReport(selectedReport.reportId, {
        score: parseFloat(gradeData.score),
        feedback: gradeData.feedback,
      });
      toast.success("Đã lưu điểm và gửi thông báo tới sinh viên!");
      handleCloseGradeDialog();
      fetchReports(); // Refresh lại danh sách để cập nhật UI
    } catch (error) {
      console.error("Lỗi chấm điểm:", error);
      toast.error("Không thể lưu điểm lúc này!");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      {/* HEADER & SEARCH */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: "-0.5px" }}>
          Quản lý Báo cáo Sinh viên
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Danh sách các tài liệu, báo cáo tiến độ do sinh viên tải lên hệ thống
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <SearchIcon sx={{ color: "#9e9e9e", mr: 1, ml: 1 }} />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tiêu đề, tên hoặc mã sinh viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ "& fieldset": { border: "none" }, bgcolor: "#f8f9fa", borderRadius: 2 }}
        />
      </Paper>

      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            disabled={exporting}
            onClick={handleExportExcel}
            startIcon={exporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
            sx={{ borderRadius: "12px", px: 3, py: 1.2, fontWeight: 700 }}
          >
            Xuất Data (Excel)
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            disabled={exportingZip}
            onClick={handleExportZip}
            startIcon={exportingZip ? <CircularProgress size={20} color="inherit" /> : <FolderZipIcon />}
            sx={{
              borderRadius: "12px", px: 3, py: 1.2, fontWeight: 800,
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              boxShadow: "0 8px 25px rgba(30, 60, 114, 0.3)", textTransform: "none",
              "&:hover": { background: "linear-gradient(135deg, #152b52 0%, #1c3869 100%)" },
            }}
          >
            {exportingZip ? "Đang nén file..." : "Tải toàn bộ File (ZIP)"}
          </Button>
        </motion.div>
      </Box>

      {/* DANH SÁCH BÁO CÁO */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
          <CircularProgress sx={{ color: "#1565c0" }} />
        </Box>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
          <AnimatePresence>
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => (
                <motion.div
                  key={report.reportId}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  style={{ flex: "1 1 350px", maxWidth: "420px" }}
                >
                  <Paper
                    sx={{
                      p: 3, borderRadius: 4, position: "relative", overflow: "hidden",
                      background: "linear-gradient(145deg, #ffffff, #fcfcfc)",
                      boxShadow: "8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff",
                      border: "1px solid rgba(0,0,0,0.04)", height: "100%", display: "flex", flexDirection: "column",
                    }}
                  >
                    <Box sx={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(21, 101, 192, 0.05)", zIndex: 0 }} />

                    {/* STATUS CHIP (Góc trên cùng) */}
                    <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
                      {report.reportStatus === "GRADED" ? (
                        <Chip
                          icon={<StarIcon sx={{ color: "#f59e0b !important", fontSize: 16 }} />}
                          label={`${report.score} Điểm`}
                          size="small"
                          sx={{ fontWeight: 800, bgcolor: "#ecfdf5", color: "#10b981", border: "1px solid #a7f3d0" }}
                        />
                      ) : (
                        <Chip label="Chờ chấm" size="small" sx={{ fontWeight: 700, bgcolor: "#fffbeb", color: "#f59e0b", border: "1px solid #fde68a" }} />
                      )}
                    </Box>

                    <Stack direction="row" alignItems="flex-start" sx={{ position: "relative", zIndex: 1, mb: 3, pr: 8 }}>
                      <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "#e3f2fd", color: "#1565c0", mr: 2 }}>
                        <AssignmentTurnedInIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a237e", lineHeight: 1.2, mb: 0.5, wordBreak: "break-word", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {report.title}
                        </Typography>
                        <Chip label={`ID: ${report.reportId}`} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem", height: 20, bgcolor: "#f5f5f5", color: "#757575" }} />
                      </Box>
                    </Stack>

                    <Stack spacing={1.5} sx={{ mb: 3, position: "relative", zIndex: 1, bgcolor: "#f8f9fa", p: 2, borderRadius: 3, flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <BadgeIcon sx={{ color: "#757575", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Mã SV: <span style={{ fontWeight: 700, color: "#1565c0" }}>{report.studentCode}</span></Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <PersonIcon sx={{ color: "#757575", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Họ tên: <span style={{ fontWeight: 500, color: "#333" }}>{report.studentName}</span></Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <CalendarMonthIcon sx={{ color: "#757575", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Ngày nộp: <span style={{ fontWeight: 500, color: "#f57c00" }}>{report.uploadTime}</span></Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ mb: 2, position: "relative", zIndex: 1, borderStyle: "dashed" }} />

                    {/* BUTTONS: TẢI XUỐNG & CHẤM ĐIỂM */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1, gap: 1 }}>
                      <Button
                        startIcon={<EditNoteIcon />}
                        size="medium"
                        variant={report.reportStatus === "GRADED" ? "outlined" : "contained"}
                        color={report.reportStatus === "GRADED" ? "inherit" : "warning"}
                        onClick={() => handleOpenGradeDialog(report)}
                        sx={{ borderRadius: 2, fontWeight: 700, flex: 1, boxShadow: report.reportStatus !== "GRADED" ? "0 4px 10px rgba(245, 158, 11, 0.2)" : "none" }}
                      >
                        {report.reportStatus === "GRADED" ? "SỬA ĐIỂM" : "CHẤM ĐIỂM"}
                      </Button>

                      <Button
                        startIcon={<DownloadIcon />}
                        size="medium"
                        variant="contained"
                        onClick={() => handleDownload(report)}
                        sx={{ borderRadius: 2, fontWeight: 700, flex: 1, boxShadow: "0 4px 10px rgba(21, 101, 192, 0.2)", bgcolor: "#1565c0", "&:hover": { bgcolor: "#0d47a1" } }}
                      >
                        TẢI XUỐNG
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              ))
            ) : (
              <Box sx={{ gridColumn: "1 / -1", width: "100%", textAlign: "center", py: 8 }}>
                <AssignmentTurnedInIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">Hiện chưa có báo cáo nào được tải lên.</Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      )}

      {/* --- DIALOG CHẤM ĐIỂM BÁO CÁO --- */}
      <Dialog
        open={openGradeDialog}
        onClose={handleCloseGradeDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)" },
          },
        }}
        PaperProps={{
          sx: { borderRadius: "20px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", gap: 1 }}>
            <EditNoteIcon color="primary" fontSize="large" /> Đánh giá Báo cáo
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
            Sinh viên: <strong style={{ color: "#1e293b" }}>{selectedReport?.studentName}</strong> ({selectedReport?.studentCode})
            <br />
            Bài nộp: <strong style={{ color: "#1e293b" }}>{selectedReport?.title}</strong>
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Điểm số (Thang điểm 10)"
              type="number"
              variant="outlined"
              fullWidth
              value={gradeData.score}
              onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
              InputProps={{
                endAdornment: <InputAdornment position="end">/ 10</InputAdornment>,
                inputProps: { min: 0, max: 10, step: 0.1 }
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            <TextField
              label="Nhận xét của Mentor"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              placeholder="Nhập đánh giá, góp ý cho sinh viên..."
              value={gradeData.feedback}
              onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={handleCloseGradeDialog}
            variant="outlined"
            disabled={submittingGrade}
            sx={{ borderRadius: "10px", fontWeight: 700, color: "#64748b", borderColor: "#cbd5e1" }}
          >
            Hủy Bỏ
          </Button>
          <Button
            onClick={handleSubmitGrade}
            variant="contained"
            disabled={submittingGrade}
            startIcon={submittingGrade ? <CircularProgress size={20} color="inherit" /> : <StarIcon />}
            sx={{
              borderRadius: "10px", fontWeight: 800,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              "&:hover": { background: "linear-gradient(135deg, #059669 0%, #047857 100%)" },
            }}
          >
            {submittingGrade ? "Đang xử lý..." : "Lưu Điểm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportManagement;