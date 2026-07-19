import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/authApi";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Select,      // Đã thêm
  MenuItem,    // Đã thêm
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});

  // State quản lý hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      role: "ROLE_STUDENT" // Thiết lập giá trị mặc định là Sinh viên
    }
  });

  // Chặn copy/paste
  const preventCopyPaste = (e) => {
    e.preventDefault();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setBackendErrors({});
    try {
      const { confirmPassword, ...registerData } = data;
      await authApi.register(registerData);
      setSuccessMsg("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.response?.data?.error) {
        const errObj = error.response.data.error;
        setBackendErrors(errObj);
        Object.keys(errObj).forEach((field) =>
          setError(field, { type: "manual", message: errObj[field] }),
        );
      } else {
        setBackendErrors({
          general: "Đăng ký thất bại. Vui lòng kiểm tra lại.",
        });
      }
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
      {/* CỘT TRÁI: FORM ĐĂNG KÝ */}
      <Box
        component={motion.div}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
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
          sx={{ width: "100%", maxWidth: "440px" }}
        >
          <motion.div variants={fadeUpVariant}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
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
              Trang chủ
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
              Tạo tài khoản.
            </Typography>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", mb: 4, fontSize: "1.1rem" }}
            >
              Đăng ký để bắt đầu quản lý thực tập dễ dàng hơn.
            </Typography>
          </motion.div>

          {successMsg && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {successMsg}
            </Alert>
          )}
          {backendErrors.general && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {backendErrors.general}
            </Alert>
          )}

          <Box
            component={motion.form}
            variants={fadeUpVariant}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Họ và tên"
                variant="outlined"
                {...register("fullName", { required: "Nhập họ tên" })}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Tên đăng nhập"
                variant="outlined"
                {...register("username", { required: "Nhập tên đăng nhập" })}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                {...register("email", { required: "Nhập Email" })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                variant="outlined"
                {...register("phoneNumber", { required: "Nhập SĐT" })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />

              {/* KHỐI CHỌN VAI TRÒ MỚI THÊM VÀO ĐÂY */}
              <FormControl fullWidth variant="outlined" error={!!errors.role}>
                <InputLabel id="role-select-label">Bạn là ai?</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  label="Bạn là ai?"
                  defaultValue="ROLE_STUDENT"
                  {...register("role", { required: "Vui lòng chọn vai trò" })}
                  sx={{ borderRadius: "12px", textAlign: "left" }}
                >
                  <MenuItem value="ROLE_STUDENT">Sinh viên thực tập</MenuItem>
                  <MenuItem value="ROLE_MENTOR">Giảng viên / Cố vấn (Mentor)</MenuItem>
                </Select>
                {errors.role && (
                  <FormHelperText error>{errors.role?.message}</FormHelperText>
                )}
              </FormControl>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.password}
                >
                  <InputLabel htmlFor="outlined-adornment-register-password">
                    Mật khẩu
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-register-password"
                    type={showPassword ? "text" : "password"}
                    onCopy={preventCopyPaste}
                    onPaste={preventCopyPaste}
                    onCut={preventCopyPaste}
                    {...register("password", { required: "Nhập mật khẩu" })}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                          sx={{ color: "#64748b" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Mật khẩu"
                    sx={{ borderRadius: "12px" }}
                  />
                  {errors.password && (
                    <FormHelperText error>
                      {errors.password?.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.confirmPassword}
                >
                  <InputLabel htmlFor="outlined-adornment-register-confirm-password">
                    Xác nhận Mật khẩu
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    onCopy={preventCopyPaste}
                    onPaste={preventCopyPaste}
                    onCut={preventCopyPaste}
                    {...register("confirmPassword", {
                      required: "Xác nhận lại",
                      validate: (val) =>
                        val === watch("password") || "Không khớp",
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
                    label="Xác nhận Mật khẩu"
                    sx={{ borderRadius: "12px" }}
                  />
                  {errors.confirmPassword && (
                    <FormHelperText error>
                      {errors.confirmPassword?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || isSubmitting}
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
              {isLoading || isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng ký tài khoản"
              )}
            </Button>

            <Typography
              variant="body1"
              align="center"
              sx={{ color: "#64748b" }}
            >
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#0f172a",
                  fontWeight: 700,
                }}
              >
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* CỘT PHẢI: ẢNH NỀN VỚI HIỆU ỨNG ZOOM CHẬM */}
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
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: 8,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
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
              Hành trình của bạn <br />
              bắt đầu từ đây.
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#cbd5e1", fontWeight: 400, maxWidth: "500px" }}
            >
              Hệ thống quản lý thực tập thông minh giúp bạn kết nối nhanh chóng
              với Mentor và doanh nghiệp.
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;