import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Stack,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
  Grid
} from "@mui/material";
import { Add as AddIcon, Business as BusinessIcon, Email as EmailIcon, LocationOn as LocationOnIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { universityApi } from "../../../api/universityApi";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";

const UniversityCard = ({ university, index, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ scale: 1.02, y: -5 }}
    style={{ height: "100%" }}
  >
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        position: "relative", 
        overflow: "hidden", 
        border: "1px solid rgba(255,255,255,0.08)", 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease"
      }}
    >
      <Box sx={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, rgba(26, 35, 126, 0.1) 0%, rgba(0,0,0,0) 100%)", zIndex: 0 }} />
      
      <Stack direction="row" spacing={2} alignItems="center" sx={{ position: "relative", zIndex: 1, mb: 3 }}>
        <Avatar sx={{ width: 60, height: 60, bgcolor: "primary.main", color: "white", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
          <BusinessIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: "text.primary" }}>{university.name}</Typography>
          <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600, mt: 0.5 }}>ID: #{university.universityId}</Typography>
        </Box>
      </Stack>
      
      <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.05)" }} />
      
      <Stack spacing={2} sx={{ position: "relative", zIndex: 1, flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <LocationOnIcon sx={{ color: "text.secondary", fontSize: 20, mt: 0.2 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
            {university.address || "Chưa cập nhật địa chỉ"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
            {university.contactEmail || "Chưa có email liên hệ"}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 1, mt: 3, pt: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Button
          startIcon={<EditIcon />}
          size="small"
          color="primary"
          onClick={() => onEdit(university)}
          sx={{ borderRadius: 2 }}
        >
          Chỉnh sửa
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(university)}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  </motion.div>
);

const UniversitiesManagement = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", contactEmail: "" });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await universityApi.getAllUniversities(1, 100, search);
      setUniversities(res?.content || []);
    } catch (error) {
      toast.error("Không thể tải danh sách trường học.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address) {
      toast.warning("Vui lòng điền các trường bắt buộc.");
      return;
    }
    setSubmitting(true);
    try {
      if (editingUniversity) {
        await universityApi.updateUniversity(editingUniversity.universityId, formData);
        toast.success("Cập nhật trường học thành công!");
      } else {
        await universityApi.createUniversity(formData);
        toast.success("Tạo trường học thành công!");
      }
      setOpenDialog(false);
      setEditingUniversity(null);
      setFormData({ name: "", address: "", contactEmail: "" });
      fetchUniversities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xử lý trường học.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (u) => {
    setEditingUniversity(u);
    setFormData({
      name: u.name || "",
      address: u.address || "",
      contactEmail: u.contactEmail || ""
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (!submitting) {
      setOpenDialog(false);
      setEditingUniversity(null);
      setFormData({ name: "", address: "", contactEmail: "" });
    }
  };

  const handleOpenDeleteModal = (u) => {
    setUniversityToDelete(u);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUniversityToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!universityToDelete) return;
    try {
      setLoading(true);
      await universityApi.deleteUniversity(universityToDelete.universityId);
      toast.success("Xóa trường học thành công!");
      handleCloseDeleteModal();
      fetchUniversities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa trường học.");
      console.error("Lỗi khi xóa trường học:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* HEADER SECTION */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: "-0.5px" }}>
            Quản lý Trường Đại Học
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Danh sách đối tác trường đại học và thông tin liên hệ
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<AddIcon />} 
          onClick={() => setOpenDialog(true)}
          sx={{ 
            borderRadius: "50px", 
            px: 4, 
            py: 1.5, 
            boxShadow: "0 8px 20px rgba(26, 35, 126, 0.25)",
            textTransform: "none",
            fontWeight: "bold",
            transition: "all 0.3s",
            "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 25px rgba(26, 35, 126, 0.35)" }
          }}
        >
          Thêm Trường mới
        </Button>
      </Box>

      {/* THANH TÌM KIẾM */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <TextField
          fullWidth variant="outlined" placeholder="Tìm kiếm trường học theo tên..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          size="small" sx={{ "& fieldset": { border: "none" }, bgcolor: "background.paper", borderRadius: 2 }}
        />
      </Paper>

      {/* CONTENT SECTION */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress size={50} thickness={4} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {universities.map((u, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={u.universityId}>
                <UniversityCard university={u} index={index} onEdit={handleEdit} onDelete={handleOpenDeleteModal} />
              </Grid>
            ))}
            {universities.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 5, textAlign: "center", borderRadius: 4, bgcolor: "background.paper", border: "1px dashed rgba(255,255,255,0.2)" }}>
                  <BusinessIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">Chưa có dữ liệu trường đại học nào</Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>Hãy thêm một trường mới hoặc thử từ khóa tìm kiếm khác.</Typography>
                </Paper>
              </Grid>
            )}
          </AnimatePresence>
        </Grid>
      )}

      {/* CREATE / UPDATE DIALOG */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, backgroundImage: "none", bgcolor: "background.paper", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.light" }}>
            {editingUniversity ? "Cập nhật Trường Học" : "Thêm Trường Học Mới"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Vui lòng nhập đầy đủ thông tin đối tác trường học vào hệ thống.
          </Typography>
          <Stack spacing={3}>
            <TextField 
              label="Tên trường đại học (*)" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Địa chỉ chi tiết (*)" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Email liên hệ (nếu có)" 
              name="contactEmail" 
              value={formData.contactEmail} 
              onChange={handleChange} 
              fullWidth 
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            disabled={submitting}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Hủy bỏ
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={submitting}
            sx={{ borderRadius: 2, px: 4, boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)" }}
          >
            {submitting ? "Đang xử lý..." : (editingUniversity ? "Cập nhật" : "Lưu thông tin")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ALERT MODAL XÁC NHẬN XÓA */}
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa trường học?"
        content={
          <>
            Bạn có chắc chắn muốn xóa trường đại học <strong>{universityToDelete?.name || "này"}</strong>? Hành động này không thể hoàn tác.
          </>
        }
      />
    </Box>
  );
};

export default UniversitiesManagement;
