import { useState, useEffect, useContext } from "react";
import { internshipPhaseApi } from "../../../api/resourceApi";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Divider,
  IconButton,
  Chip
} from "@mui/material";

// Import Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

import PhaseFormModal from "./components/PhaseFormModal";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";

const InternshipPhasesManagement = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");

  // State Modal Thêm/Sửa
  const [openModal, setOpenModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);

  // State Modal Xóa
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState(null);

  const [formData, setFormData] = useState({
    phaseName: "",
    description: "",
    startDate: "",
    endDate: "",
    isDeleted: false,
  });

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  useEffect(() => {
    let isMounted = true;
    const fetchPhasesEffect = async () => {
      try {
        const response = await internshipPhaseApi.getAllPhases(search, page, rowsPerPage);
        if (isMounted) setData(response?.content || []);
      } catch (err) {
        console.error("Error fetching phases:", err);
      }
    };
    fetchPhasesEffect();
    return () => { isMounted = false; };
  }, [page, rowsPerPage, search]);

  const fetchPhases = async () => {
    try {
      const response = await internshipPhaseApi.getAllPhases(search, page, rowsPerPage);
      setData(response?.content || []);
    } catch (err) {
      console.error("Error fetching phases:", err);
    }
  };

  const handleOpenModal = (phase = null) => {
    if (phase) {
      setEditingPhase(phase);

      const formatToISO = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) return dateStr;
        if (dateStr.includes("/")) {
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };

      setFormData({
        phaseName: phase.phaseName || "",
        description: phase.description || "",
        startDate: formatToISO(phase.startDate),
        endDate: formatToISO(phase.endDate),
        isDeleted: phase.isDeleted || false,
      });
    } else {
      setEditingPhase(null);
      setFormData({
        phaseName: "",
        description: "",
        startDate: "",
        endDate: "",
        isDeleted: false,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPhase(null);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      if (!payload.startDate || payload.startDate.trim() === "") payload.startDate = null;
      if (!payload.endDate || payload.endDate.trim() === "") payload.endDate = null;

      if (editingPhase) {
        await internshipPhaseApi.updatePhase(editingPhase.id, payload);
        toast.success("Cập nhật kỳ thực tập thành công!");
      } else {
        await internshipPhaseApi.createPhase(payload);
        toast.success("Thêm kỳ thực tập thành công!");
      }
      handleCloseModal();
      fetchPhases();
    } catch (err) {
      console.error("Error saving phase:", err);
    }
  };

  // Logic Mở Modal Xóa
  const handleOpenDeleteModal = (phase) => {
    setPhaseToDelete(phase);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setPhaseToDelete(null);
  };

  // Thực hiện Xóa thật
  const handleConfirmDelete = async () => {
    if (!phaseToDelete) return;
    const targetId = phaseToDelete.phaseId || phaseToDelete.id;
    try {
      await internshipPhaseApi.deletePhase(targetId);
      toast.success("Xóa kỳ thực tập thành công!");
      handleCloseDeleteModal();
      fetchPhases();
    } catch (err) {
      console.error("Error deleting phase:", err);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: "background.default" }}>

      {/* --- HEADER CHÍNH --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: '-0.5px' }}>
            Quản lý Kỳ Thực tập
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Thiết lập và theo dõi các giai đoạn thực tập của sinh viên
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
          placeholder="Tìm kiếm kỳ thực tập..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small"
          sx={{ '& fieldset': { border: 'none' }, bgcolor: "background.paper", borderRadius: 2 }}
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
          {data.map((phase, index) => (
            <motion.div
              key={phase.id || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{ flex: '1 1 320px', maxWidth: '400px' }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Background Decoration */}
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(25, 118, 210, 0.04)', zIndex: 0 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#e3f2fd', color: '#1976d2' }}>
                      <BusinessCenterIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.light", lineHeight: 1.2, mb: 0.5 }}>
                        {phase.phaseName}
                      </Typography>
                      <Chip
                        label={phase.isDeleted ? "Đã khóa" : "Hoạt động"}
                        size="small"
                        sx={{
                          fontWeight: 'bold', fontSize: '0.7rem', height: 20,
                          bgcolor: phase.isDeleted ? 'rgba(211, 47, 47, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                          color: phase.isDeleted ? '#d32f2f' : '#2e7d32'
                        }}
                      />
                    </Box>
                  </Box>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, position: 'relative', zIndex: 1, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {phase.description || "Chưa có mô tả chi tiết."}
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 2, position: 'relative', zIndex: 1, bgcolor: "background.paper", p: 1, borderRadius: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary"}}>
                    ID: <span style={{ fontWeight: 400 }}>{phase.id || 'N/A'}</span>
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <CalendarMonthIcon sx={{ color: '#757575', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Bắt đầu: <span style={{ fontWeight: 400 }}>{phase.startDate || "Chưa xác định"}</span>
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <EventAvailableIcon sx={{ color: '#757575', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Kết thúc: <span style={{ fontWeight: 400 }}>{phase.endDate || "Chưa xác định"}</span>
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 2, position: 'relative', zIndex: 1 }} />

                {isAdmin && (
                  <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                    <Button startIcon={<EditIcon />} size="small" color="primary" onClick={() => handleOpenModal(phase)} sx={{ borderRadius: 2, fontWeight: 600 }}>
                      Chỉnh sửa
                    </Button>
                    <IconButton size="small" color="error" onClick={() => handleOpenDeleteModal(phase)}>
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

      {/* --- MODAL THÊM / SỬA CHUẨN FRAMER MOTION --- */}
      <PhaseFormModal
        open={openModal}
        onClose={handleCloseModal}
        editingPhase={editingPhase}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />

      {/* --- ALERT MODAL XÁC NHẬN XÓA --- */}
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa giai đoạn?"
        content={
          <>
            Bạn có chắc chắn muốn xóa kỳ thực tập <strong>{phaseToDelete?.phaseName}</strong>? Hành động này không thể hoàn tác.
          </>
        }
      />

    </Box>
  );
};

export default InternshipPhasesManagement;
