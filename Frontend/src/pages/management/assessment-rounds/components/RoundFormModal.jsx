import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Autocomplete
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';

const RoundFormModal = ({
  open,
  onClose,
  editingRound,
  formData,
  setFormData,
  onSave,
  teacherClasses,
  user
}) => {
  const isTeacher = user?.role === "TEACHER" || user?.role === "ROLE_TEACHER";
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 30 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ width: '100%', maxWidth: '600px', outline: 'none', padding: '16px' }}
          >
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
              <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: "background.paper" }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.light" }}>{editingRound ? "Cập nhật Vòng Đánh giá" : "Tạo Vòng Đánh giá mới"}</Typography>
                <IconButton onClick={onClose} sx={{ bgcolor: "background.default", '&:hover': { bgcolor: '#e0e0e0' } }}><CloseIcon /></IconButton>
              </Box>

              <Divider />

              <Box sx={{ p: 4, bgcolor: "background.paper", overflowY: 'auto' }}>
                <Stack spacing={3}>
                  <TextField fullWidth label="Tên vòng đánh giá" value={formData.roundName} onChange={(e) => setFormData({ ...formData, roundName: e.target.value })} />
                  <TextField fullWidth label="Mô tả chi tiết" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} multiline rows={2} />

                  <Stack direction="row" spacing={2}>
                    <TextField fullWidth label="Ngày bắt đầu" type={formData.startDate ? "date" : "text"} value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => { if (!formData.startDate) e.target.type = "text"; }} />
                    <TextField fullWidth label="Ngày kết thúc" type={formData.endDate ? "date" : "text"} value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => { if (!formData.endDate) e.target.type = "text"; }} />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <TextField fullWidth label="Mã giai đoạn (Phase ID)" value={formData.phaseId} onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })} />
                    {isTeacher && (
                      <Autocomplete
                        fullWidth
                        options={teacherClasses || []}
                        getOptionLabel={(option) => option.className || `Class ID: ${option.classId}`}
                        isOptionEqualToValue={(option, value) => option.classId === value?.classId || option.classId === value}
                        value={(teacherClasses || []).find(c => c.classId === formData.classId) || null}
                        onChange={(event, newValue) => {
                          setFormData({ ...formData, classId: newValue ? newValue.classId : "" });
                        }}
                        renderInput={(params) => <TextField {...params} label="Lớp học phụ trách" />}
                      />
                    )}
                  </Stack>

                  {/* Switch Trạng thái */}
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>Trạng thái hoạt động</Typography>
                    <FormControlLabel
                      control={<Switch checked={!formData.isDeleted} onChange={(e) => setFormData({ ...formData, isDeleted: !e.target.checked })} color="primary" />}
                      label={<Typography variant="body2" sx={{ fontWeight: "bold", color: !formData.isDeleted ? "#2e7d32" : "#d32f2f" }}>{!formData.isDeleted ? "Hoạt động" : "Khóa"}</Typography>}
                      labelPlacement="start" sx={{ m: 0 }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ p: 3, pt: 0, display: 'flex', gap: 2, bgcolor: "background.paper", borderTop: '1px solid #eee', mt: 2 }}>
                <Button fullWidth variant="outlined" color="inherit" onClick={onClose} sx={{ borderRadius: 2, py: 1.5 }}>Hủy bỏ</Button>
                <Button fullWidth variant="contained" onClick={onSave} sx={{ borderRadius: 2, py: 1.5, boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}>Lưu thông tin</Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default RoundFormModal;
