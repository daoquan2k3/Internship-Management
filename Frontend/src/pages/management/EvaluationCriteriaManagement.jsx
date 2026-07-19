import { useState, useEffect, useContext } from "react";
import { evaluationCriteriaApi } from "../../api/resourceApi";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Stack,
  Paper,
  Divider,
  Modal,
  IconButton,
  Chip,
  Avatar
} from "@mui/material";

// Import Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddTaskIcon from '@mui/icons-material/AddTask';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import RuleIcon from '@mui/icons-material/Rule';
import GradeIcon from '@mui/icons-material/Grade';

const EvaluationCriteriaManagement = () => {
  // ==========================================
  // PHẦN LOGIC
  // ==========================================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  // State Modal Thêm/Sửa
  const [openModal, setOpenModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);

  // State Modal Xóa
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState(null);

  const [formData, setFormData] = useState({
    criterionName: "",
    description: "",
    maxScore: "",
    isDeleted: false,
  });

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  useEffect(() => {
    fetchCriteria();
  }, [page, rowsPerPage, search]);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const response = await evaluationCriteriaApi.getAllCriteria(search, page, rowsPerPage);
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error loading criteria:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (criteria = null) => {
    if (criteria) {
      setEditingCriteria(criteria);
      setFormData({
        criterionName: criteria.criterionName || "",
        description: criteria.description || "",
        maxScore: criteria.maxScore || "",
        isDeleted: criteria.isDeleted || false,
      });
    } else {
      setEditingCriteria(null);
      setFormData({
        criterionName: "",
        description: "",
        maxScore: "",
        isDeleted: false,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCriteria(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingCriteria) {
        await evaluationCriteriaApi.updateCriteria(editingCriteria.id, formData);
        toast.success("Cập nhật tiêu chí thành công!");
      } else {
        await evaluationCriteriaApi.createCriteria(formData);
        toast.success("Thêm tiêu chí thành công!");
      }
      handleCloseModal();
      fetchCriteria();
    } catch (err) {
      console.error("Error saving criteria:", err);
      toast.error("Có lỗi xảy ra khi lưu tiêu chí!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (criteria) => {
    setCriteriaToDelete(criteria);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setCriteriaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!criteriaToDelete) return;
    const targetId = criteriaToDelete.id;
    try {
      setLoading(true);
      await evaluationCriteriaApi.deleteCriteria(targetId);
      toast.success("Xóa tiêu chí thành công!");
      handleCloseDeleteModal();
      fetchCriteria();
    } catch (err) {
      console.error("Error deleting criteria:", err);
      toast.error("Có lỗi xảy ra khi xóa tiêu chí!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#f4f6f8' }}>

      {/* --- HEADER CHÍNH --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: '-0.5px' }}>
            Quản lý Tiêu chí Đánh giá
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Thiết lập bộ khung tiêu chí và thang điểm cho đồ án
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            size="large"
            startIcon={<AddTaskIcon />}
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
            Thêm mới
          </Button>
        )}
      </Box>

      {/* --- THANH TÌM KIẾM --- */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm tiêu chí..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small"
          sx={{ '& fieldset': { border: 'none' }, bgcolor: '#f8f9fa', borderRadius: 2 }}
        />
      </Paper>

      {/* --- DANH SÁCH THẺ 3D --- */}
      {/* --- DANH SÁCH THẺ --- */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 4,
          alignItems: "stretch",
        }}
      >
        <AnimatePresence>
          {data.map((criteria, index) => (
            <motion.div
              key={criteria.id || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.03,
                y: -5,
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                  background:
                    "linear-gradient(145deg, #ffffff, #fcfcfc)",
                  boxShadow:
                    "8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff",
                  border: "1px solid rgba(0,0,0,0.04)",

                  display: "flex",
                  flexDirection: "column",

                  height: "100%",
                  minHeight: 320,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(0, 150, 136, 0.05)",
                    zIndex: 0,
                  }}
                />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: "#e0f2f1",
                        color: "#00897b",
                      }}
                    >
                      <RuleIcon />
                    </Box>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: "#004d40",
                          lineHeight: 1.2,
                          mb: 0.5,
                        }}
                      >
                        {criteria.criterionName || "Chưa có tên"}
                      </Typography>

                      <Chip
                        label={
                          criteria.isDeleted
                            ? "Đã khóa"
                            : "Hoạt động"
                        }
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          height: 22,
                          bgcolor: criteria.isDeleted
                            ? "rgba(211,47,47,0.1)"
                            : "rgba(46,125,50,0.1)",
                          color: criteria.isDeleted
                            ? "#d32f2f"
                            : "#2e7d32",
                        }}
                      />
                    </Box>
                  </Box>
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    flexGrow: 1,
                    mb: 3,

                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",

                    minHeight: 60,
                  }}
                >
                  {criteria.description ||
                    "Chưa có mô tả cho tiêu chí này."}
                </Typography>

                <Box
                  sx={{
                    mb: 3,
                    bgcolor: "#fff8e1",
                    p: 1.5,
                    borderRadius: 3,
                    border: "1px dashed #ffd54f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <GradeIcon
                    sx={{
                      color: "#f57f17",
                      fontSize: 24,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#555",
                    }}
                  >
                    Điểm tối đa:
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#e65100",
                    }}
                  >
                    {criteria.maxScore || "0"}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {isAdmin && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      color="primary"
                      onClick={() =>
                        handleOpenModal(criteria)
                      }
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      Chỉnh sửa
                    </Button>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        handleOpenDeleteModal(criteria)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* --- PAGINATION CHẠY TAY --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 6 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)} sx={{ borderRadius: '50px', px: 3 }}>
          Trang trước
        </Button>
        <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
        <Button variant="outlined" disabled={data.length < rowsPerPage} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>
          Trang sau
        </Button>
      </Box>

      {/* --- MODAL THÊM / SỬA KẾT HỢP FRAMER MOTION --- */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}
      >
        <AnimatePresence>
          {openModal && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ width: '100%', maxWidth: '500px', outline: 'none', padding: '16px' }}
            >
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a237e' }}>
                    {editingCriteria ? "Cập nhật Tiêu chí" : "Tạo Tiêu chí mới"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ bgcolor: '#f4f6f8', '&:hover': { bgcolor: '#e0e0e0' } }}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Divider />

                <Box sx={{ p: 4, bgcolor: '#fff', overflowY: 'auto' }}>
                  <Stack spacing={3}>
                    <TextField fullWidth label="Tên tiêu chí (Criteria Name)" value={formData.criterionName} onChange={(e) => setFormData({ ...formData, criterionName: e.target.value })} />
                    <TextField fullWidth label="Mô tả chi tiết" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} multiline rows={3} />
                    <TextField fullWidth label="Điểm tối đa (Max Score)" type="number" value={formData.maxScore} onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })} />

                    {/* Khung Trạng thái */}
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f8f9fa", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#555" }}>Trạng thái hoạt động</Typography>
                      <FormControlLabel
                        control={<Switch checked={!formData.isDeleted} onChange={(e) => setFormData({ ...formData, isDeleted: !e.target.checked })} color="primary" />}
                        label={<Typography variant="body2" sx={{ fontWeight: "bold", color: !formData.isDeleted ? "#2e7d32" : "#d32f2f" }}>{!formData.isDeleted ? "Hoạt động" : "Khóa"}</Typography>}
                        labelPlacement="start" sx={{ m: 0 }}
                      />
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ p: 3, pt: 0, display: 'flex', gap: 2, bgcolor: '#fff', borderTop: '1px solid #eee', mt: 2 }}>
                  <Button fullWidth variant="outlined" color="inherit" onClick={handleCloseModal} sx={{ borderRadius: 2, py: 1.5, mt: 2 }}>
                    Hủy bỏ
                  </Button>
                  <Button fullWidth variant="contained" onClick={handleSave} sx={{ borderRadius: 2, py: 1.5, mt: 2, boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}>
                    Lưu thông tin
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      {/* --- ALERT MODAL XÁC NHẬN XÓA --- */}
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
                <Stack alignItems="center" spacing={2} sx={{ textAlignment: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'error.lighter', width: 64, height: 64, color: 'error.main', mb: 1 }}>
                    <WarningAmberRoundedIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a237e' }}>
                    Xác nhận xóa tiêu chí?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bạn có chắc chắn muốn xóa tiêu chí <strong>{criteriaToDelete?.criterionName || "này"}</strong>? Hành động này không thể hoàn tác.
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button fullWidth variant="outlined" color="inherit" onClick={handleCloseDeleteModal} sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}>
                    Hủy bỏ
                  </Button>
                  <Button fullWidth variant="contained" color="error" onClick={handleConfirmDelete} sx={{ borderRadius: 2, py: 1.2, fontWeight: 600, boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)' }}>
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

export default EvaluationCriteriaManagement;