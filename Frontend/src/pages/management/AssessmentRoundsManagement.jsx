import { useState, useEffect, useContext } from "react";
import { assessmentRoundsApi, evaluationCriteriaApi } from "../../api/resourceApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Button, TextField, FormControlLabel, Switch, Autocomplete,
  Typography, Stack, Paper, Divider, Modal, IconButton, Chip, Avatar
} from "@mui/material";

// Import Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddTaskIcon from '@mui/icons-material/AddTask';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SubtitlesIcon from '@mui/icons-material/Subtitles';

const AssessmentRoundsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  // State Modal Form
  const [openModal, setOpenModal] = useState(false);
  const [editingRound, setEditingRound] = useState(null);

  // State Modal Xóa
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [roundToDelete, setRoundToDelete] = useState(null);

  const [allCriteria, setAllCriteria] = useState([]);
  const [formData, setFormData] = useState({
    roundName: "",
    description: "",
    startDate: "",
    endDate: "",
    phaseId: "",
    isDeleted: false,
    roundCriteria: []
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  useEffect(() => {
    fetchAllCriteria();
    fetchRounds();
  }, [page, rowsPerPage, search]);

  const fetchAllCriteria = async () => {
    try {
      const res = await evaluationCriteriaApi.getAllCriteria();
      setAllCriteria(res?.content || []);
    } catch (err) {
      console.error("Failed to fetch criteria", err);
    }
  };

  const fetchRounds = async () => {
    try {
      setLoading(true);
      const response = await assessmentRoundsApi.getAllRounds(search, null, page, rowsPerPage);
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error loading assessment rounds:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (round = null) => {
    if (round) {
      const formatToISO = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) return dateStr;
        if (dateStr.includes("/")) {
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };
      setEditingRound(round);
      setFormData({
        roundName: round.roundName || "",
        description: round.description || "",
        startDate: formatToISO(round.startDate) || "",
        endDate: formatToISO(round.endDate) || "",
        phaseId: round.phaseId || "",
        isDeleted: round.isDeleted || false,
        roundCriteria: round.roundCriteria ? round.roundCriteria.map(rc => ({
          criterionId: rc.criterionId,
          criterionName: rc.criterionName,
          weight: rc.weight,
          maxScore: rc.maxScore
        })) : []
      });
    } else {
      setEditingRound(null);
      setFormData({
        roundName: "",
        description: "",
        startDate: "",
        endDate: "",
        phaseId: "",
        isDeleted: false,
        roundCriteria: []
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingRound(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        roundCriteria: formData.roundCriteria.map(c => ({
          criterionId: c.criterionId,
          weight: parseFloat(c.weight) || 0,
          maxScore: c.maxScore
        }))
      };
      if (editingRound) {
        await assessmentRoundsApi.updateRound(editingRound.id, payload);
        toast.success("Cập nhật vòng đánh giá thành công!");
      } else {
        await assessmentRoundsApi.createRound(payload);
        toast.success("Tạo vòng đánh giá thành công!");
      }
      handleCloseModal();
      fetchRounds();
    } catch (err) {
      console.error("Error saving assessment round:", err);
      toast.error("Có lỗi xảy ra khi lưu!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (round) => {
    setRoundToDelete(round);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setRoundToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!roundToDelete) return;
    try {
      setLoading(true);
      await assessmentRoundsApi.deleteRound(roundToDelete.id);
      toast.success("Xóa vòng đánh giá thành công!");
      handleCloseDeleteModal();
      fetchRounds();
    } catch (err) {
      console.error("Error deleting assessment round:", err);
      toast.error("Có lỗi khi xóa vòng đánh giá!");
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
            Quản lý Vòng Đánh giá
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Thiết lập các vòng đánh giá và phân bổ tiêu chí
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained" size="large" startIcon={<AddTaskIcon />} onClick={() => handleOpenModal()}
            sx={{ borderRadius: '50px', px: 4, py: 1.5, boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)' } }}
          >
            Thêm mới
          </Button>
        )}
      </Box>

      {/* --- THANH TÌM KIẾM --- */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField
          fullWidth variant="outlined" placeholder="Tìm kiếm vòng đánh giá..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small" sx={{ '& fieldset': { border: 'none' }, bgcolor: '#f8f9fa', borderRadius: 2 }}
        />
      </Paper>

      {/* --- DANH SÁCH THẺ 3D --- */}
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
          {data.map((round, index) => (
            <motion.div
              key={round.id || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Paper
                sx={{
                  p: 3, borderRadius: 4, position: "relative", overflow: "hidden",
                  background: 'linear-gradient(145deg, #ffffff, #fcfcfc)',
                  boxShadow: '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
                  border: '1px solid rgba(0,0,0,0.04)', height: '100%', display: 'flex', flexDirection: 'column'
                }}
              >
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255, 152, 0, 0.05)', zIndex: 0 }} />

                {/* Header Thẻ */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#fff3e0', color: '#f57c00' }}>
                      <TrackChangesIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a237e', lineHeight: 1.2, mb: 0.5 }}>
                        {round.roundName || "Chưa có tên vòng"}
                      </Typography>
                      <Chip
                        label={round.isDeleted ? "Đã khóa" : "Hoạt động"}
                        size="small"
                        sx={{ fontWeight: 'bold', fontSize: '0.7rem', height: 22, bgcolor: round.isDeleted ? 'rgba(211, 47, 47, 0.1)' : 'rgba(46, 125, 50, 0.1)', color: round.isDeleted ? '#d32f2f' : '#2e7d32' }}
                      />
                    </Box>
                  </Box>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, position: 'relative', zIndex: 1, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {round.description || "Chưa có mô tả chi tiết."}
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 3, position: 'relative', zIndex: 1, bgcolor: '#f8f9fa', p: 2, borderRadius: 3 }}>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <SubtitlesIcon sx={{ color: '#757575', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Giai đoạn: <span style={{ fontWeight: 400, color: '#1976d2' }}>{round.phaseName || "N/A"}</span></Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <EventAvailableIcon sx={{ color: '#757575', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Thời gian: <span style={{ fontWeight: 400 }}>{round.startDate || "..."} đến {round.endDate || "..."}</span></Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 2, position: 'relative', zIndex: 1 }} />

                <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                  <Button startIcon={<VisibilityIcon />} size="small" variant="contained" color="info" onClick={() => navigate(`/admin/assessment-rounds/${round.id}`)} sx={{ borderRadius: 2, fontWeight: 600, boxShadow: 0 }}>
                    Chi tiết
                  </Button>

                  {isAdmin && (
                    <Box>
                      <IconButton size="small" color="primary" onClick={() => handleOpenModal(round)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleOpenDeleteModal(round)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* --- PAGINATION CHẠY TAY --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 6 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang trước</Button>
        <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
        <Button variant="outlined" disabled={data.length < rowsPerPage} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang sau</Button>
      </Box>

      {/* --- MODAL THÊM / SỬA CHUẨN FRAMER MOTION --- */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
        <AnimatePresence>
          {openModal && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 30 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ width: '100%', maxWidth: '600px', outline: 'none', padding: '16px' }}
            >
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a237e' }}>{editingRound ? "Cập nhật Vòng Đánh giá" : "Tạo Vòng Đánh giá mới"}</Typography>
                  <IconButton onClick={handleCloseModal} sx={{ bgcolor: '#f4f6f8', '&:hover': { bgcolor: '#e0e0e0' } }}><CloseIcon /></IconButton>
                </Box>

                <Divider />

                <Box sx={{ p: 4, bgcolor: '#fff', overflowY: 'auto' }}>
                  <Stack spacing={3}>
                    <TextField fullWidth label="Tên vòng đánh giá" value={formData.roundName} onChange={(e) => setFormData({ ...formData, roundName: e.target.value })} />
                    <TextField fullWidth label="Mô tả chi tiết" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} multiline rows={2} />

                    <Stack direction="row" spacing={2}>
                      <TextField fullWidth label="Ngày bắt đầu" type={formData.startDate ? "date" : "text"} value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => { if (!formData.startDate) e.target.type = "text"; }} />
                      <TextField fullWidth label="Ngày kết thúc" type={formData.endDate ? "date" : "text"} value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => { if (!formData.endDate) e.target.type = "text"; }} />
                    </Stack>

                    <TextField fullWidth label="Mã giai đoạn (Phase ID)" value={formData.phaseId} onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })} />

                    {/* Vùng Chọn Tiêu chí */}
                    <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#555", mb: 1 }}>Chọn Tiêu chí & Nhập Trọng số</Typography>
                      <Autocomplete
                        multiple options={allCriteria} getOptionLabel={(o) => o.criterionName} isOptionEqualToValue={(option, value) => option.criterionId === value.criterionId}
                        value={formData.roundCriteria}
                        onChange={(event, newValue) => {
                          const updated = newValue.map((item) => {
                            const currentId = item.id || item.criterionId;
                            const existing = formData.roundCriteria.find((old) => (old.id || old.criterionId) === currentId);
                            return { criterionId: currentId, criterionName: item.criterionName, maxScore: item.maxScore, weight: existing ? existing.weight : 0 };
                          });
                          setFormData({ ...formData, roundCriteria: updated });
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Tìm kiếm tiêu chí..." sx={{ bgcolor: 'white', borderRadius: 1 }} />}
                      />

                      {/* Hiển thị list input nhập trọng số đẹp mắt (Thay Table bằng Stack) */}
                      {formData.roundCriteria.length > 0 && (
                        <Stack spacing={1.5} sx={{ mt: 2 }}>
                          {formData.roundCriteria.map((item, index) => (
                            <Box key={item.criterionId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'white', p: 1.5, borderRadius: 2, border: '1px solid #eee' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, pr: 2 }}>{item.criterionName}</Typography>
                              <TextField
                                type="number" size="small" placeholder="Trọng số (%)" sx={{ width: 100 }} value={item.weight ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData(prev => {
                                    const nextCriteria = [...prev.roundCriteria];
                                    nextCriteria[index] = { ...nextCriteria[index], weight: val };
                                    return { ...prev, roundCriteria: nextCriteria };
                                  });
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Box>

                    {/* Switch Trạng thái */}
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
                  <Button fullWidth variant="outlined" color="inherit" onClick={handleCloseModal} sx={{ borderRadius: 2, py: 1.5 }}>Hủy bỏ</Button>
                  <Button fullWidth variant="contained" onClick={handleSave} sx={{ borderRadius: 2, py: 1.5, boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}>Lưu thông tin</Button>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      {/* --- ALERT MODAL XÁC NHẬN XÓA --- */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal} closeAfterTransition sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
        <AnimatePresence>
          {openDeleteModal && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{ width: '100%', maxWidth: '400px', outline: 'none', padding: '16px' }}
            >
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', p: 3, bgcolor: '#fff' }}>
                <Stack alignItems="center" spacing={2} sx={{ textAlignment: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'error.lighter', width: 64, height: 64, color: 'error.main', mb: 1 }}>
                    <WarningAmberRoundedIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a237e' }}>Xác nhận xóa?</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bạn có chắc chắn muốn xóa vòng đánh giá <strong>{roundToDelete?.roundName}</strong>? Hành động này không thể hoàn tác.
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button fullWidth variant="outlined" color="inherit" onClick={handleCloseDeleteModal} sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}>Hủy bỏ</Button>
                  <Button fullWidth variant="contained" color="error" onClick={handleConfirmDelete} sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}>Xóa ngay</Button>
                </Stack>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

    </Box>
  );
};

export default AssessmentRoundsManagement;