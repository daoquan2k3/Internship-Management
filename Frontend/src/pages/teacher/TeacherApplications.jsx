import { useState, useEffect, useCallback, useContext } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Autocomplete, TextField, Chip, Tooltip, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { universityClassApi, internshipApplicationApi } from "../../api/universityApi";
import { AuthContext } from "../../context/AuthContext";

const TeacherApplications = () => {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedAppForReject, setSelectedAppForReject] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.userId) return;
      try {
        const res = await universityClassApi.getClassesByTeacher(user.userId, 1, 100);
        setClasses(res?.content || []);
        if (res?.content?.length > 0) setSelectedClass(res.content[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClasses();
  }, [user]);

  const fetchApplications = useCallback(async () => {
    if (!selectedClass) {
      setApplications([]);
      return;
    }
    setLoading(true);
    try {
      const res = await internshipApplicationApi.getApplicationsByClass(selectedClass.classId, null, 1, 100);
      setApplications(res?.content || []);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);


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
            Duyệt Đơn Vào Lớp Thực Tập
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Kiểm tra Đơn xin thực tập và phê duyệt sinh viên vào lớp.
          </Typography>
        </Box>
        <Paper sx={{ p: 1, px: 2, borderRadius: 3, bgcolor: "background.paper", display: "flex", alignItems: "center", gap: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>Lớp học do bạn phụ trách:</Typography>
          <Autocomplete
            options={classes}
            getOptionLabel={(option) => option.className + " (" + option.academicYear + ")"}
            value={selectedClass}
            onChange={(_, newValue) => setSelectedClass(newValue)}
            renderInput={(params) => <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} sx={{ minWidth: 200 }} />}
            disableClearable
          />
        </Paper>
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
                  <TableCell sx={{ fontWeight: 600 }}>Thông tin công ty</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Đơn xin thực tập</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((a) => (
                  <TableRow key={a.applicationId} sx={{ '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                    <TableCell sx={{ fontWeight: 500 }}>{a.studentName}</TableCell>
                    <TableCell>
                      {a.companyName ? (
                        <Tooltip
                          title={
                            <Box sx={{ p: 1, minWidth: 200 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', pb: 0.5 }}>
                                Chi tiết doanh nghiệp
                              </Typography>
                              <Stack spacing={1.2}>
                                <Box display="flex" alignItems="flex-start" gap={1.5}>
                                  <BusinessIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.2 }} />
                                  <Typography variant="body2" sx={{ lineHeight: 1.3 }}>{a.companyName}</Typography>
                                </Box>
                                <Box display="flex" alignItems="flex-start" gap={1.5}>
                                  <AssignmentIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.2 }} />
                                  <Typography variant="body2" sx={{ lineHeight: 1.3 }}>MST: {a.taxCode}</Typography>
                                </Box>
                                <Box display="flex" alignItems="flex-start" gap={1.5}>
                                  <PhoneIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.2 }} />
                                  <Typography variant="body2" sx={{ lineHeight: 1.3 }}>{a.contactPhone}</Typography>
                                </Box>
                                <Box display="flex" alignItems="flex-start" gap={1.5}>
                                  <WorkIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.2 }} />
                                  <Typography variant="body2" sx={{ lineHeight: 1.3 }}>Vị trí: {a.position}</Typography>
                                </Box>
                              </Stack>
                            </Box>
                          }
                          arrow
                          placement="right"
                        >
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.75, borderRadius: 2, bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' }, transition: 'background-color 0.2s' }}>
                            <BusinessIcon color="primary" fontSize="small" />
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {a.companyName}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ) : (
                        <Chip label="Chưa có" size="small" variant="outlined" sx={{ color: "text.secondary", borderColor: "divider" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {a.softCopyUrl ? <a href={a.softCopyUrl} target="_blank" rel="noreferrer">Xem đơn</a> : "Chưa nộp"}
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
                          {a.companyId == null ? (
                            <Button
                              variant="contained" color="primary" size="small"
                              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none', width: '100%' }}
                              disabled={processingId === a.applicationId}
                              onClick={() => handleApprove(a.applicationId)}
                            >
                              Duyệt vào lớp
                            </Button>
                          ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0.5 }}>
                              Đang chờ DN duyệt
                            </Typography>
                          )}
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
                    <TableCell colSpan={4} align="center">Không có đơn nào</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Từ chối đơn xin vào lớp</DialogTitle>
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

export default TeacherApplications;
