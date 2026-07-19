import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/authApi";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // State quản lý ẩn/hiện mật khẩu
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Chặn hành vi copy/paste
  const preventCopyPaste = (e) => {
    e.preventDefault();
  };

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Liên kết xác thực không hợp lệ hoặc bị thiếu!");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        token: token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      await authApi.resetPassword(payload);

      toast.success("Mật khẩu của bạn đã được cập nhật thành công!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Phiên xác thực đã hết hạn. Vui lòng yêu cầu lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* CỘT TRÁI: ẢNH NỀN MINIMALIST */}
      <Box
        sx={{
          flex: 1.2,
          display: { xs: "none", lg: "block" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1493106819501-66d381c466f1?q=80&w=1200&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(37, 99, 235, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: 8,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "#fff",
                fontWeight: 800,
                mb: 2,
                letterSpacing: "-1px",
              }}
            >
              Giai đoạn cuối cùng.
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#cbd5e1", fontWeight: 400, maxWidth: "500px" }}
            >
              Thiết lập thôngত্তি bảo mật mới để tiếp tục quy trình làm việc của
              bạn.
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* CỘT PHẢI: FORM */}
      <Box
        component={motion.div}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6, md: 8 },
        }}
      >
        <Box
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          sx={{ width: "100%", maxWidth: "400px" }}
        >
          <motion.div variants={fadeUpVariant}>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 1.5,
                color: "#0f172a",
                letterSpacing: "-1px",
              }}
            >
              Thiết lập mật khẩu.
            </Typography>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", mb: 4, fontSize: "1.1rem" }}
            >
              Vui lòng tạo một mật khẩu mạnh và không chia sẻ với bất kỳ ai.
            </Typography>
          </motion.div>

          <Box
            component={motion.form}
            variants={fadeUpVariant}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Stack spacing={3}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.newPassword}
              >
                <InputLabel htmlFor="outlined-adornment-new-password">
                  Mật khẩu mới
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-new-password"
                  type={showNewPassword ? "text" : "password"}
                  onCopy={preventCopyPaste}
                  onPaste={preventCopyPaste}
                  onCut={preventCopyPaste}
                  {...register("newPassword", {
                    required: "Vui lòng nhập mật khẩu",
                    pattern: {
                      value:
                        /^(|(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,})$/,
                      message:
                        "Bao gồm ít nhất 8 ký tự: chữ hoa, chữ thường, số & ký tự đặc biệt.",
                    },
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        sx={{ color: "#64748b" }}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Mật khẩu mới"
                  sx={{ borderRadius: "12px" }}
                />
                {errors.newPassword && (
                  <FormHelperText error>
                    {errors.newPassword?.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.confirmPassword}
              >
                <InputLabel htmlFor="outlined-adornment-confirm-password">
                  Xác nhận mật khẩu mới
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  onCopy={preventCopyPaste}
                  onPaste={preventCopyPaste}
                  onCut={preventCopyPaste}
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (val) =>
                      val === watch("newPassword") ||
                      "Mật khẩu xác nhận không khớp!",
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        sx={{ color: "#64748b" }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Xác nhận mật khẩu mới"
                  sx={{ borderRadius: "12px" }}
                />
                {errors.confirmPassword && (
                  <FormHelperText error>
                    {errors.confirmPassword?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              disableElevation
              sx={{
                mt: 4,
                mb: 3,
                py: 2,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "12px",
                bgcolor: "#2563eb",
                color: "#fff",
                textTransform: "none",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Xác nhận cập nhật"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
