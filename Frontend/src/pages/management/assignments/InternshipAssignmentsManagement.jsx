import { useState, useEffect, useContext } from "react";
import { internshipAssignmentApi } from "../../../api/resourceApi";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, TextField, Typography, Stack, Paper, Divider, IconButton, Chip, Avatar, Grid, AvatarGroup, Tooltip
} from "@mui/material";

// Import Icons
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import GroupIcon from '@mui/icons-material/Group';

import AssignmentFormModal from "./components/AssignmentFormModal";

const InternshipAssignmentsManagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [formData, setFormData] = useState({
    assignmentTitle: "",
    assignmentDescription: "",
    mentorId: "",
    phaseId: "",
    studentIds: [],
    dueDate: "",
    status: "PENDING",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchAssignmentsEffect = async () => {
      try {
        setLoading(true);
        const response = await internshipAssignmentApi.getAllAssignments(search, page, rowsPerPage);
        if (isMounted) setData(response?.content || response?.data?.content || []);
      } catch (err) {
        console.error("Lỗi tải danh sách phân công:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAssignmentsEffect();
    return () => { isMounted = false; };
  }, [page, rowsPerPage, search]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await internshipAssignmentApi.getAllAssignments(search, page, rowsPerPage);
      setData(response?.content || response?.data?.content || []);
    } catch (err) {
      console.error("Lỗi tải danh sách phân công:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      let formattedDate = "";
      if (assignment.dueDate) {
        const [day, month, year] = assignment.dueDate.split('/');
        formattedDate = `${year}-${month}-${day}`;
      }
      setFormData({
        assignmentTitle: assignment.assignmentTitle || "",
        assignmentDescription: assignment.assignmentDescription || "",
        mentorId: assignment.mentorId || "",
        phaseId: assignment.phaseId || "",
        studentIds: assignment.students ? assignment.students.map(s => s.id) : [],
        dueDate: formattedDate || "",
        status: assignment.status || "PENDING",
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        assignmentTitle: "", assignmentDescription: "", mentorId: "", phaseId: "", studentIds: [], dueDate: ""
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingAssignment(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
      };

      if (editingAssignment) {
        await internshipAssignmentApi.updateAssignment(editingAssignment.id, payload);
        toast.success("Cập nhật phân công thành công!");
      } else {
        await internshipAssignmentApi.createAssignment(payload);
        toast.success("Tạo phân công mới thành công!");
      }
      handleCloseModal();
      fetchAssignments();
    } catch (err) {
      console.error("Lỗi lưu phân công:", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    if (status === 'COMPLETED') return <Chip icon={<CheckCircleIcon fontSize="small" />} label="Đã hoàn thành" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />;
    if (status === 'IN_PROGRESS') return <Chip icon={<PendingIcon fontSize="small" />} label="Đang thực hiện" size="small" sx={{ bgcolor: '#e3f2fd', color: "primary.main", fontWeight: 700 }} />;
    if (status === 'CANCELED') return <Chip icon={<CloseIcon fontSize="small" />} label="Đã hủy" size="small" sx={{ bgcolor: '#ffebee', color: '#f44336', fontWeight: 700 }} />;
    if (status === 'PENDING') return <Chip icon={<PendingIcon fontSize="small" />} label="Chờ duyệt" size="small" sx={{ bgcolor: '#fff3e0', color: '#ef6c00', fontWeight: 700 }} />;
    return <Chip label={status || "PENDING"} size="small" sx={{ bgcolor: '#fff3e0', color: '#ef6c00', fontWeight: 700 }} />;
  };

  const getAvatarColor = (index) => {
    const colors = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b'];
    return colors[index % colors.length];
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', backgroundColor: "background.default" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: '-0.5px' }}>
            Nhóm Phân công
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Quản lý đề tài và các nhóm sinh viên trực thuộc
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddTaskIcon />} onClick={() => handleOpenModal()} sx={{ borderRadius: '50px', px: 4, py: 1.5, fontWeight: 700, boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', '&:hover': { transform: 'translateY(-2px)' } }}>
            Tạo Nhóm Đề Tài
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField fullWidth variant="outlined" placeholder="Tìm kiếm đề tài..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} size="small" sx={{ '& fieldset': { border: 'none' }, bgcolor: "background.paper", borderRadius: 2 }} />
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }, gap: 4 }}>
        <AnimatePresence>
          {data.length > 0 ? data.map((assignment, index) => (
            <motion.div key={assignment.id} initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ scale: 1.02, y: -5 }} style={{ display: 'flex' }}>
              <Paper sx={{ p: 3, borderRadius: 4, position: "relative", overflow: "hidden",    display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(26, 35, 126, 0.03)', zIndex: 0 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
                  <Chip label={assignment.phaseName} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: "text.secondary", fontWeight: 700, borderRadius: 2 }} />
                  {getStatusChip(assignment.status)}
                </Stack>

                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.light", mb: 2, position: 'relative', zIndex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {assignment.assignmentTitle}
                </Typography>

                <Box sx={{ bgcolor: "background.default", p: 2, borderRadius: 3, mb: 3, flexGrow: 1, position: 'relative', zIndex: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          src={assignment.mentorAvatarUrl}
                          sx={{ width: 32, height: 32, bgcolor: '#fce7f3', color: '#db2777' }}
                        >
                          {!assignment.mentorAvatarUrl && <SupervisorAccountIcon fontSize="small" />}
                        </Avatar>
                        <Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", display: 'block', lineHeight: 1 }}>Mentor Hướng dẫn</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>{assignment.mentorName}</Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <GroupIcon fontSize="small" /> Nhóm sinh viên ({assignment.students?.length || 0})
                        </Typography>

                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.875rem', fontWeight: 600, borderColor: 'background.paper' } }}>
                          {assignment.students && assignment.students.length > 0 ? (
                            assignment.students.map((student, sIdx) => (
                              <Tooltip title={`${student.name} - ${student.code}`} key={student.id} placement="top">
                                <Avatar src={student.avatarUrl} sx={{ bgcolor: getAvatarColor(sIdx) }}>
                                  {!student.avatarUrl && student.name?.charAt(0).toUpperCase()}
                                </Avatar>
                              </Tooltip>
                            ))
                          ) : (
                            <Avatar sx={{ bgcolor: '#cbd5e1' }}>?</Avatar>
                          )}
                        </AvatarGroup>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                  <Button startIcon={<VisibilityIcon />} variant="text" onClick={() => navigate(`/admin/assignments/${assignment.id}`)} sx={{ fontWeight: 700, borderRadius: 2 }}>Xem chi tiết</Button>
                  {isAdmin && (
                    <IconButton size="small" color="primary" onClick={() => handleOpenModal(assignment)} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}><EditIcon fontSize="small" /></IconButton>
                  )}
                </Stack>
              </Paper>
            </motion.div>
          )) : (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 8 }}>
              <AssignmentIndIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Chưa có đề tài / nhóm phân công nào.</Typography>
            </Box>
          )}
        </AnimatePresence>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 6 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang trước</Button>
        <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
        <Button variant="outlined" disabled={data.length < rowsPerPage || loading} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang sau</Button>
      </Box>

      {/* --- MODAL THÊM / SỬA CHUẨN FRAMER MOTION --- */}
      <AssignmentFormModal
        open={openModal}
        onClose={handleCloseModal}
        editingAssignment={editingAssignment}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />
    </Box>
  );
};

export default InternshipAssignmentsManagement;
