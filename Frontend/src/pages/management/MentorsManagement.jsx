import { useState, useEffect } from "react";
import { mentorApi } from "../../api/resourceApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
  Modal,
  IconButton,
  Avatar,
  Chip,
  Divider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const MentorsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  
  // State quản lý Form Modal
  const [openModal, setOpenModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  
  // State quản lý Alert Modal (Xóa)
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    department: "",
    academicRank: "",
  });

  useEffect(() => {
    fetchMentors();
  }, [page, rowsPerPage, search]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await mentorApi.getAllMentors(page, rowsPerPage, search);
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mentor = null) => {
    if (mentor) {
      setEditingMentor(mentor);
      setFormData({
        userId: "", // Reset userId khi edit
        email: mentor.email || "",
        fullName: mentor.fullName || "",
        phoneNumber: mentor.phoneNumber || "",
        department: mentor.department || "",
        academicRank: mentor.academicRank || "",
      });
    } else {
      setEditingMentor(null);
      setFormData({
        userId: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        department: "",
        academicRank: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingMentor(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingMentor) {
        await mentorApi.updateMentor(editingMentor.id, formData);
        toast.success("Cập nhật mentor thành công!");
      } else {
        await mentorApi.createMentor(formData);
        toast.success("Thêm mentor thành công!");
      }
      handleCloseModal();
      fetchMentors();
    } catch (err) {
      console.error("Error saving mentor:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC XÓA MENTOR ---
  const handleOpenDeleteModal = (mentor) => {
    setMentorToDelete(mentor);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setMentorToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!mentorToDelete) return;
    try {
      setLoading(true);
      // Giả định hàm xóa trong API của bạn là deleteMentor(id)
      await mentorApi.deleteMentor(mentorToDelete.id);
      toast.success("Xóa cố vấn thành công!");
      handleCloseDeleteModal();
      fetchMentors();
    } catch (err) {
      console.error("Lỗi khi xóa dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      
      {/* --- HEADER --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: '-0.5px' }}>
            Quản lý Cố vấn
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Danh sách các cố vấn trong hệ thống
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => handleOpenModal()}
          sx={{ 
            borderRadius: '50px', 
            px: 4, 
            py: 1.5, 
            boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 20px rgba(26, 35, 126, 0.3)' }
          }}
        >
          Thêm mentor
        </Button>
      </Box>

      {/* --- 3D CARD LIST --- */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-start' }}>
        <AnimatePresence>
          {data.map((mentor, index) => (
            <motion.div
              key={mentor.id || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{ flex: '1 1 300px', maxWidth: '350px' }}
            >
              <Paper
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  position: "relative", 
                  overflow: "hidden",
                  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                  boxShadow: '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
                  border: '1px solid rgba(255,255,255,0.5)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Decoration */}
                <Box sx={{ 
                  position: 'absolute', top: -30, right: -30, 
                  width: 100, height: 100, borderRadius: '50%', 
                  background: 'rgba(237, 108, 2, 0.05)', zIndex: 0 // Màu cam nhạt cho mentor
                }} />

                <Stack direction="row" spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1, mb: 2 }}>
                  <Avatar src={mentor.avatarUrl} sx={{ width: 56, height: 56, bgcolor: 'warning.main', fontWeight: 'bold' }}>
                    {!mentor.avatarUrl && mentor.fullName ? mentor.fullName.charAt(0) : <WorkspacePremiumIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {mentor.fullName || "Chưa cập nhật"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mentor.email || "N/A"}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 2, position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 1 }}>
                  {mentor.department && <Chip label={mentor.department} size="small" color="primary" variant="outlined" />}
                  {mentor.academicRank && <Chip label={mentor.academicRank} size="small" color="warning" variant="outlined" />}
                </Stack>

                <Stack spacing={1} sx={{ position: 'relative', zIndex: 1, mb: 3, flexGrow: 1 }}>
                  <Typography variant="body2"><strong>ID:</strong> {mentor.id || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>SĐT:</strong> {mentor.phoneNumber || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Khoa/Phòng:</strong> {mentor.department || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Học hàm/vị:</strong> {mentor.academicRank || 'N/A'}</Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                  <Button 
                    startIcon={<EditIcon />} 
                    size="small" 
                    color="primary"
                    onClick={() => handleOpenModal(mentor)}
                    sx={{ borderRadius: 2 }}
                  >
                    Chỉnh sửa
                  </Button>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleOpenDeleteModal(mentor)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* --- PAGINATION --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 6 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)} sx={{ borderRadius: '50px', px: 3 }}>
          Trang trước
        </Button>
        <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
        <Button variant="outlined" disabled={data.length < rowsPerPage} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>
          Trang sau
        </Button>
      </Box>

      {/* --- MODAL FORM MENTOR --- */}
      <Modal 
        open={openModal} 
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backdropFilter: 'blur(3px)' 
        }}
      >
        <AnimatePresence>
          {openModal && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ 
                width: '100%', 
                maxWidth: '550px', 
                outline: 'none', 
                padding: '16px' 
              }}
            >
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                
                <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a237e' }}>
                    {editingMentor ? "Cập nhật Cố vấn" : "Thêm mới Cố vấn"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ bgcolor: '#f4f6f8', '&:hover': { bgcolor: '#e0e0e0' } }}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Box sx={{ p: 4, bgcolor: '#fff', overflowY: 'auto' }}>
                  <Stack spacing={3}>
                    
                    {!editingMentor && (
                      <TextField
                        fullWidth
                        label="User ID"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        disabled={!!editingMentor}
                      />
                    )}

                    {editingMentor && (
                      <>
                        <TextField
                          fullWidth
                          label="Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                          fullWidth
                          label="Họ và tên"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        <TextField
                          fullWidth
                          label="Số điện thoại"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                      </>
                    )}

                    <TextField
                      fullWidth
                      label="Phòng ban"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />

                    <TextField
                      fullWidth
                      label="Học hàm/Học vị"
                      value={formData.academicRank}
                      onChange={(e) => setFormData({ ...formData, academicRank: e.target.value })}
                    />
                    
                  </Stack>
                </Box>

                <Box sx={{ p: 3, borderTop: '1px solid #eee', display: 'flex', gap: 2, bgcolor: '#fff' }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    color="inherit" 
                    onClick={handleCloseModal}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={handleSave}
                    sx={{ borderRadius: 2, py: 1.5, boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}
                  >
                    Lưu
                  </Button>
                </Box>

              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      {/* --- ALERT MODAL XÁC NHẬN XÓA MENTOR --- */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
      >
        <AnimatePresence>
          {openDeleteModal && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{ width: '100%', maxWidth: '400px', outline: 'none', padding: '16px' }}
            >
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', p: 3, bgcolor: '#fff' }}>
                <Stack alignItems="center" spacing={2} sx={{ textAlignment: 'center', textAlign: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'error.lighter', width: 64, height: 64, color: 'error.main', mb: 1 }}>
                    <WarningAmberRoundedIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a237e' }}>
                    Xác nhận xóa cố vấn?
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Bạn có chắc chắn muốn xóa cố vấn <strong>{mentorToDelete?.fullName || 'này'}</strong>? Hành động này không thể hoàn tác.
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    color="inherit" 
                    onClick={handleCloseDeleteModal}
                    sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="error" 
                    onClick={handleConfirmDelete}
                    sx={{ borderRadius: 2, py: 1.2, fontWeight: 600, boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)' }}
                  >
                    Xóa ngay
                  </Button>
                </Stack>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

    </Box>
  );
};

export default MentorsManagement;