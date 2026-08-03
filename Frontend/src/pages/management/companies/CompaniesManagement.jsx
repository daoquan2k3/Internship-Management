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
  Grid,
  Tooltip
} from "@mui/material";
import { 
  Add as AddIcon, 
  Business as BusinessIcon, 
  Email as EmailIcon, 
  LocationOn as LocationOnIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Verified as VerifiedIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import companyApi from "../../../api/companyApi";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";

const CompanyCard = ({ company, index, onEdit, onDelete }) => (
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: "text.primary" }}>
              {company.companyName}
            </Typography>
            {company.verified && (
              <Tooltip title="Đối tác uy tín được xác thực bởi Admin">
                <VerifiedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
              </Tooltip>
            )}
          </Box>
          <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600, mt: 0.5 }}>Mã: {company.companyCode}</Typography>
        </Box>
      </Stack>
      
      <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.05)" }} />
      
      <Stack spacing={2} sx={{ position: "relative", zIndex: 1, flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <LocationOnIcon sx={{ color: "text.secondary", fontSize: 20, mt: 0.2 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
            {company.address || "Chưa cập nhật địa chỉ"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
            {company.email || "Chưa có email liên hệ"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <PhoneIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
            {company.phoneNumber || "Chưa có SĐT"}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 1, mt: 3, pt: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Button
          startIcon={<EditIcon />}
          size="small"
          color="primary"
          onClick={() => onEdit(company)}
          sx={{ borderRadius: 2 }}
        >
          Chỉnh sửa
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(company)}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  </motion.div>
);

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ companyCode: "", companyName: "", address: "", email: "", phoneNumber: "" });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await companyApi.getAllCompanies({ page: 0, size: 100, search });
      setCompanies(res?.content || res?.data?.content || []);
    } catch (error) {
      toast.error("Không thể tải danh sách công ty.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.companyCode || !formData.companyName) {
      toast.warning("Vui lòng điền mã và tên công ty.");
      return;
    }
    setSubmitting(true);
    try {
      if (editingCompany) {
        await companyApi.updateCompany(editingCompany.companyId, formData);
        toast.success("Cập nhật công ty thành công!");
      } else {
        await companyApi.createCompany(formData);
        toast.success("Tạo công ty thành công! (Tự động cấp chứng nhận uy tín)");
      }
      setOpenDialog(false);
      setEditingCompany(null);
      setFormData({ companyCode: "", companyName: "", address: "", email: "", phoneNumber: "" });
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xử lý công ty.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (c) => {
    setEditingCompany(c);
    setFormData({
      companyCode: c.companyCode || "",
      companyName: c.companyName || "",
      address: c.address || "",
      email: c.email || "",
      phoneNumber: c.phoneNumber || ""
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (!submitting) {
      setOpenDialog(false);
      setEditingCompany(null);
      setFormData({ companyCode: "", companyName: "", address: "", email: "", phoneNumber: "" });
    }
  };

  const handleOpenDeleteModal = (c) => {
    setCompanyToDelete(c);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setCompanyToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    try {
      setLoading(true);
      await companyApi.deleteCompany(companyToDelete.companyId);
      toast.success("Xóa công ty thành công!");
      handleCloseDeleteModal();
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa công ty.");
      console.error("Lỗi khi xóa công ty:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "background.default" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: "-0.5px" }}>
            Quản lý Công Ty (Doanh nghiệp)
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Danh sách đối tác doanh nghiệp thực tập của sinh viên
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
          Thêm Công ty mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <TextField
          fullWidth variant="outlined" placeholder="Tìm kiếm công ty theo tên, mã hoặc email..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          size="small" sx={{ "& fieldset": { border: "none" }, bgcolor: "background.paper", borderRadius: 2 }}
        />
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress size={50} thickness={4} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {companies.length > 0 ? (
              companies.map((c, index) => (
                <Grid item xs={12} sm={6} lg={4} key={c.companyId}>
                  <CompanyCard company={c} index={index} onEdit={handleEdit} onDelete={handleOpenDeleteModal} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 5, textAlign: "center", borderRadius: 4, bgcolor: "background.paper" }}>
                  <Typography variant="h6" color="text.secondary">
                    Chưa có công ty nào hoặc không tìm thấy kết quả.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </AnimatePresence>
        </Grid>
      )}

      {/* Dialog Thêm/Sửa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "text.primary", pb: 1 }}>
          {editingCompany ? "Chỉnh sửa thông tin Công ty" : "Thêm Công ty mới"}
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: "none", borderTopColor: "rgba(255,255,255,0.05)" }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Mã công ty (*)"
              name="companyCode"
              value={formData.companyCode}
              onChange={handleChange}
              fullWidth
              disabled={!!editingCompany}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              label="Tên công ty (*)"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              label="Email liên hệ"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} color="inherit" disabled={submitting} sx={{ borderRadius: 2, px: 3 }}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting} sx={{ borderRadius: 2, px: 4, boxShadow: "0 4px 14px rgba(26, 35, 126, 0.4)" }}>
            {submitting ? <CircularProgress size={24} color="inherit" /> : "Lưu Thay Đổi"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xóa Công Ty"
        content={`Bạn có chắc chắn muốn xóa công ty "${companyToDelete?.companyName}" không? Thao tác này không thể hoàn tác.`}
        loading={loading}
      />
    </Box>
  );
};

export default CompaniesManagement;
