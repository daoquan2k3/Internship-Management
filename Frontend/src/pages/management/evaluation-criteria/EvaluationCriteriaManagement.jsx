import { useState, useEffect, useContext } from "react";
import { evaluationCriteriaApi } from "../../../api/resourceApi";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Button, TextField, Typography,
  Stack, Paper, Divider, IconButton, Chip
} from "@mui/material";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";
import CriteriaFormModal from "./components/CriteriaFormModal";

// Import Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';
import RuleIcon from '@mui/icons-material/Rule';
import GradeIcon from '@mui/icons-material/Grade';

// ==========================================
// THÀNH PHẦN PHỤ: Thẻ Tiêu chí (Criteria Card)
// ==========================================
const CriteriaCard = ({ criteria, isAdmin, onEdit, onDelete, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ scale: 1.03, y: -5 }}
    style={{ width: "100%", height: "100%" }}
  >
    <Paper sx={{ p: 3, borderRadius: 4, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", minHeight: 320 }}>
      {/* Background Decoration */}
      <Box sx={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(0, 150, 136, 0.05)", zIndex: 0 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: "relative", zIndex: 1, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "#e0f2f1", color: "#00897b" }}>
            <RuleIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.light", lineHeight: 1.2, mb: 0.5 }}>
              {criteria.criterionName || "Chưa có tên"}
            </Typography>
            <Chip
              label={criteria.isDeleted ? "Đã khóa" : "Hoạt động"}
              size="small"
              sx={{
                fontWeight: "bold", fontSize: "0.7rem", height: 22,
                bgcolor: criteria.isDeleted ? "rgba(211,47,47,0.1)" : "rgba(46,125,50,0.1)",
                color: criteria.isDeleted ? "#d32f2f" : "#2e7d32",
              }}
            />
          </Box>
        </Box>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 3, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 60 }}>
        {criteria.description || "Chưa có mô tả cho tiêu chí này."}
      </Typography>

      <Box sx={{ mb: 3, bgcolor: "rgba(255, 152, 0, 0.1)", p: 1.5, borderRadius: 3, border: "1px dashed rgba(255, 152, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <GradeIcon sx={{ color: "#f57f17", fontSize: 24 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>Điểm tối đa:</Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "warning.main" }}>{criteria.maxScore || "0"}</Typography>
      </Box>

      {isAdmin && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" justifyContent="space-between">
            <Button startIcon={<EditIcon />} size="small" color="primary" onClick={() => onEdit(criteria)} sx={{ borderRadius: 2, fontWeight: 600 }}>
              Chỉnh sửa
            </Button>
            <IconButton size="small" color="error" onClick={() => onDelete(criteria)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </>
      )}
    </Paper>
  </motion.div>
);

// ==========================================
// COMPONENT CHÍNH
// ==========================================
const EvaluationCriteriaManagement = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState(null);

  const [formData, setFormData] = useState({
    criterionName: "", description: "", maxScore: "", isDeleted: false,
  });

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  useEffect(() => {
    let isMounted = true;
    const fetchCriteriaEffect = async () => {
      try {
        const response = await evaluationCriteriaApi.getAllCriteria(search, page, rowsPerPage);
        if (isMounted) {
          setData(response?.content || []);
        }
      } catch (err) {
        console.error("Error loading criteria:", err);
      }
    };
    fetchCriteriaEffect();
    return () => {
      isMounted = false;
    };
  }, [page, search]);

  const fetchCriteria = async () => {
    try {
      const response = await evaluationCriteriaApi.getAllCriteria(search, page, rowsPerPage);
      setData(response?.content || []);
    } catch (err) {
      console.error("Error loading criteria:", err);
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
      setFormData({ criterionName: "", description: "", maxScore: "", isDeleted: false });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => { setOpenModal(false); setEditingCriteria(null); };

  const handleSave = async () => {
    try {
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
      console.error(err);
      toast.error("Có lỗi xảy ra khi lưu tiêu chí!");
    }
  };

  const handleConfirmDelete = async () => {
    if (!criteriaToDelete) return;
    try {
      await evaluationCriteriaApi.deleteCriteria(criteriaToDelete.id);
      toast.success("Xóa tiêu chí thành công!");
      setOpenDeleteModal(false);
      fetchCriteria();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi xóa tiêu chí!");
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: "background.default" }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: '-0.5px' }}>
            Quản lý Tiêu chí Đánh giá
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Thiết lập bộ khung tiêu chí và thang điểm cho đồ án
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" size="large" startIcon={<AddTaskIcon />} onClick={() => handleOpenModal()} sx={{ borderRadius: '50px', px: 4, py: 1.5, boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)' }}>
            Thêm mới
          </Button>
        )}
      </Box>

      {/* SEARCH BAR */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField fullWidth variant="outlined" placeholder="Tìm kiếm tiêu chí..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} size="small" sx={{ '& fieldset': { border: 'none' }, bgcolor: "background.paper", borderRadius: 2 }} />
      </Paper>

      {/* LIST OF CARDS */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 4, alignItems: "stretch" }}>
        <AnimatePresence>
          {data.map((criteria, index) => (
            <CriteriaCard key={criteria.id || index} criteria={criteria} isAdmin={isAdmin} onEdit={handleOpenModal} onDelete={(c) => { setCriteriaToDelete(c); setOpenDeleteModal(true); }} index={index} />
          ))}
        </AnimatePresence>
      </Box>

      {/* PAGINATION */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 6 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang trước</Button>
        <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
        <Button variant="outlined" disabled={data.length < rowsPerPage} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang sau</Button>
      </Box>

      {/* ADD/EDIT MODAL */}
      <CriteriaFormModal
        open={openModal}
        onClose={handleCloseModal}
        editingCriteria={editingCriteria}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa tiêu chí?"
        content={
          <>
            Bạn có chắc chắn muốn xóa tiêu chí <strong>{criteriaToDelete?.criterionName || "này"}</strong>? Hành động này không thể hoàn tác.
          </>
        }
      />
    </Box>
  );
};

export default EvaluationCriteriaManagement;
