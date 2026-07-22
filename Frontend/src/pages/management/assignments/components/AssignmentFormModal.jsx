import {
  Modal,
  Box,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
  Paper,
  Grid,
  Autocomplete,
  Chip
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';

const AssignmentFormModal = ({
  open,
  onClose,
  editingAssignment,
  formData,
  setFormData,
  onSave
}) => {
  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} style={{ width: '100%', maxWidth: '600px', outline: 'none', padding: '16px' }}>
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{editingAssignment ? "Cập nhật Phân công" : "Tạo Phân công mới"}</Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
              </Box>
              <Box sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <TextField fullWidth label="Tên Đề tài / Công việc" value={formData.assignmentTitle} onChange={(e) => setFormData({ ...formData, assignmentTitle: e.target.value })} />
                  <TextField fullWidth label="Mô tả chi tiết" multiline rows={3} value={formData.assignmentDescription} onChange={(e) => setFormData({ ...formData, assignmentDescription: e.target.value })} />

                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]} // Do chưa gọi API lấy toàn bộ list sinh viên nên tạm để rỗng, dùng freeSolo để nhập thủ công
                    value={formData.studentIds.map(String)} // Ép kiểu về String để hiển thị
                    onChange={(event, newValue) => {
                      // newValue là mảng các chuỗi. Ta loại bỏ các chữ cái, chỉ giữ số ID hợp lệ
                      const numericIds = newValue
                        .map((val) => parseInt(val, 10))
                        .filter((val) => !isNaN(val));
                      setFormData({ ...formData, studentIds: numericIds });
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={index}
                          variant="filled"
                          color="primary"
                          label={`ID: ${option}`}
                          {...getTagProps({ index })}
                          sx={{ fontWeight: 600, borderRadius: 2 }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Thêm thành viên nhóm"
                        placeholder="Nhập ID Sinh viên..."
                        helperText="Gõ ID sinh viên và ấn Enter để thêm người vào nhóm"
                      />
                    )}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={6}><TextField fullWidth label="ID Mentor" value={formData.mentorId} onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })} /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="ID Giai đoạn" value={formData.phaseId} onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })} /></Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Hạn chót (Deadline)"
                        type={formData.dueDate ? "date" : "text"}
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => { if (!formData.dueDate) e.target.type = "text"; }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: "text.secondary" }}>
                    Trạng thái công việc
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {[
                      { value: 'PENDING', label: 'Chờ duyệt', color: '#f56e00' },
                      { value: 'IN_PROGRESS', label: 'Đang làm', color: "primary.main" },
                      { value: 'COMPLETED', label: 'Hoàn thành', color: '#2e7d32' },
                      { value: 'CANCELLED', label: 'Đã hủy', color: '#f70b0b' }
                    ].map((item) => (
                      <Box
                        key={item.value}
                        onClick={() => setFormData({ ...formData, status: item.value })}
                        sx={{
                          flex: 1, p: 1.5, borderRadius: 3, cursor: 'pointer', textAlign: 'center',
                          border: '2px solid',
                          borderColor: formData.status === item.value ? item.color : '#f1f5f9',
                          bgcolor: formData.status === item.value ? `${item.color}10` : '#fff',
                          transition: '0.2s',
                          '&:hover': { transform: 'translateY(-3px)' }
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: formData.status === item.value ? item.color : '#94a3b8' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 3, bgcolor: "background.default", display: 'flex', gap: 2 }}>
                <Button fullWidth variant="outlined" onClick={onClose} sx={{ py: 1.5 }}>Hủy</Button>
                <Button fullWidth variant="contained" onClick={onSave} sx={{ py: 1.5 }}>Lưu Nhóm</Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default AssignmentFormModal;
