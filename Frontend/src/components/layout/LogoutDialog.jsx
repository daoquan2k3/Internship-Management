import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { WarningRounded as WarningIcon } from "@mui/icons-material";

export const LogoutDialog = ({
  open,
  handleClose,
  confirmLogout,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: "24px 16px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          minWidth: { xs: "320px", sm: "400px" },
          textAlign: "center",
        },
      }}
    >
      <DialogContent sx={{ pb: 1 }}>
        <Box
          sx={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 24px",
            boxShadow: "0 0 0 8px rgba(239, 68, 68, 0.05)",
          }}
        >
          <WarningIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "text.primary", mb: 1.5 }}
        >
          Xác nhận đăng xuất
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
          Bạn có chắc chắn muốn thoát khỏi phiên làm việc hiện tại không?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: "12px",
            px: 4,
            py: 1.2,
            color: "text.secondary",
            borderColor: "divider",
            fontWeight: 700,
            "&:hover": { backgroundColor: "action.hover", borderColor: "text.primary" },
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={confirmLogout}
          variant="contained"
          sx={{
            borderRadius: "12px",
            px: 4,
            py: 1.2,
            fontWeight: 700,
            background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
            boxShadow: "0 8px 16px rgba(225, 29, 72, 0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
              boxShadow: "0 8px 20px rgba(225, 29, 72, 0.4)",
            },
          }}
        >
          Đăng xuất
        </Button>
      </DialogActions>
    </Dialog>
  );
};
