import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";

export const ProfileForm = ({
  profileData,
  regProfile,
  profileErrors,
  handleProfileSubmit,
  onUpdateProfile,
  isLoading,
  watchProfile,
}) => {
  const [isDobFocused, setIsDobFocused] = useState(false);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
          Chỉnh Sửa Thông Tin
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleProfileSubmit(onUpdateProfile)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Tên đăng nhập"
            {...regProfile("username")}
            disabled
            sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.default", borderRadius: 3 } }}
          />
          <TextField
            fullWidth
            label="Họ và Tên"
            {...regProfile("fullName", { required: "Bắt buộc" })}
            error={!!profileErrors.fullName}
            helperText={profileErrors.fullName?.message}
          />
          <TextField fullWidth label="Email" type="email" {...regProfile("email")} />
          <TextField fullWidth label="Số điện thoại" {...regProfile("phoneNumber")} />

          {profileData?.role?.includes("STUDENT") && (
            <>
              <Divider sx={{ my: 2 }}>Thông tin Sinh viên</Divider>
              <TextField fullWidth label="Mã sinh viên" {...regProfile("studentCode")} disabled />
              <TextField
                fullWidth
                label="Ngành học (*)"
                {...regProfile("major", { required: "Vui lòng nhập ngành học" })}
                error={!!profileErrors.major}
                helperText={profileErrors.major?.message}
              />
              <TextField
                fullWidth
                label="Lớp (*)"
                {...regProfile("classRoom", { required: "Vui lòng nhập lớp" })}
                error={!!profileErrors.classRoom}
                helperText={profileErrors.classRoom?.message}
              />
              <TextField fullWidth label="Địa chỉ" {...regProfile("address")} />
              <TextField
                fullWidth
                label="Ngày sinh"
                type={isDobFocused || watchProfile("dateOfBirth") ? "date" : "text"}
                InputLabelProps={{
                  shrink: isDobFocused || !!watchProfile("dateOfBirth"),
                }}
                {...regProfile("dateOfBirth", {
                  onBlur: () => setIsDobFocused(false),
                })}
                onFocus={() => setIsDobFocused(true)}
                sx={{
                  "& .MuiOutlinedInput-root": { bgcolor: "background.paper", borderRadius: 3 },
                }}
              />
            </>
          )}

          {profileData?.role?.includes("MENTOR") && (
            <>
              <Divider sx={{ my: 2 }}>Thông tin Giảng viên</Divider>
              <TextField
                fullWidth
                label="Khoa / Phòng ban (*)"
                {...regProfile("department", { required: "Vui lòng nhập khoa" })}
                error={!!profileErrors.department}
                helperText={profileErrors.department?.message}
              />
              <TextField fullWidth label="Học hàm / Học vị" {...regProfile("academicRank")} />
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
              background: "linear-gradient(to right, #2563eb, #3b82f6)",
              boxShadow: "0 8px 16px rgba(37,99,235,0.2)",
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Lưu Thay Đổi"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
