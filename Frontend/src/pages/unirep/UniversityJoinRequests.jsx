import { useState, useEffect, useCallback, useContext } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Autocomplete,
  TextField, Chip, Stack, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon, Cancel as CancelIcon,
  Edit as EditIcon, Close as CloseIcon, Save as SaveIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { universityApi, universityJoinRequestApi } from "../../api/universityApi";
import { motion, AnimatePresence } from "framer-motion";

const statusLabel = { APPROVED: "Đã duyệt", REJECTED: "Từ chối", PENDING: "Chờ duyệt" };
const statusColor = { APPROVED: "success", REJECTED: "error", PENDING: "warning" };

const UniversityJoinRequests = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // --- DIALOG CHỈNH SỬA ---
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [editStatus, setEditStatus] = useState("PENDING");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const uniRes = await universityApi.getAllUniversities(1, 100);
        setUniversities(uniRes?.content || []);
        if (uniRes?.content?.length > 0) {
          if (user?.universityId) {
            const myUni = uniRes.content.find(u => u.universityId === user.universityId);
            setSelectedUniversity(myUni || uniRes.content[0]);
          } else {
            setSelectedUniversity(uniRes.content[0]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitData();
  }, [user]);

  const fetchRequests = useCallback(async () => {
    if (!selectedUniversity) return;
    setLoading(true);
    try {
      const res = await universityJoinRequestApi.getRequestsByUniversity(selectedUniversity.universityId, 1, 100);
      setRequests(res?.content || []);
    } catch (error) {
      toast.error("Không thể tải danh sách yêu cầu.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedUniversity]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (requestId, status) => {
    setProcessingId(requestId);
    try {
      await universityJoinRequestApi.updateStatus(requestId, { status });
      toast.success(`Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} yêu cầu thành công!`);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi xử lý yêu cầu.");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  // --- Edit dialog ---
  const handleOpenEdit = (req) => {
    setEditingReq(req);
    setEditStatus(req.status || "PENDING");
    setOpenEditDialog(true);
  };

  const handleSubmitEdit = async () => {
    if (!editingReq) return;
    setSubmittingEdit(true);
    try {
      await universityJoinRequestApi.updateStatus(editingReq.id, { status: editStatus });
      toast.success("Cập nhật trạng thái thành công!");
      setOpenEditDialog(false);
      setEditingReq(null);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật.");
      console.error(error);
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: "-0.5px" }}>
            Yêu Cầu Gia Nhập
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Phê duyệt sinh viên đăng ký thực tập tại trường
          </Typography>
        </Box>
        <Paper sx={{ p: 1, px: 2, borderRadius: 3, bgcolor: "background.paper", display: "flex", alignItems: "center", gap: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>Cơ sở đào tạo:</Typography>
          <Autocomplete
            options={universities}
            getOptionLabel={(option) => option.name}
            value={selectedUniversity}
            onChange={(_, newValue) => setSelectedUniversity(newValue)}
            disabled={user?.role === "ROLE_UNIVERSITY_REP"}
            renderInput={(params) => <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} sx={{ minWidth: 200 }} />}
            disableClearable
          />
        </Paper>
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
                  <TableCell sx={{ fontWeight: 700 }}>Mã SV</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tên Sinh Viên</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Lớp/Ngành</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ngày gửi</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {requests.map((r, index) => (
                    <TableRow
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      hover
                      key={r.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                        {r.studentCode || r.universityStudentId || "—"}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{r.studentName}</TableCell>
                      <TableCell>
                        {(r.classRoom || r.major) ? (
                          <Box>
                            {r.classRoom && <Typography variant="body2" fontWeight={600}>{r.classRoom}</Typography>}
                            {r.major && <Typography variant="caption" color="text.secondary">{r.major}</Typography>}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.disabled" fontStyle="italic">Chưa cập nhật</Typography>
                        )}
                      </TableCell>
                      <TableCell>{new Date(r.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabel[r.status] || r.status}
                          color={statusColor[r.status] || "default"}
                          size="small"
                          sx={{ fontWeight: 600, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" gap={1} justifyContent="center">
                          {r.status === 'PENDING' && (
                            <>
                              <Button
                                variant="contained" color="success" size="small"
                                startIcon={<CheckCircleIcon />}
                                sx={{ borderRadius: 8, px: 2, boxShadow: "0 4px 10px rgba(46, 125, 50, 0.2)" }}
                                disabled={processingId === r.id}
                                onClick={() => handleUpdateStatus(r.id, "APPROVED")}
                              >
                                Duyệt
                              </Button>
                              <Button
                                variant="outlined" color="error" size="small"
                                startIcon={<CancelIcon />}
                                sx={{ borderRadius: 8, px: 2 }}
                                disabled={processingId === r.id}
                                onClick={() => handleUpdateStatus(r.id, "REJECTED")}
                              >
                                Từ chối
                              </Button>
                            </>
                          )}
                          {/* Nút sửa trạng thái */}
                          <Tooltip title="Sửa trạng thái">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(r)}
                              sx={{ bgcolor: "grey.700", color: "white", "&:hover": { bgcolor: "grey.600" }, borderRadius: 1.5, p: 0.7 }}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </AnimatePresence>
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography variant="body1" color="text.secondary">Không có yêu cầu nào</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* DIALOG SỬA TRẠNG THÁI */}
      <Dialog
        open={openEditDialog}
        onClose={() => !submittingEdit && setOpenEditDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 800 }}>
          <Typography variant="h6" fontWeight={800}>Sửa thông tin yêu cầu</Typography>
          <IconButton size="small" onClick={() => setOpenEditDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {editingReq && (
            <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>Sinh viên</Typography>
                <Typography fontWeight={700}>{editingReq.studentName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Mã SV: {editingReq.studentCode || editingReq.universityStudentId || "—"}
                  {editingReq.classRoom && ` • Lớp: ${editingReq.classRoom}`}
                  {editingReq.major && ` • Ngành: ${editingReq.major}`}
                </Typography>
              </Box>

              <TextField
                select
                label="Trạng thái duyệt"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="PENDING">⏳ Chờ duyệt</MenuItem>
                <MenuItem value="APPROVED">✅ Đã duyệt</MenuItem>
                <MenuItem value="REJECTED">❌ Từ chối</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setOpenEditDialog(false)} variant="outlined" color="inherit" sx={{ borderRadius: 2, textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmitEdit}
            variant="contained"
            disabled={submittingEdit}
            startIcon={submittingEdit ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >
            {submittingEdit ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UniversityJoinRequests;
