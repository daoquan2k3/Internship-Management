import { useState, useEffect, useContext } from "react";
import { internshipAssignmentApi, mentorApi, studentApi } from "../../../api/resourceApi";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, TextField, Typography, Stack, Paper, IconButton, Chip, Avatar, AvatarGroup, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
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

import AssignmentFormModal from "./components/AssignmentFormModal";

const InternshipAssignmentsManagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const canEdit = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN" || user?.role === "COMPANY_REP" || user?.role === "ROLE_COMPANY_REP";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);


  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    assignmentTitle: "",
    assignmentDescription: "",
    mentorId: "",
    studentIds: [],
    dueDate: "",
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

    const fetchDropdowns = async () => {
      try {
        const [mentorRes, studentRes] = await Promise.all([
          mentorApi.getAllMentors(0, 1000, ""),
          studentApi.getAllStudents(0, 1000, "")
        ]);
        if (isMounted) {
          setMentors(mentorRes?.content || mentorRes?.data?.content || []);
          setStudents(studentRes?.content || studentRes?.data?.content || []);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu dropdown:", err);
      }
    };
    fetchDropdowns();

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
        studentIds: assignment.students ? assignment.students.map(s => s.id) : [],
        dueDate: formattedDate || "",
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        assignmentTitle: "", assignmentDescription: "", mentorId: "", studentIds: [], dueDate: ""
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
        {canEdit && (
          <Button variant="contained" startIcon={<AddTaskIcon />} onClick={() => handleOpenModal()} sx={{ borderRadius: '50px', px: 4, py: 1.5, fontWeight: 700, boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', '&:hover': { transform: 'translateY(-2px)' } }}>
            Tạo Nhóm Đề Tài
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 2, display: "flex", alignItems: "center", boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField fullWidth variant="outlined" placeholder="Tìm kiếm đề tài..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} size="small" sx={{ '& fieldset': { border: 'none' }, bgcolor: "background.paper", borderRadius: 2 }} />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="assignments table">
          <TableHead sx={{ bgcolor: 'rgba(26, 35, 126, 0.03)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Đề tài</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Mentor</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Sinh viên</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {data.length > 0 ? data.map((assignment, index) => (
                <TableRow
                  key={assignment.id}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
                >
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {assignment.assignmentTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(assignment.status)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        src={assignment.mentorAvatarUrl}
                        sx={{ width: 32, height: 32, bgcolor: '#fce7f3', color: '#db2777' }}
                      >
                        {!assignment.mentorAvatarUrl && <SupervisorAccountIcon fontSize="small" />}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{assignment.mentorName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
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
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        ({assignment.students?.length || 0})
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" color="info" onClick={() => navigate(`/admin/assignments/${assignment.id}`)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {canEdit && (
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="primary" onClick={() => handleOpenModal(assignment)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <AssignmentIndIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">Chưa có đề tài / nhóm phân công nào.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

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
        mentors={mentors}
        students={students}
      />
    </Box>
  );
};

export default InternshipAssignmentsManagement;
