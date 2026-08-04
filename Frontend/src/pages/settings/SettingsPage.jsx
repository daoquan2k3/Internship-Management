import { useState, useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Avatar,
  Chip,
  Badge,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Person,
  Edit,
  Security,
  ArrowBack,
  PhotoCamera,
  EmailOutlined,
  PhoneIphoneOutlined,
  BadgeOutlined,
  VerifiedUserOutlined,
  WorkspacePremium,
  SchoolOutlined,
  ClassOutlined,
  CakeOutlined,
  LocationOnOutlined,
  BusinessOutlined,
  StarBorder,
} from "@mui/icons-material";
import { authApi } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { mentorApi, studentApi, userApi } from "../../api/resourceApi";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";

import { ProfileForm } from "./components/ProfileForm";
import { PasswordForm } from "./components/PasswordForm";
import { BentoCard } from "./components/BentoCard";
import { SidebarButton } from "./components/SidebarButton";

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
`;

const SettingsPage = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    watch: watchProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm();
  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm();

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
        externalMentorName: res.data.student?.externalMentorName || "",
        externalMentorPhone: res.data.student?.externalMentorPhone || "",
        department: res.data.mentor?.department || "",
        academicRank: res.data.mentor?.academicRank || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải thông tin cá nhân");
    }
  };

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    fetchProfile();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (fetchUser) {
        await fetchUser();
      }
      await fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi upload ảnh đại diện!");
    } finally {
      setLoadingAvatar(false);
    }
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
    } catch (err) {
      console.error(err);
      toast.error("Đổi mật khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "profile":
        return (
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
              <WorkspacePremium sx={{ color: "#fbbf24", fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                Hồ Sơ Của Tôi
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <BentoCard icon={<BadgeOutlined />} label="Tên đăng nhập" value={profileData?.username} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BentoCard icon={<Person />} label="Họ và tên" value={profileData?.fullName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BentoCard icon={<EmailOutlined />} label="Email" value={profileData?.email} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BentoCard icon={<PhoneIphoneOutlined />} label="Số điện thoại" value={profileData?.phoneNumber} />
              </Grid>
            </Grid>

            {profileData?.role?.includes("STUDENT") && (
              <>
                <Divider sx={{ my: 4, "&::before, &::after": { borderColor: "divider" } }}>
                  <Chip
                    label="Thông tin Học vấn & Liên hệ"
                    sx={{ fontWeight: 700, color: "text.primary", bgcolor: "action.hover", letterSpacing: "0.5px" }}
                  />
                </Divider>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6} md={4}>
                    <BentoCard icon={<BadgeOutlined />} label="Mã sinh viên" value={profileData?.student?.studentCode} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <BentoCard icon={<SchoolOutlined />} label="Ngành học" value={profileData?.student?.major} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <BentoCard icon={<ClassOutlined />} label="Lớp" value={profileData?.student?.classRoom} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <BentoCard icon={<CakeOutlined />} label="Ngày sinh" value={profileData?.student?.dateOfBirth} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <BentoCard icon={<LocationOnOutlined />} label="Địa chỉ" value={profileData?.student?.address} />
                  </Grid>
                </Grid>
              </>
            )}

            {profileData?.role?.includes("MENTOR") && (
              <>
                <Divider sx={{ my: 4, "&::before, &::after": { borderColor: "divider" } }}>
                  <Chip
                    label="Thông tin Chuyên môn"
                    sx={{ fontWeight: 700, color: "text.primary", bgcolor: "action.hover", letterSpacing: "0.5px" }}
                  />
                </Divider>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <BentoCard icon={<BusinessOutlined />} label="Khoa / Phòng ban" value={profileData?.mentor?.department} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <BentoCard icon={<StarBorder />} label="Học hàm / Học vị" value={profileData?.mentor?.academicRank} />
                  </Grid>
                </Grid>
              </>
            )}

            {(profileData?.universityName || profileData?.companyName) && (
              <>
                <Divider sx={{ my: 4, "&::before, &::after": { borderColor: "divider" } }}>
                  <Chip
                    label="Thông tin Đơn vị trực thuộc"
                    sx={{ fontWeight: 700, color: "text.primary", bgcolor: "action.hover", letterSpacing: "0.5px" }}
                  />
                </Divider>
                <Grid container spacing={2.5}>
                  {profileData?.universityName && (
                    <Grid item xs={12} sm={6}>
                      <BentoCard icon={<SchoolOutlined />} label="Trường Đại học" value={profileData.universityName} />
                    </Grid>
                  )}
                  {profileData?.companyName && (
                    <Grid item xs={12} sm={6}>
                      <BentoCard icon={<BusinessOutlined />} label="Doanh nghiệp" value={profileData.companyName} />
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Box>
        );

      case "edit":
        return (
          <ProfileForm
            profileData={profileData}
            regProfile={regProfile}
            profileErrors={profileErrors}
            handleProfileSubmit={handleProfileSubmit}
            onUpdateProfile={onUpdateProfile}
            isLoading={isLoading}
            watchProfile={watchProfile}
          />
        );

      case "security":
        return (
          <PasswordForm
            regPassword={regPassword}
            passwordErrors={passwordErrors}
            handlePasswordSubmit={handlePasswordSubmit}
            onChangePassword={onChangePassword}
            isLoading={isLoading}
            watch={watchPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "transparent",
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(239,68,68,0.03) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />

      <Box sx={{ maxWidth: 1100, mx: "auto", position: "relative", zIndex: 1 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 4,
            color: "text.primary",
            fontWeight: 600,
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 3,
            px: 2,
            py: 1,
            "&:hover": { bgcolor: "action.hover" }
          }}
        >
          Quay lại Hệ Thống
        </Button>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 6,
            bgcolor: "background.paper",
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: 600,
          }}
        >
          {/* CỘT TRÁI: SIDEBAR & AVATAR */}
          <Box
            sx={{
              width: { xs: "100%", md: 320 },
              bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
              borderRight: 1,
              borderColor: "divider",
              borderBottom: { xs: 1, md: 0 },
              p: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 5 }}>
              <Box sx={{ position: "relative" }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload-input"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload-input">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
                        <IconButton
                          component="span"
                          sx={{
                            bgcolor: "#2563eb",
                            color: "white",
                            width: 40,
                            height: 40,
                            border: "3px solid",
                            borderColor: "background.paper",
                            boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
                            "&:hover": { bgcolor: "#1d4ed8" },
                          }}
                        >
                          {loadingAvatar ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <PhotoCamera fontSize="small" />
                          )}
                        </IconButton>
                      </motion.div>
                    }
                  >
                    <motion.div
                      whileHover={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      style={{
                        cursor: "pointer",
                        borderRadius: "50%",
                        animation: `${pulseGlow} 3s infinite`,
                      }}
                    >
                      <Avatar
                        src={avatarPreview || profileData?.avatarUrl}
                        sx={{
                          width: 140,
                          height: 140,
                          bgcolor: "background.default",
                          color: "#3b82f6",
                          fontSize: "3.5rem",
                          fontWeight: 800,
                          border: "4px solid",
                          borderColor: "background.paper",
                          boxShadow: "inset 0 4px 10px rgba(0,0,0,0.1)",
                        }}
                      >
                        {!avatarPreview &&
                          !profileData?.avatarUrl &&
                          profileData?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </motion.div>
                  </Badge>
                </label>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, mt: 2, color: "text.primary", textAlign: "center" }}
              >
                {profileData?.fullName || profileData?.username}
              </Typography>
              <Chip
                icon={<VerifiedUserOutlined sx={{ fontSize: 16 }} />}
                label={profileData?.role?.replace("ROLE_", "") || "USER"}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                  borderRadius: 2,
                  "& .MuiChip-icon": { color: "primary.contrastText" }
                }}
              />
            </Box>

            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <SidebarButton
                active={activeMenu === "profile"}
                onClick={() => setActiveMenu("profile")}
                startIcon={<Person />}
              >
                Thông tin chung
              </SidebarButton>
              <SidebarButton
                active={activeMenu === "edit"}
                onClick={() => setActiveMenu("edit")}
                startIcon={<Edit />}
              >
                Cập nhật hồ sơ
              </SidebarButton>
              <SidebarButton
                active={activeMenu === "security"}
                onClick={() => setActiveMenu("security")}
                startIcon={<Security />}
              >
                Bảo mật
              </SidebarButton>
            </Stack>
          </Box>

          {/* CỘT PHẢI: NỘI DUNG ĐỘNG */}
          <Box sx={{ flex: 1, p: { xs: 3, sm: 5, md: 6 }, bgcolor: "transparent" }}>
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SettingsPage;
