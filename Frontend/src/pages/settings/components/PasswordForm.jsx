import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff, LockReset } from "@mui/icons-material";
import { motion } from "framer-motion";

export const PasswordForm = ({
  regPassword,
  passwordErrors,
  handlePasswordSubmit,
  onChangePassword,
  isLoading,
  watch,
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
          Bảo Mật Tài Khoản
        </Typography>
      </Box>
      <Box component="form" onSubmit={handlePasswordSubmit(onChangePassword)}>
        <Stack spacing={3}>
          <FormControl fullWidth variant="outlined" error={!!passwordErrors.oldPassword}>
            <InputLabel>Mật khẩu hiện tại</InputLabel>
            <OutlinedInput
              type={showOldPassword ? "text" : "password"}
              {...regPassword("oldPassword", { required: "Bắt buộc" })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mật khẩu hiện tại"
              sx={{ borderRadius: 3, bgcolor: "background.paper" }}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" error={!!passwordErrors.newPassword}>
            <InputLabel>Mật khẩu mới</InputLabel>
            <OutlinedInput
              type={showNewPassword ? "text" : "password"}
              {...regPassword("newPassword", { required: "Bắt buộc" })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mật khẩu mới"
              sx={{ borderRadius: 3, bgcolor: "background.paper" }}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" error={!!passwordErrors.confirmPassword}>
            <InputLabel>Xác nhận mật khẩu</InputLabel>
            <OutlinedInput
              type={showConfirmPassword ? "text" : "password"}
              {...regPassword("confirmPassword", {
                validate: (val) => val === watch("newPassword") || "Mật khẩu không khớp",
              })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Xác nhận mật khẩu"
              sx={{ borderRadius: 3, bgcolor: "background.paper" }}
            />
            {passwordErrors.confirmPassword && (
              <FormHelperText error>{passwordErrors.confirmPassword.message}</FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={isLoading}
            startIcon={<LockReset />}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              boxShadow: "0 8px 16px rgba(239,68,68,0.2)",
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Cập Nhật Mật Khẩu"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
