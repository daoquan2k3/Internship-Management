import React, { useState, useEffect, useContext } from 'react';
import {
    IconButton, Badge, Popover, Box, Typography, List, ListItem,
    ListItemText, Divider, ListItemAvatar, Avatar, Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CircleIcon from '@mui/icons-material/Circle';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationApi } from '../api/resourceApi';
import { AuthContext } from '../context/AuthContext';

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
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
        const isProfileComplete = user && user.fullName && user.phoneNumber &&
            (user.role.includes('ADMIN') ||
                (user.role.includes('STUDENT') && user.student?.major && user.student?.classRoom) ||
                (user.role.includes('MENTOR') && user.mentor?.department));
        if (isProfileComplete) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

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
            setNotifications(prev =>
                prev.map(n => (n.notificationId === id || n.id === id) ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái đọc:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await notificationApi.markAllAsRead();
            // Cập nhật nhanh toàn bộ state sang đã đọc tại Client cho mượt UI
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Lỗi đọc toàn bộ thông báo:", err);
        }
    };

    return (
        <>
            {/* 1. NÚT CHUÔNG VỚI HIỆU ỨNG RUNG (RINGING ANIMATION) */}
            <IconButton color="inherit" onClick={handleClick}>
                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            fontWeight: 'bold',
                            boxShadow: '0 0 0 2px #1e3c72', // Viền bo để tách biệt với nền
                            animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none'
                        }
                    }}
                >
                    <motion.div
                        animate={unreadCount > 0 ? { rotateZ: [0, 20, -15, 10, -5, 0] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                        whileHover={{ scale: 1.15, rotateZ: 10 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ display: 'flex', transformOrigin: 'top center' }}
                    >
                        <NotificationsIcon sx={{ color: '#ffffff', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} />
                    </motion.div>
                </Badge>
            </IconButton>

            {/* 2. POPOVER VỚI HIỆU ỨNG GẬP 3D */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        borderRadius: '20px', // Bo góc mềm hơn
                        mt: 2,
                        overflow: 'visible', // Cho phép bóng đổ tràn ra ngoài
                        background: 'transparent', // Để motion.div bên trong lo phần nền
                        boxShadow: 'none',
                    }
                }}
            >
                <motion.div
                    initial={{ opacity: 0, rotateX: -15, y: -20 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: 10, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                        perspective: '1000px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(16px)', // Glassmorphism
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset',
                        borderRadius: '20px',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ width: 380, maxHeight: 480, display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <Box sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem', letterSpacing: '-0.5px' }}>
                                Thông báo của bạn
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {unreadCount > 0 ? (
                                    <Typography
                                        component={motion.p}
                                        onClick={handleMarkAllAsRead}
                                        whileHover={{ scale: 1.05, color: '#1d4ed8' }}
                                        whileTap={{ scale: 0.95 }}
                                        sx={{
                                            color: '#3b82f6',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            bgcolor: '#eff6ff',
                                            px: 1.2,
                                            py: 0.5,
                                            borderRadius: '8px',
                                            border: '1px solid rgba(59, 130, 246, 0.2)',
                                            boxShadow: '0 2px 6px rgba(59, 130, 246, 0.05)'
                                        }}
                                    >
                                        Đọc tất cả ({unreadCount})
                                    </Typography>
                                ) : (
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, px: 1 }}>
                                        Đã đọc hết
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* Danh sách thông báo */}
                        <List disablePadding sx={{ overflowY: 'auto', flexGrow: 1, p: 1 }}>
                            <AnimatePresence>
                                {notifications.length > 0 ? (
                                    notifications.map((notif, index) => {
                                        const notifId = notif.notificationId || notif.id;
                                        return (
                                            /* 3. HIỆU ỨNG THẺ NỔI 3D KHI HOVER */
                                            <motion.div
                                                key={notifId}
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                transition={{ delay: index * 0.05 }} // Hiệu ứng xuất hiện lần lượt
                                                whileHover={{
                                                    scale: 1.02,
                                                    y: -2,
                                                    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                                                    backgroundColor: '#ffffff'
                                                }}
                                                style={{
                                                    marginBottom: '8px',
                                                    borderRadius: '16px',
                                                    transformStyle: 'preserve-3d'
                                                }}
                                            >
                                                <ListItem
                                                    alignItems="flex-start"
                                                    sx={{
                                                        py: 2,
                                                        px: 2.5,
                                                        borderRadius: '16px',
                                                        bgcolor: notif.isRead ? 'transparent' : 'rgba(239, 246, 255, 0.6)',
                                                        border: '1px solid',
                                                        borderColor: notif.isRead ? 'transparent' : 'rgba(186, 230, 253, 0.5)',
                                                        transition: 'all 0.3s ease',
                                                    }}
                                                    secondaryAction={
                                                        !notif.isRead && (
                                                            <Tooltip title="Đánh dấu đã đọc" placement="left">
                                                                <IconButton
                                                                    edge="end"
                                                                    size="small"
                                                                    onClick={(e) => handleMarkAsRead(notifId, e)}
                                                                    component={motion.button}
                                                                    whileHover={{ scale: 1.2, rotate: 15 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    sx={{
                                                                        color: '#3b82f6',
                                                                        bgcolor: '#ffffff',
                                                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                                                                        '&:hover': { color: '#2563eb', bgcolor: '#eff6ff' }
                                                                    }}
                                                                >
                                                                    <CheckCircleIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )
                                                    }
                                                >
                                                    <ListItemAvatar sx={{ minWidth: 56 }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: notif.isRead ? '#f1f5f9' : '#dbeafe',
                                                                color: notif.isRead ? '#94a3b8' : '#2563eb',
                                                                width: 40, height: 40,
                                                                boxShadow: notif.isRead ? 'none' : 'inset 0 2px 4px rgba(255,255,255,0.5), 0 4px 8px rgba(37,99,235,0.15)'
                                                            }}
                                                        >
                                                            <AssignmentIcon fontSize="small" />
                                                        </Avatar>
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography sx={{
                                                                    fontWeight: notif.isRead ? 500 : 700,
                                                                    fontSize: '0.92rem',
                                                                    color: notif.isRead ? '#64748b' : '#0f172a',
                                                                    lineHeight: 1.4
                                                                }}>
                                                                    {notif.message}
                                                                </Typography>
                                                                {!notif.isRead && (
                                                                    <motion.div
                                                                        animate={{ scale: [1, 1.2, 1] }}
                                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                                    >
                                                                        <CircleIcon sx={{ fontSize: 10, color: '#3b82f6', mt: 0.5 }} />
                                                                    </motion.div>
                                                                )}
                                                            </Box>
                                                        }
                                                        secondary={notif.createdAt}
                                                        secondaryTypographyProps={{
                                                            fontSize: '0.75rem',
                                                            mt: 0.8,
                                                            color: '#94a3b8',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </ListItem>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <motion.div
                                                animate={{ y: [0, -10, 0] }}
                                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                            >
                                                <NotificationsIcon sx={{ fontSize: 64, color: '#e2e8f0', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.05))' }} />
                                            </motion.div>
                                            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                Bạn đã đọc hết mọi thông báo!
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </List>
                    </Box>
                </motion.div>
            </Popover>
        </>
    );
};

export default NotificationBell;