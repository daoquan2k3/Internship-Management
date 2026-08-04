import { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { motion } from "framer-motion";
import { notificationApi } from "../../api/resourceApi";
import { AuthContext } from "../../context/AuthContext";
import { NotificationList } from "./NotificationList";
import { useThemeContext } from "../../context/ThemeContext";

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const { mode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getMyNotifications();
      setNotifications(res?.content || res?.data?.content || res?.data || res || []);
    } catch (err) {
      console.error("Lỗi lấy thông báo:", err);
    }
  };

  useEffect(() => {
    const isProfileComplete =
      user &&
      user.fullName &&
      user.phoneNumber &&
      (!user.role.includes("STUDENT") || (user.student?.major && user.student?.classRoom)) &&
      (!user.role.includes("MENTOR") || user.mentor?.department);
    if (isProfileComplete) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id, event) => {
    if (event) event.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === id || n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái đọc:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Lỗi đọc toàn bộ thông báo:", err);
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontWeight: "bold",
              boxShadow: "0 0 0 2px #1e3c72",
              animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
            },
          }}
        >
          <motion.div
            animate={unreadCount > 0 ? { rotateZ: [0, 20, -15, 10, -5, 0] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
            whileHover={{ scale: 1.15, rotateZ: 10 }}
            whileTap={{ scale: 0.9 }}
            style={{ display: "flex", transformOrigin: "top center" }}
          >
            <NotificationsIcon
              sx={{ color: "#ffffff", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }}
            />
          </motion.div>
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            mt: 2,
            overflow: "visible",
            background: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, rotateX: -15, y: -20 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: 10, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            perspective: "1000px",
            background: mode === 'dark' ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(16px)",
            boxShadow: mode === 'dark' ? "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset" : "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05) inset",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: 380, maxHeight: 480, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  fontSize: "1rem",
                  letterSpacing: "-0.5px",
                }}
              >
                Thông báo của bạn
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {unreadCount > 0 ? (
                  <Typography
                    component={motion.p}
                    onClick={handleMarkAllAsRead}
                    whileHover={{ scale: 1.05, color: "#1d4ed8" }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      color: "#3b82f6",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      bgcolor: "rgba(59, 130, 246, 0.1)",
                      px: 1.2,
                      py: 0.5,
                      borderRadius: "8px",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      boxShadow: "0 2px 6px rgba(59, 130, 246, 0.05)",
                    }}
                  >
                    Đọc tất cả ({unreadCount})
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, px: 1 }}>
                    Đã đọc hết
                  </Typography>
                )}
              </Box>
            </Box>

            <NotificationList notifications={notifications} handleMarkAsRead={handleMarkAsRead} />
          </Box>
        </motion.div>
      </Popover>
    </>
  );
};

export default NotificationBell;
