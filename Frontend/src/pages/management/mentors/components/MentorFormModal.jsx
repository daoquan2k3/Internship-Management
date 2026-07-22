import {
  Modal,
  Box,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
  Paper
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';

const MentorFormModal = ({
  open,
  onClose,
  editingMentor,
  formData,
  setFormData,
  onSave
}) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose}
      closeAfterTransition
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backdropFilter: 'blur(3px)' 
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ 
              width: '100%', 
              maxWidth: '550px', 
              outline: 'none', 
              padding: '16px' 
            }}
          >
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              
              <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: "background.paper", borderBottom: '1px solid #eee' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.light" }}>
                  {editingMentor ? "Cập nhật Cố vấn" : "Thêm mới Cố vấn"}
                </Typography>
                <IconButton onClick={onClose} sx={{ bgcolor: "background.default", '&:hover': { bgcolor: '#e0e0e0' } }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ p: 4, bgcolor: "background.paper", overflowY: 'auto' }}>
                <Stack spacing={3}>
                  
                  {!editingMentor && (
                    <TextField
                      fullWidth
                      label="User ID"
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      disabled={!!editingMentor}
                    />
                  )}

                  {editingMentor && (
                    <>
                      <TextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      />
                    </>
                  )}

                  <TextField
                    fullWidth
                    label="Phòng ban"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="Học hàm/Học vị"
                    value={formData.academicRank}
                    onChange={(e) => setFormData({ ...formData, academicRank: e.target.value })}
                  />
                  
                </Stack>
              </Box>

              <Box sx={{ p: 3, borderTop: '1px solid #eee', display: 'flex', gap: 2, bgcolor: "background.paper" }}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="inherit" 
                  onClick={onClose}
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  Hủy
                </Button>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={onSave}
                  sx={{ borderRadius: 2, py: 1.5, boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}
                >
                  Lưu
                </Button>
              </Box>

            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default MentorFormModal;
