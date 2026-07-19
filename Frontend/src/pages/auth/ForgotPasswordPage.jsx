import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/authApi";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Gửi đúng object { email: "..." }
      await authApi.forgotPassword(data);

      toast.success(
        "Yêu cầu thành công! Vui lòng kiểm tra hộp thư đến của bạn.",
      );

      // Tự động chuyển về trang Login sau 3 giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Không thể gửi yêu cầu. Vui lòng kiểm tra lại email!",
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
      {/* CỘT TRÁI: FORM */}
      <Box
        component={motion.div}
        initial={{ x: -50, opacity: 0 }}
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
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/login")}
              disableRipple
              sx={{
                mb: 4,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "none",
                ml: -1,
                "&:hover": { bgcolor: "transparent", color: "#0f172a" },
              }}
            >
              Quay lại Đăng nhập
            </Button>
          </motion.div>

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
              Khôi phục quyền truy cập.
            </Typography>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", mb: 4, fontSize: "1.1rem" }}
            >
              Nhập địa chỉ email liên kết với tài khoản. Chúng tôi sẽ gửi một
              liên kết an toàn để bạn đặt lại mật khẩu.
            </Typography>
          </motion.div>

          <Box
            component={motion.form}
            variants={fadeUpVariant}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Địa chỉ Email"
                type="email"
                variant="outlined"
                autoFocus
                {...register("email", {
                  required: "Vui lòng cung cấp email của bạn",
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
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
                bgcolor: "#0f172a",
                color: "#fff",
                textTransform: "none",
                "&:hover": { bgcolor: "#334155" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Gửi liên kết khôi phục"
              )}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* CỘT PHẢI: ẢNH NỀN MINIMALIST */}
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
            backgroundImage: `url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)",
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
              Bảo mật tuyệt đối.
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#cbd5e1", fontWeight: 400, maxWidth: "500px" }}
            >
              Quy trình xác thực nghiêm ngặt đảm bảo an toàn cho dữ liệu thực
              tập và thông tin cá nhân của bạn.
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
