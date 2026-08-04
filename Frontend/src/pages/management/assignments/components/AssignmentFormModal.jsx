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
  onSave,
  mentors = [],
  students = []
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
                    options={students}
                    getOptionLabel={(option) => `${option.fullName || option.name} - ${option.studentCode || option.id}`}
                    value={students.filter(student => formData.studentIds.includes(student.id || student.studentId))}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, studentIds: newValue.map(item => item.id || item.studentId) });
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={index}
                          variant="filled"
                          color="primary"
                          label={`${option.fullName || option.name}`}
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
                        placeholder="Chọn sinh viên..."
                        helperText="Chọn các sinh viên muốn thêm vào nhóm"
                      />
                    )}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={mentors}
                        getOptionLabel={(option) => `${option.fullName || option.name} (Mentor ID: ${option.id || option.mentorId})`}
                        value={mentors.find(mentor => (mentor.id || mentor.mentorId) === formData.mentorId) || null}
                        onChange={(event, newValue) => {
                          setFormData({ ...formData, mentorId: newValue ? (newValue.id || newValue.mentorId) : "" });
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Chọn Mentor" variant="outlined" fullWidth />
                        )}
                      />
                    </Grid>
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
