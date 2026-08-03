import { useState, useEffect, useCallback, useContext } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { internshipApplicationApi } from "../../api/universityApi";
import { AuthContext } from "../../context/AuthContext";

const CompanyApplications = () => {
  const { user } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedAppForReject, setSelectedAppForReject] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await internshipApplicationApi.getCompanyApplications(1, 100);
      setApplications(res?.content || []);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
        fetchApplications();
    }
  }, [user, fetchApplications]);

  const handleApprove = async (appId) => {
    setProcessingId(appId);
    try {
      await internshipApplicationApi.approveApplication(appId);
      toast.success("Đã duyệt đơn thành công!");
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi duyệt đơn.");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenRejectDialog = (appId) => {
    setSelectedAppForReject(appId);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedAppForReject(null);
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    
    setProcessingId(selectedAppForReject);
    try {
      await internshipApplicationApi.rejectApplication(selectedAppForReject, rejectReason);
      toast.success("Đã từ chối đơn!");
      handleCloseRejectDialog();
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi từ chối đơn.");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Box p={{ xs: 2, md: 4 }} maxWidth="1200px" mx="auto" sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: "-0.5px" }}>
            Duyệt Đơn Ứng Tuyển
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Kiểm tra Đơn xin thực tập và phê duyệt sinh viên vào công ty.
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}><CircularProgress /></Box>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Tên Sinh Viên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Lớp Thực Tập</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Vị Trí Ứng Tuyển</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Đơn Xin Thực Tập</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng Thái</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((a) => (
                  <TableRow key={a.applicationId} sx={{ '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                    <TableCell sx={{ fontWeight: 500 }}>{a.studentName}</TableCell>
                    <TableCell>{a.className}</TableCell>
                    <TableCell>{a.position || "Không có"}</TableCell>
                    <TableCell>
                      {a.softCopyUrl ? <a href={a.softCopyUrl} target="_blank" rel="noreferrer">Xem file CV</a> : "Chưa nộp CV"}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={a.status} 
                        color={a.status === 'APPROVED' ? 'success' : a.status === 'REJECTED' ? 'error' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      {a.status === 'PENDING' ? (
                          <Box display="flex" gap={1} justifyContent="center" flexDirection="column" alignItems="center">
                              <Button 
                                  variant="contained" color="primary" size="small"
                                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none', width: '100%' }}
                                  disabled={processingId === a.applicationId}
                                  onClick={() => handleApprove(a.applicationId)}
                              >
                                  Duyệt vào công ty
                              </Button>
                              <Button 
                                  variant="outlined" color="error" size="small"
                                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, width: '100%' }}
                                  disabled={processingId === a.applicationId}
                                  onClick={() => handleOpenRejectDialog(a.applicationId)}
                              >
                                  Từ chối
                              </Button>
                          </Box>
                      ) : (
                          <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Không có đơn nào</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Từ chối đơn ứng tuyển</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vui lòng nhập lý do từ chối. Sinh viên sẽ nhận được thông báo kèm theo lý do này.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do từ chối"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseRejectDialog} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Hủy
          </Button>
          <Button onClick={handleReject} color="error" variant="contained" sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none' }} disabled={processingId === selectedAppForReject || !rejectReason.trim()}>
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyApplications;
