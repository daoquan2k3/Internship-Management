import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box, Typography, Paper, Button, Stack, TextField, CircularProgress,
  FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton,
  FormHelperText, Avatar, Chip, Badge, Grid, Divider
} from "@mui/material";
import {
  Visibility, VisibilityOff, Security, Person, Edit, LockReset,
  ArrowBack, PhotoCamera, EmailOutlined, PhoneIphoneOutlined,
  BadgeOutlined, VerifiedUserOutlined, WorkspacePremium,
  SchoolOutlined, ClassOutlined, CakeOutlined, LocationOnOutlined, // Các Icon cho Sinh viên
  BusinessOutlined, StarBorder,// Các Icon cho Mentor
} from "@mui/icons-material";
import { authApi } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { mentorApi, studentApi, userApi } from "../api/resourceApi";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/system";

// Hiệu ứng vòng sáng nhịp thở cho Avatar
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
`;

// Nút Menu Sidebar tùy chỉnh
const SidebarButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'active', })(({ theme, active }) => ({
  justifyContent: 'flex-start',
  padding: '12px 20px',
  borderRadius: '12px',
  color: active ? '#2563eb' : '#64748b',
  backgroundColor: active ? '#eff6ff' : 'transparent',
  fontWeight: active ? 700 : 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active ? '#eff6ff' : '#f8fafc',
    transform: 'translateX(4px)'
  },
  '& .MuiButton-startIcon': {
    color: active ? '#2563eb' : '#94a3b8',
    transition: 'all 0.3s',
  }
}));

// Thẻ hiển thị thông tin Bento Grid (Đã nâng cấp UI xử lý chữ dài)
const BentoCard = ({ icon, label, value }) => (
  <Box
    component={motion.div}
    whileHover={{ y: -4, boxShadow: '0 12px 24px -10px rgba(37,99,235,0.2)' }}
    sx={{
      p: 2.5,
      borderRadius: 4,
      bgcolor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.8)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
      height: '100%'
    }}
  >
    <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: '#ffffff', color: '#2563eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1, overflow: 'hidden' }}>
      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b', mt: 0.5, wordBreak: 'break-word', lineHeight: 1.4 }}>
        {value || <span style={{ color: '#cbd5e1', fontStyle: 'italic', fontWeight: 500 }}>Chưa cập nhật</span>}
      </Typography>
    </Box>
  </Box>
);

const SettingsPage = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isDobFocused, setIsDobFocused] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: regProfile, handleSubmit: handleProfileSubmit, watch: watchProfile, reset: resetProfile, formState: { errors: profileErrors } } = useForm();
  const { register: regPassword, handleSubmit: handlePasswordSubmit, watch, reset: resetPasswordForm, formState: { errors: passwordErrors } } = useForm();

  const formatToISO = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const fetchProfile = async () => {
    try {
      const res = await authApi.getMe();
      setProfileData(res.data);
      resetProfile({
        username: res.data.username || "",
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        phoneNumber: res.data.phoneNumber || "",
        studentCode: res.data.student?.studentCode || "",
        major: res.data.student?.major || "",
        classRoom: res.data.student?.classRoom || "",
        address: res.data.student?.address || "",
        dateOfBirth: formatToISO(res.data.student?.dateOfBirth) || "",
        department: res.data.mentor?.department || "",
        academicRank: res.data.mentor?.academicRank || "",
      });
    } catch (error) { toast.error("Không thể tải thông tin cá nhân"); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const currentUserId = user?.userId || user?.id;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoadingAvatar(true);
      await userApi.uploadAvatar(currentUserId, formData);
      toast.success("Cập nhật ảnh đại diện thành công!");
      if (fetchUser) { await fetchUser(); }
      await fetchProfile();
    } catch (error) { toast.error("Lỗi upload ảnh đại diện!"); }
    finally { setLoadingAvatar(false); }
  };

  const onUpdateProfile = async (data) => {
    setIsLoading(true);
    try {
      const currentRole = profileData?.role;

      if (currentRole.includes("STUDENT")) {
        await studentApi.updateStudent(profileData.student.studentId, data);
      } else if (currentRole.includes("MENTOR")) {
        await mentorApi.updateMentor(profileData.mentor.id, data);
      } else {
        await userApi.updateUser(profileData.userId, data);
      }

      toast.success("Lưu thông tin thành công!");
      await fetchProfile();
      if (fetchUser) {
        await fetchUser();
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Hệ thống từ chối cập nhật. Vui lòng kiểm tra lại các trường bắt buộc.");
      } else {
        toast.error(error.response?.data?.message || "Cập nhật thất bại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setIsLoading(true);
    try {
      await userApi.changePassword(data);
      toast.success("Bảo mật tài khoản thành công!");
      resetPasswordForm();
    } catch (error) { toast.error("Đổi mật khẩu thất bại"); }
    finally { setIsLoading(false); }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <Box component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <WorkspacePremium sx={{ color: '#fbbf24', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Hồ Sơ Của Tôi</Typography>
            </Box>

            {/* THÔNG TIN TÀI KHOẢN CHUNG */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}><BentoCard icon={<BadgeOutlined />} label="Tên đăng nhập" value={profileData?.username} /></Grid>
              <Grid item xs={12} sm={6}><BentoCard icon={<Person />} label="Họ và tên" value={profileData?.fullName} /></Grid>
              <Grid item xs={12} sm={6}><BentoCard icon={<EmailOutlined />} label="Email" value={profileData?.email} /></Grid>
              <Grid item xs={12} sm={6}><BentoCard icon={<PhoneIphoneOutlined />} label="Số điện thoại" value={profileData?.phoneNumber} /></Grid>
            </Grid>

            {/* THÔNG TIN CHI TIẾT SINH VIÊN */}
            {profileData?.role?.includes("STUDENT") && (
              <>
                <Divider sx={{ my: 4, '&::before, &::after': { borderColor: 'rgba(0,0,0,0.08)' } }}>
                  <Chip label="Thông tin Học vấn & Liên hệ" sx={{ fontWeight: 700, color: '#475569', bgcolor: '#f1f5f9', letterSpacing: '0.5px' }} />
                </Divider>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6} md={4}><BentoCard icon={<BadgeOutlined />} label="Mã sinh viên" value={profileData?.student?.studentCode} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><BentoCard icon={<SchoolOutlined />} label="Ngành học" value={profileData?.student?.major} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><BentoCard icon={<ClassOutlined />} label="Lớp" value={profileData?.student?.classRoom} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><BentoCard icon={<CakeOutlined />} label="Ngày sinh" value={profileData?.student?.dateOfBirth} /></Grid>
                  <Grid item xs={12} md={8}><BentoCard icon={<LocationOnOutlined />} label="Địa chỉ" value={profileData?.student?.address} /></Grid>
                </Grid>
              </>
            )}

            {/* THÔNG TIN CHI TIẾT GIẢNG VIÊN */}
            {profileData?.role?.includes("MENTOR") && (
              <>
                <Divider sx={{ my: 4, '&::before, &::after': { borderColor: 'rgba(0,0,0,0.08)' } }}>
                  <Chip label="Thông tin Chuyên môn" sx={{ fontWeight: 700, color: '#475569', bgcolor: '#f1f5f9', letterSpacing: '0.5px' }} />
                </Divider>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}><BentoCard icon={<BusinessOutlined />} label="Khoa / Phòng ban" value={profileData?.mentor?.department} /></Grid>
                  <Grid item xs={12} sm={6}><BentoCard icon={<StarBorder />} label="Học hàm / Học vị" value={profileData?.mentor?.academicRank} /></Grid>
                </Grid>
              </>
            )}
          </Box>
        );

      case 'edit':
        return (
          <Box component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Box sx={{ mb: 4 }}><Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Chỉnh Sửa Thông Tin</Typography></Box>
            <Box component="form" onSubmit={handleProfileSubmit(onUpdateProfile)}>
              <Stack spacing={3}>
                <TextField fullWidth label="Tên đăng nhập" {...regProfile("username")} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc', borderRadius: 3 } }} />
                <TextField fullWidth label="Họ và Tên" {...regProfile("fullName", { required: "Bắt buộc" })} error={!!profileErrors.fullName} helperText={profileErrors.fullName?.message} />
                <TextField fullWidth label="Email" type="email" {...regProfile("email")} />
                <TextField fullWidth label="Số điện thoại" {...regProfile("phoneNumber")} />

                {profileData?.role?.includes("STUDENT") && (
                  <>
                    <Divider sx={{ my: 2 }}>Thông tin Sinh viên</Divider>
                    <TextField fullWidth label="Mã sinh viên" {...regProfile("studentCode")} disabled />
                    <TextField fullWidth label="Ngành học (*)" {...regProfile("major", { required: "Vui lòng nhập ngành học" })} error={!!profileErrors.major} helperText={profileErrors.major?.message} />
                    <TextField fullWidth label="Lớp (*)" {...regProfile("classRoom", { required: "Vui lòng nhập lớp" })} error={!!profileErrors.classRoom} helperText={profileErrors.classRoom?.message} />
                    <TextField fullWidth label="Địa chỉ" {...regProfile("address")} />
                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      type={(isDobFocused || watchProfile("dateOfBirth")) ? "date" : "text"}
                      InputLabelProps={{
                        shrink: isDobFocused || !!watchProfile("dateOfBirth")
                      }}
                      {...regProfile("dateOfBirth", {
                        onBlur: () => setIsDobFocused(false)
                      })}
                      onFocus={() => setIsDobFocused(true)}
                      sx={{
                        '& .MuiOutlinedInput-root': { bgcolor: '#ffffff', borderRadius: 3 }
                      }}
                    />
                  </>
                )}

                {profileData?.role?.includes("MENTOR") && (
                  <>
                    <Divider sx={{ my: 2 }}>Thông tin Giảng viên</Divider>
                    <TextField fullWidth label="Khoa / Phòng ban (*)" {...regProfile("department", { required: "Vui lòng nhập khoa" })} error={!!profileErrors.department} helperText={profileErrors.department?.message} />
                    <TextField fullWidth label="Học hàm / Học vị" {...regProfile("academicRank")} />
                  </>
                )}
                <Button type="submit" variant="contained" disabled={isLoading} sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, background: 'linear-gradient(to right, #2563eb, #3b82f6)', boxShadow: '0 8px 16px rgba(37,99,235,0.2)' }}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Lưu Thay Đổi"}
                </Button>
              </Stack>
            </Box>
          </Box>
        );

      case 'security':
        return (
          <Box component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Box sx={{ mb: 4 }}><Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Bảo Mật Tài Khoản</Typography></Box>
            <Box component="form" onSubmit={handlePasswordSubmit(onChangePassword)}>
              <Stack spacing={3}>
                <FormControl fullWidth variant="outlined" error={!!passwordErrors.oldPassword}>
                  <InputLabel>Mật khẩu hiện tại</InputLabel>
                  <OutlinedInput type={showOldPassword ? "text" : "password"} {...regPassword("oldPassword", { required: "Bắt buộc" })} endAdornment={<InputAdornment position="end"><IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">{showOldPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>} label="Mật khẩu hiện tại" sx={{ borderRadius: 3, bgcolor: '#fff' }} />
                </FormControl>
                <FormControl fullWidth variant="outlined" error={!!passwordErrors.newPassword}>
                  <InputLabel>Mật khẩu mới</InputLabel>
                  <OutlinedInput type={showNewPassword ? "text" : "password"} {...regPassword("newPassword", { required: "Bắt buộc" })} endAdornment={<InputAdornment position="end"><IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">{showNewPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>} label="Mật khẩu mới" sx={{ borderRadius: 3, bgcolor: '#fff' }} />
                </FormControl>
                <FormControl fullWidth variant="outlined" error={!!passwordErrors.confirmPassword}>
                  <InputLabel>Xác nhận mật khẩu</InputLabel>
                  <OutlinedInput type={showConfirmPassword ? "text" : "password"} {...regPassword("confirmPassword", { validate: (val) => val === watch("newPassword") || "Mật khẩu không khớp" })} endAdornment={<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>} label="Xác nhận mật khẩu" sx={{ borderRadius: 3, bgcolor: '#fff' }} />
                  {passwordErrors.confirmPassword && <FormHelperText error>{passwordErrors.confirmPassword.message}</FormHelperText>}
                </FormControl>
                <Button type="submit" variant="contained" color="error" disabled={isLoading} startIcon={<LockReset />} sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 8px 16px rgba(239,68,68,0.2)' }}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Cập Nhật Mật Khẩu"}
                </Button>
              </Stack>
            </Box>
          </Box>
        );
      default: return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 }, position: 'relative', overflow: 'hidden' }}>
      {/* Background Orbs */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(239,68,68,0.03) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />

      <Box sx={{ maxWidth: 1100, mx: "auto", position: 'relative', zIndex: 1 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 4, color: '#64748b', fontWeight: 600, bgcolor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', borderRadius: 3, px: 2, py: 1 }}>
          Quay lại Hệ Thống
        </Button>

        <Paper sx={{ borderRadius: 6, bgcolor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.08)', overflow: "hidden", display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 600 }}>

          {/* CỘT TRÁI: SIDEBAR & AVATAR */}
          <Box sx={{ width: { xs: '100%', md: 320 }, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRight: { md: '1px solid rgba(0,0,0,0.04)' }, borderBottom: { xs: '1px solid rgba(0,0,0,0.04)', md: 'none' }, p: 4, display: 'flex', flexDirection: 'column' }}>

            {/* Khối Avatar Tương tác cao */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
              <Box sx={{ position: "relative" }}>
                <input accept="image/*" style={{ display: "none" }} id="avatar-upload-input" type="file" onChange={handleAvatarChange} />
                <label htmlFor="avatar-upload-input">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
                        <IconButton component="span" sx={{ bgcolor: "#2563eb", color: "white", width: 40, height: 40, border: '3px solid #fff', boxShadow: '0 4px 10px rgba(37,99,235,0.3)', "&:hover": { bgcolor: "#1d4ed8" } }}>
                          {loadingAvatar ? <CircularProgress size={20} color="inherit" /> : <PhotoCamera fontSize="small" />}
                        </IconButton>
                      </motion.div>
                    }
                  >
                    <motion.div
                      whileHover={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      style={{ cursor: 'pointer', borderRadius: '50%', animation: `${pulseGlow} 3s infinite` }}
                    >
                      <Avatar
                        src={avatarPreview || profileData?.avatarUrl}
                        sx={{ width: 140, height: 140, bgcolor: "#e2e8f0", color: "#3b82f6", fontSize: "3.5rem", fontWeight: 800, border: "4px solid white", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.1)" }}
                      >
                        {!avatarPreview && !profileData?.avatarUrl && profileData?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </motion.div>
                  </Badge>
                </label>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mt: 2, color: '#1e293b', textAlign: 'center' }}>
                {profileData?.fullName || profileData?.username}
              </Typography>
              <Chip icon={<VerifiedUserOutlined sx={{ fontSize: 16 }} />} label={profileData?.role?.replace('ROLE_', '') || 'USER'} size="small" sx={{ mt: 1, bgcolor: 'rgba(37,99,235,0.1)', color: '#2563eb', fontWeight: 700, borderRadius: 2 }} />
            </Box>

            {/* Menu Điều Hướng */}
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <SidebarButton active={activeMenu === 'profile'} onClick={() => setActiveMenu('profile')} startIcon={<Person />}>Thông tin chung</SidebarButton>
              <SidebarButton active={activeMenu === 'edit'} onClick={() => setActiveMenu('edit')} startIcon={<Edit />}>Cập nhật hồ sơ</SidebarButton>
              <SidebarButton active={activeMenu === 'security'} onClick={() => setActiveMenu('security')} startIcon={<Security />}>Bảo mật</SidebarButton>
            </Stack>
          </Box>

          {/* CỘT PHẢI: NỘI DUNG ĐỘNG */}
          <Box sx={{ flex: 1, p: { xs: 3, sm: 5, md: 6 }, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </Box>

        </Paper>
      </Box>
    </Box>
  );
};

export default SettingsPage;