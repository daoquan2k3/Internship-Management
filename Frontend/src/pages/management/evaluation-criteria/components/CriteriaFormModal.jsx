import {
  Modal,
  Box,
  Typography,
  IconButton,
  Stack,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Divider
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';

const CriteriaFormModal = ({
  open,
  onClose,
  editingCriteria,
  formData,
  setFormData,
  onSave
}) => {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ scale: 0.8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 30 }} transition={{ type: "spring", stiffness: 350, damping: 25 }} style={{ width: '100%', maxWidth: '500px', outline: 'none', padding: '16px' }}>
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
              <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: "background.paper" }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.light" }}>{editingCriteria ? "Cập nhật Tiêu chí" : "Tạo Tiêu chí mới"}</Typography>
                <IconButton onClick={onClose} sx={{ bgcolor: "background.default" }}><CloseIcon /></IconButton>
              </Box>
              <Divider />
              <Box sx={{ p: 4, bgcolor: "background.paper", overflowY: 'auto' }}>
                <Stack spacing={3}>
                  <TextField fullWidth label="Tên tiêu chí (Criteria Name)" value={formData.criterionName} onChange={(e) => setFormData({ ...formData, criterionName: e.target.value })} />
                  <TextField fullWidth label="Mô tả chi tiết" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} multiline rows={3} />
                  <TextField fullWidth label="Điểm tối đa (Max Score)" type="number" value={formData.maxScore} onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })} />
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper", border: "1px solid rgba(0, 0, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>Trạng thái hoạt động</Typography>
                    <FormControlLabel control={<Switch checked={!formData.isDeleted} onChange={(e) => setFormData({ ...formData, isDeleted: !e.target.checked })} color="primary" />} label={<Typography variant="body2" sx={{ fontWeight: "bold", color: !formData.isDeleted ? "#2e7d32" : "#d32f2f" }}>{!formData.isDeleted ? "Hoạt động" : "Khóa"}</Typography>} labelPlacement="start" sx={{ m: 0 }} />
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ p: 3, pt: 0, display: 'flex', gap: 2, bgcolor: "background.paper", borderTop: '1px solid rgba(0, 0, 0, 0.1)', mt: 2 }}>
                <Button fullWidth variant="outlined" color="inherit" onClick={onClose} sx={{ borderRadius: 2, py: 1.5, mt: 2 }}>Hủy bỏ</Button>
                <Button fullWidth variant="contained" onClick={onSave} sx={{ borderRadius: 2, py: 1.5, mt: 2, boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}>Lưu thông tin</Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default CriteriaFormModal;
