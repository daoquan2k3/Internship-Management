import { useState } from "react";
import { Link } from "react-router-dom";
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
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const RegisterForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSubmitting,
  isLoading,
  watch
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const preventCopyPaste = (e) => {
    e.preventDefault();
  };

  return (
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
          <FormControl fullWidth variant="outlined" error={!!errors.password}>
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
                    sx={{ color: "text.secondary" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mật khẩu"
              sx={{ borderRadius: "12px" }}
            />
            {errors.password && (
              <FormHelperText error>{errors.password?.message}</FormHelperText>
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
                validate: (val) => val === watch("password") || "Không khớp",
              })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    sx={{ color: "text.secondary" }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          bgcolor: "primary.main",
          color: "#fff",
          textTransform: "none",
          "&:hover": { bgcolor: "primary.dark" },
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
        sx={{ color: "text.secondary" }}
      >
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            color: "text.primary",
            fontWeight: 700,
          }}
        >
          Đăng nhập
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
