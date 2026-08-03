import { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Autocomplete,
  TextField, Chip, Stack, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Tooltip, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Edit as EditIcon, Close as CloseIcon, Inventory as InventoryIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { universityClassApi, finalEvaluationFormApi, universityApi } from "../../api/universityApi";
import { motion, AnimatePresence } from "framer-motion";

const statusLabel = { APPROVED: "Đã duyệt", REJECTED: "Từ chối", PENDING: "Chờ duyệt" };
const statusColor = { APPROVED: "success", REJECTED: "error", PENDING: "warning" };

const FinalEvaluationsRep = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // --- STATE DIALOG CHỈnh sửa trạng thái ---
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editHardCopy, setEditHardCopy] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const uniRes = await universityApi.getAllUniversities(1, 100);
        setUniversities(uniRes?.content || []);
        if (uniRes?.content?.length > 0) {
            setSelectedUniversity(uniRes.content[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitData();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
        if (!selectedUniversity) return;
        try {
            const res = await universityClassApi.getClassesByUniversity(selectedUniversity.universityId, 1, 100);
            setClasses(res?.content || []);
            if (res?.content?.length > 0) setSelectedClass(res.content[0]);
            else setSelectedClass(null);
        } catch (error) {
            console.error(error);
        }
    };
    fetchClasses();
  }, [selectedUniversity]);

  const fetchForms = useCallback(async () => {
    if (!selectedClass) {
        setForms([]);
        return;
    }
    setLoading(true);
    try {
      const res = await finalEvaluationFormApi.getFormsByClass(selectedClass.classId, 1, 100);
      setForms(res?.content || []);
    } catch (error) {
      toast.error("Không thể tải danh sách phiếu đánh giá.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Helper: mở file từ Cloudinary đúng cách
  // - PDF/ảnh: mở tab mới để xem inline
  // - DOCX/DOC: tải về với tên và extension đúng (tránh Notepad mở binary)
  const openCloudinaryFile = async (url, studentName, label) => {
    if (!url) return;
    const urlLower = url.toLowerCase();
    const isPdf = urlLower.includes('.pdf') || urlLower.includes('/pdf');
    const isImage = urlLower.match(/\.(jpg|jpeg|png|gif|webp|svg)/);
    if (isPdf || isImage) {
      window.open(url, '_blank', 'noreferrer');
      return;
    }
    // DOCX / DOC: xác định extension và tải về đúng cách
    let ext = 'docx';
    const extMatch = urlLower.match(/\.(docx?|doc|xlsx?|pptx?)(\?|$)/);
    if (extMatch) ext = extMatch[1];
    const safeStudentName = (studentName || 'SinhVien').replace(/\s+/g, '_');
    const fileName = `${label}_${safeStudentName}.${ext}`;
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const mimeType = ext === 'docx' 
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/msword';
      const typedBlob = new Blob([blob], { type: mimeType });
      const objectUrl = window.URL.createObjectURL(typedBlob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: mở tab mới
      window.open(url, '_blank', 'noreferrer');
    }
  };

  const handleUpdateStatus = async (formId, status) => {
    setProcessingId(formId);
    try {
      await finalEvaluationFormApi.evaluateByUniversityRep(formId, { status });
      toast.success(`Đã ${status === 'APPROVED' ? 'duyệt hoàn thành' : 'từ chối'} phiếu đánh giá!`);
      fetchForms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi xử lý.");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenEdit = (form) => {
    setEditingForm(form);
    setEditStatus(form.universityRepStatus || form.status || "PENDING");
    setEditHardCopy(form.isHardCopySubmitted ?? form.hardCopySubmitted ?? false);
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setEditingForm(null);
  };

  const handleSubmitEdit = async () => {
    if (!editingForm) return;
    setSubmittingEdit(true);
    try {
      const formId = editingForm.id || editingForm.formId;
      // Cập nhật trạng thái duyệt
      await finalEvaluationFormApi.evaluateByUniversityRep(formId, { status: editStatus });
      // Cập nhật bản cứng nếu thay đổi
      const currentHardCopy = editingForm.isHardCopySubmitted ?? editingForm.hardCopySubmitted ?? false;
      if (editHardCopy !== currentHardCopy) {
        await finalEvaluationFormApi.updateHardCopyStatus(formId, editHardCopy);
      }
      toast.success("Cập nhật trạng thái thành công!");
      handleCloseEdit();
      fetchForms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật.");
      console.error(error);
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* HEADER SECTION */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: "-0.5px" }}>
            Duyệt Đánh Giá Cuối Kỳ
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Kiểm tra bản cứng và chốt điểm cho sinh viên (Cấp Trường)
          </Typography>
        </Box>
        
        <Stack direction="row" gap={2} alignItems="center">
          <Paper sx={{ p: 1, px: 2, borderRadius: 3, bgcolor: "background.paper", display: "flex", alignItems: "center", gap: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Cơ sở đào tạo:</Typography>
            <Autocomplete
              options={universities}
              getOptionLabel={(option) => option.name}
              value={selectedUniversity}
              onChange={(_, newValue) => setSelectedUniversity(newValue)}
              renderInput={(params) => <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} sx={{ minWidth: 150 }} />}
              disableClearable
            />
          </Paper>
          <Paper sx={{ p: 1, px: 2, borderRadius: 3, bgcolor: "background.paper", display: "flex", alignItems: "center", gap: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Lớp:</Typography>
            <Autocomplete
              options={classes}
              getOptionLabel={(option) => option.className + " (" + option.academicYear + ")"}
              value={selectedClass}
              onChange={(_, newValue) => setSelectedClass(newValue)}
              renderInput={(params) => <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} sx={{ minWidth: 150 }} />}
            />
          </Paper>
        </Stack>
      </Box>

      {/* CONTENT */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress size={50} thickness={4} />
        </Box>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Tên Sinh Viên</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Đơn đánh giá doanh nghiệp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Báo cáo tổng hợp</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Điểm DN</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Bản cứng</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {forms.map((f, index) => {
                    const hardCopy = f.isHardCopySubmitted ?? f.hardCopySubmitted ?? false;
                    const repStatus = f.universityRepStatus || f.status || "PENDING";
                    return (
                    <TableRow 
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      hover 
                      key={f.id || f.formId}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{f.studentName}</TableCell>

                      {/* Phiếu đánh giá scan — dùng đúng field scannedFormUrl */}
                      <TableCell>
                        {f.scannedFormUrl ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => openCloudinaryFile(f.scannedFormUrl, f.studentName, 'Phieu_danh_gia')}
                            endIcon={<OpenInNewIcon fontSize="small" />}
                            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                          >
                            Xem file
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.disabled" fontStyle="italic">Chưa nộp</Typography>
                        )}
                      </TableCell>

                      {/* Báo cáo tổng hợp */}
                      <TableCell>
                        {f.summaryReportUrl ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => openCloudinaryFile(f.summaryReportUrl, f.studentName, 'Bao_cao_tong_hop')}
                            color="secondary"
                            endIcon={<OpenInNewIcon fontSize="small" />}
                            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
                          >
                            Xem báo cáo
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.disabled" fontStyle="italic">Chưa có</Typography>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <Box sx={{ display: "inline-block", bgcolor: "primary.light", color: "primary.contrastText", px: 2, py: 0.5, borderRadius: 10, fontWeight: 700 }}>
                          {f.companyScore !== null && f.companyScore !== undefined ? f.companyScore : "—"}
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={hardCopy ? 'Đã nộp' : 'Chưa nộp'}
                          color={hardCopy ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={statusLabel[repStatus] || repStatus}
                          color={statusColor[repStatus] || "default"}
                          size="small"
                          sx={{ fontWeight: 600, borderRadius: 2 }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Stack direction="row" gap={1} justifyContent="center">
                          {/* Nút Duyệt nhanh */}
                          {repStatus === 'PENDING' && hardCopy && (
                            <Tooltip title="Duyệt hoàn thành">
                              <IconButton
                                size="small"
                                color="success"
                                disabled={processingId === (f.id || f.formId)}
                                onClick={() => handleUpdateStatus(f.id || f.formId, "APPROVED")}
                                sx={{ bgcolor: 'success.light', '&:hover': { bgcolor: 'success.main', color: 'white' } }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {/* Nút Từ chối nhanh */}
                          {repStatus === 'PENDING' && (
                            <Tooltip title="Từ chối / Yêu cầu bổ sung">
                              <IconButton
                                size="small"
                                color="error"
                                disabled={processingId === (f.id || f.formId)}
                                onClick={() => handleUpdateStatus(f.id || f.formId, "REJECTED")}
                                sx={{ bgcolor: 'error.light', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {/* Nút Chỉnh sửa trạng thái */}
                          <Tooltip title="Chỉnh sửa trạng thái">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(f)}
                              sx={{ bgcolor: 'grey.700', color: 'white', '&:hover': { bgcolor: 'grey.600' }, borderRadius: 1.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )})}
                </AnimatePresence>
                {forms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography variant="body1" color="text.secondary">Không có phiếu đánh giá nào trong lớp này</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* DIALOG CHỈNH SỬA TRẠNG THÁI */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <InventoryIcon sx={{ color: 'primary.main' }} />
            <span>Cập nhật trạng thái hồ sơ</span>
          </Stack>
          <IconButton size="small" onClick={handleCloseEdit}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {editingForm && (
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="body2" color="text.secondary">
                Sinh viên: <b>{editingForm.studentName}</b>
              </Typography>

              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái duyệt cấp Trường</InputLabel>
                <Select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  label="Trạng thái duyệt cấp Trường"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="PENDING">⏳ Chờ duyệt</MenuItem>
                  <MenuItem value="APPROVED">✅ Đã duyệt hoàn thành</MenuItem>
                  <MenuItem value="REJECTED">❌ Từ chối / Cần bổ sung</MenuItem>
                </Select>
              </FormControl>

              <Box
                onClick={() => setEditHardCopy(!editHardCopy)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                  border: '1px solid', borderRadius: 2, cursor: 'pointer',
                  borderColor: editHardCopy ? 'success.main' : 'divider',
                  bgcolor: editHardCopy ? 'success.50' : 'background.paper',
                  transition: 'all 0.2s',
                }}
              >
                <CheckCircleIcon sx={{ color: editHardCopy ? 'success.main' : 'text.disabled' }} />
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    {editHardCopy ? 'Đã thu bản cứng' : 'Chưa thu bản cứng'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Bấm để bật/tắt trạng thái đã thu Phiếu đánh giá bản cứng
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={handleCloseEdit} variant="outlined" color="inherit" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmitEdit}
            variant="contained"
            color="primary"
            disabled={submittingEdit}
            startIcon={submittingEdit ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            {submittingEdit ? "Đang lưu..." : "Xác nhận cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinalEvaluationsRep;
