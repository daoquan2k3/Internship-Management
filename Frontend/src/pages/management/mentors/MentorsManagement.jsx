import { useState, useEffect } from "react";
import { mentorApi } from "../../../api/resourceApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Chip,
  Divider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import MentorFormModal from "./components/MentorFormModal";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";

const MentorsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  
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
    let isMounted = true;
    const fetchMentorsEffect = async () => {
      try {
        setLoading(true);
        const response = await mentorApi.getAllMentors(page, rowsPerPage, search);
        if (isMounted) {
          setData(response?.content || []);
          setTotalCount(response?.totalElements || 0);
        }
      } catch (err) {
        console.error("Error fetching mentors:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMentorsEffect();
    return () => { isMounted = false; };
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
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: "background.default" }}>
      
      {/* --- HEADER --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: '-0.5px' }}>
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

      {/* --- THANH TÌM KIẾM --- */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField
          fullWidth variant="outlined" placeholder="Tìm kiếm cố vấn..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small" sx={{ '& fieldset': { border: 'none' }, bgcolor: "background.paper", borderRadius: 2 }}
        />
      </Paper>

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
        <Button variant="outlined" disabled={data.length < rowsPerPage || loading || totalCount <= (page + 1) * rowsPerPage} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>
          Trang sau
        </Button>
      </Box>

      {/* --- MODAL FORM MENTOR --- */}
      <MentorFormModal 
        open={openModal}
        onClose={handleCloseModal}
        editingMentor={editingMentor}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />

      {/* --- ALERT MODAL XÁC NHẬN XÓA MENTOR --- */}
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa cố vấn?"
        content={
          <>
            Bạn có chắc chắn muốn xóa cố vấn <strong>{mentorToDelete?.fullName || 'này'}</strong>? Hành động này không thể hoàn tác.
          </>
        }
      />

    </Box>
  );
};

export default MentorsManagement;
