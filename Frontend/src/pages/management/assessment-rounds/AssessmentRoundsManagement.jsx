import { useState, useEffect, useContext } from "react";
import { assessmentRoundsApi, evaluationCriteriaApi } from "../../../api/resourceApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Button, TextField, Typography, Stack, Paper, Divider, IconButton, Chip
} from "@mui/material";

// Import Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SubtitlesIcon from '@mui/icons-material/Subtitles';

import RoundFormModal from "./components/RoundFormModal";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";

const AssessmentRoundsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
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
    let isMounted = true;
    const fetchAllCriteria = async () => {
      try {
        const res = await evaluationCriteriaApi.getAllCriteria();
        if (isMounted) setAllCriteria(res?.content || []);
      } catch (err) {
        console.error("Failed to fetch criteria", err);
      }
    };
    fetchAllCriteria();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchRounds = async () => {
      try {
        setLoading(true);
        const response = await assessmentRoundsApi.getAllRounds(search, null, page, rowsPerPage);
        if (isMounted) {
          setData(response?.content || []);
          setTotalCount(response?.totalElements || 0);
        }
      } catch (err) {
        console.error("Error loading assessment rounds:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRounds();
    return () => { isMounted = false; };
  }, [page, rowsPerPage, search]);

  const fetchRoundsManual = async () => {
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
      fetchRoundsManual();
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
      fetchRoundsManual();
    } catch (err) {
      console.error("Error deleting assessment round:", err);
      toast.error("Có lỗi khi xóa vòng đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: "background.default" }}>

      {/* --- HEADER CHÍNH --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: '-0.5px' }}>
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
          size="small" sx={{ '& fieldset': { border: 'none' }, bgcolor: "background.paper", borderRadius: 2 }}
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
                   height: '100%', display: 'flex', flexDirection: 'column'
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
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.light", lineHeight: 1.2, mb: 0.5 }}>
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

                <Stack spacing={1.5} sx={{ mb: 3, position: 'relative', zIndex: 1, bgcolor: "background.paper", p: 2, borderRadius: 3 }}>
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
        <Button variant="outlined" disabled={data.length < rowsPerPage || loading || totalCount <= (page + 1) * rowsPerPage} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>Trang sau</Button>
      </Box>

      {/* --- MODAL THÊM / SỬA CHUẨN FRAMER MOTION --- */}
      <RoundFormModal
        open={openModal}
        onClose={handleCloseModal}
        editingRound={editingRound}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        allCriteria={allCriteria}
      />

      {/* --- ALERT MODAL XÁC NHẬN XÓA --- */}
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa?"
        content={
          <>
            Bạn có chắc chắn muốn xóa vòng đánh giá <strong>{roundToDelete?.roundName}</strong>? Hành động này không thể hoàn tác.
          </>
        }
      />

    </Box>
  );
};

export default AssessmentRoundsManagement;
