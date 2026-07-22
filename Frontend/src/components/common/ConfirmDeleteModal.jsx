import { Modal, Paper, Stack, Typography, Button, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ width: '100%', maxWidth: '400px', outline: 'none', padding: '16px' }}
          >
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', p: 3, bgcolor: "background.paper" }}>
              <Stack alignItems="center" spacing={2} sx={{ textAlignment: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'error.lighter', width: 64, height: 64, color: 'error.main', mb: 1 }}>
                  <WarningAmberRoundedIcon sx={{ fontSize: 36 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.light" }}>
                  {title || "Xác nhận xóa?"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {message || "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác."}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button fullWidth variant="outlined" color="inherit" onClick={onClose} sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}>
                  Hủy bỏ
                </Button>
                <Button fullWidth variant="contained" color="error" onClick={onConfirm} sx={{ borderRadius: 2, py: 1.2, fontWeight: 600, boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)' }}>
                  Xóa ngay
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default ConfirmDeleteModal;
