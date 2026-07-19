import { useState, useContext, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Chip,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  RateReview as RateReviewIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  WarningRounded as WarningIcon,
  UploadFile as UploadFileIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../pages/NotificationBell";
import { toast } from "react-toastify";

const drawerWidth = 280;

const allMenuItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: [
      "ADMIN",
      "ROLE_ADMIN",
      "MENTOR",
      "ROLE_MENTOR",
      "STUDENT",
      "ROLE_STUDENT",
    ],
  },
  {
    label: "My Mentor",
    icon: <PersonIcon />,
    path: "/my-mentor",
    roles: ["STUDENT", "ROLE_STUDENT"],
  },
  {
    label: "My Students",
    icon: <GroupIcon />,
    path: "/my-students",
    roles: ["MENTOR", "ROLE_MENTOR"],
  },
  {
    label: "Nộp Báo cáo",
    icon: <UploadFileIcon />,
    path: "/submit-report",
    roles: ["STUDENT", "ROLE_STUDENT"],
  },
  {
    label: "User Management",
    icon: <PeopleIcon />,
    roles: ["ADMIN", "ROLE_ADMIN"],
    children: [
      { label: "All Users", path: "/management/users" },
      { label: "All Students", path: "/management/students" },
      { label: "All Mentors", path: "/management/mentors" },
    ],
  },
  {
    label: "Internship Management",
    icon: <SchoolIcon />,
    roles: [
      "ADMIN",
      "ROLE_ADMIN",
      "MENTOR",
      "ROLE_MENTOR",
      "STUDENT",
      "ROLE_STUDENT",
    ],
    children: [
      { label: "Internship Phases", path: "/management/phases" },
      { label: "Internship Assignments", path: "/management/assignments" },
    ],
  },
  {
    label: "Quản lý Báo cáo",
    icon: <AssignmentTurnedInIcon />,
    path: "/management/reports",
    roles: ["ADMIN", "ROLE_ADMIN", "MENTOR", "ROLE_MENTOR"],
  },
  {
    label: "Assessment Management",
    icon: <RateReviewIcon />,
    roles: [
      "ADMIN",
      "ROLE_ADMIN",
      "MENTOR",
      "ROLE_MENTOR",
      "STUDENT",
      "ROLE_STUDENT",
    ],
    children: [
      { label: "Evaluation Criteria", path: "/management/evaluation-criteria" },
      { label: "Assessment Rounds", path: "/management/assessment-rounds" },
      { label: "Assessment Results", path: "/management/assessment-results" },
    ],
  },
];

export const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const getFilteredMenuItems = () => {
    if (!user) return [];
    const userRole = user?.role;
    return allMenuItems.filter((item) => item.roles.includes(userRole));
  };

  const filteredMenuItems = getFilteredMenuItems();

  useEffect(() => {
    if (user && user.role !== "ROLE_ADMIN") {
      const isMissingInfo = 
        !user.fullName || 
        !user.phoneNumber || 
        (user.role === "ROLE_STUDENT" && (!user.student?.major || !user.student?.classRoom)) ||
        (user.role === "ROLE_MENTOR" && (!user.mentor?.department));

      if (isMissingInfo && location.pathname !== "/settings") {
        toast.warning("Vui lòng cập nhật đầy đủ Hồ sơ cá nhân để tiếp tục!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/settings"); // Ép văng về trang settings
      }
    }
  }, [location.pathname, user, navigate]);

  // ĐOẠN CODE MỚI: Lắng nghe URL và tự động bung menu tương ứng
  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedItems = { ...expandedItems };
    let hasChanges = false;

    filteredMenuItems.forEach((item, index) => {
      if (item.children) {
        // Kiểm tra xem URL hiện tại có chứa đường dẫn của bất kỳ mục con nào không
        const isChildActive = item.children.some((child) =>
          currentPath.includes(child.path),
        );

        // Nếu có và menu đang đóng, thì tự động mở nó ra
        if (isChildActive && !newExpandedItems[index]) {
          newExpandedItems[index] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setExpandedItems(newExpandedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Trigger mỗi khi chuyển trang

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleMenuToggle = (index) => {
    setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleOpenLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const confirmLogout = async () => {
    await logout();
    window.location.href = "/Internship-Management-System/#/";
  };

  const isActive = (path) => location.pathname === path;

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
      case "ROLE_ADMIN":
        return "#d32f2f";
      case "MENTOR":
      case "ROLE_MENTOR":
        return "#1976d2";
      case "STUDENT":
      case "ROLE_STUDENT":
        return "#388e3c";
      default:
        return "#666";
    }
  };

  const DrawerContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fafafa",
      }}
    >
      <Box
        sx={{
          p: 2.5,
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          color: "white",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "800", mb: 0.5, letterSpacing: "0.5px" }}
        >
          📚 Internship System
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
          Management Platform
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: "auto", py: 2, px: 1.5 }}>
        {filteredMenuItems.map((item, index) => (
          <Box key={index} sx={{ mb: 0.5 }}>
            {item.children ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ListItem
                    component="div"
                    onClick={() => handleMenuToggle(index)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "12px",
                      mb: 0.5,
                      backgroundColor: expandedItems[index]
                        ? "#ffffff"
                        : "transparent",
                      boxShadow: expandedItems[index]
                        ? "0 4px 12px rgba(0,0,0,0.05)"
                        : "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#1976d2", minWidth: 42 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        color: "#333",
                      }}
                    />
                    {expandedItems[index] ? (
                      <ExpandLess sx={{ color: "#1976d2" }} />
                    ) : (
                      <ExpandMore sx={{ color: "#999" }} />
                    )}
                  </ListItem>
                </motion.div>

                <Collapse in={expandedItems[index]} timeout="auto">
                  <List component="div" disablePadding sx={{ mt: 0.5 }}>
                    {item.children.map((child, childIndex) => (
                      <motion.div key={childIndex} whileHover={{ x: 5 }}>
                        <ListItem
                          component="div"
                          onClick={() => handleNavigate(child.path)}
                          sx={{
                            cursor: "pointer",
                            pl: 6.5,
                            py: 1.2,
                            borderRadius: "10px",
                            mb: 0.5,
                            backgroundColor: isActive(child.path)
                              ? "rgba(25, 118, 210, 0.08)"
                              : "transparent",
                            color: isActive(child.path) ? "#1976d2" : "#555",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.05)",
                              color: "#1976d2",
                            },
                          }}
                        >
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontWeight: isActive(child.path) ? 700 : 500,
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItem
                  component="div"
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    backgroundColor: isActive(item.path)
                      ? "#ffffff"
                      : "transparent",
                    boxShadow: isActive(item.path)
                      ? "0 4px 12px rgba(0,0,0,0.05)"
                      : "none",
                    borderLeft: isActive(item.path)
                      ? "4px solid #1976d2"
                      : "4px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? "#1976d2" : "#777",
                      minWidth: 42,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 700 : 500,
                      color: isActive(item.path) ? "#1976d2" : "#333",
                    }}
                  />
                </ListItem>
              </motion.div>
            )}
          </Box>
        ))}
      </List>

      <Box
        sx={{
          p: 2.5,
          background: "#ffffff",
          borderTop: "1px solid #f0f0f0",
          boxShadow: "0 -4px 15px rgba(0,0,0,0.02)",
        }}
      >
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mb: 2,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                borderColor: "#cbd5e1",
              },
            }}
          >
            {/* Cột trái: Avatar */}
            <Avatar
              src={user?.avatarUrl} // Lấy ảnh từ Cloudinary nếu có
              sx={{
                width: 48,
                height: 48,
                border: "2px solid #ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                bgcolor: getRoleColor(user?.role), // Lấy màu nền theo Role
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "1.2rem",
              }}
            >
              {/* Fallback chữ cái đầu nếu không có ảnh */}
              {!user?.avatarUrl &&
                (user?.fullName?.charAt(0).toUpperCase() ||
                  user?.username?.charAt(0).toUpperCase())}
            </Avatar>

            {/* Cột phải: Text */}
            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.2,
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.65rem",
                  letterSpacing: "0.5px",
                }}
              >
                Tài khoản của bạn
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: "800",
                  color: "#1e293b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis", // Cắt chữ "..." nếu tên quá dài
                  mb: 0.5,
                  fontSize: "0.95rem",
                }}
              >
                {user?.fullName || user?.username}
              </Typography>

              <Chip
                label={
                  user?.role?.includes("ADMIN")
                    ? "Administrator"
                    : user?.role?.includes("MENTOR")
                      ? "Mentor"
                      : "Student"
                }
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  backgroundColor: `${getRoleColor(user?.role)}15`, // Thêm '15' để tạo màu nền trong suốt (opacity)
                  color: getRoleColor(user?.role),
                  fontWeight: "800",
                  border: `1px solid ${getRoleColor(user?.role)}40`, // Viền mờ
                }}
              />
            </Box>
          </Paper>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <ListItem
            component="div"
            onClick={handleOpenLogoutDialog}
            sx={{
              cursor: "pointer",
              borderRadius: "12px",
              backgroundColor: "#fff5f5",
              border: "1px solid #ffcdd2",
              color: "#d32f2f",
              boxShadow: "0 2px 8px rgba(211,47,47,0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#ffebee",
                boxShadow: "0 4px 12px rgba(211,47,47,0.2)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#d32f2f", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Đăng xuất"
              primaryTypographyProps={{ fontWeight: 700 }}
            />
          </ListItem>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f0f2f5" }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, fontWeight: "700", letterSpacing: "0.5px" }}
            >
              Internship Management System
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <NotificationBell />

              <IconButton
                color="inherit"
                size="large"
                onClick={() => navigate("/settings")}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <DrawerContent />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: "none",
                boxShadow: "4px 0 24px rgba(0,0,0,0.06)",
              },
            }}
            open
          >
            <DrawerContent />
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 4 },
            mt: 8,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: "#f0f2f5",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* ============================================================ */}
      {/* DIALOG XÁC NHẬN LOGOUT VỚI HIỆU ỨNG BLUR TOÀN MÀN HÌNH */}
      {/* ============================================================ */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleCloseLogoutDialog}
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
              backgroundColor: "#ffebee",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 24px",
              boxShadow: "0 0 0 8px rgba(255, 235, 238, 0.5)",
            }}
          >
            <WarningIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#1e293b", mb: 1.5 }}
          >
            Xác nhận đăng xuất
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", mb: 2 }}>
            Bạn có chắc chắn muốn thoát khỏi phiên làm việc hiện tại không?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button
            onClick={handleCloseLogoutDialog}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              px: 4,
              py: 1.2,
              color: "#64748b",
              borderColor: "#cbd5e1",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#f8fafc", borderColor: "#94a3b8" },
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
    </>
  );
};
