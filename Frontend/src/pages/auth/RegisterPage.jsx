import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/authApi";
import {
  Box,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import RegisterForm from "./components/RegisterForm";

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    setBackendErrors({});
    try {
      // eslint-disable-next-line no-unused-vars
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
        bgcolor: "background.paper",
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
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "none",
                ml: -1,
                "&:hover": { bgcolor: "transparent", color: "text.primary" },
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
                color: "text.primary",
                letterSpacing: "-1px",
              }}
            >
              Tạo tài khoản.
            </Typography>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", mb: 4, fontSize: "1.1rem" }}
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

          <RegisterForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
            isSubmitting={isSubmitting}
            isLoading={isLoading}
            watch={watch}
          />
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