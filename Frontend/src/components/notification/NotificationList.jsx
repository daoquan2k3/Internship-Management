
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CircleIcon from "@mui/icons-material/Circle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { motion, AnimatePresence } from "framer-motion";

export const NotificationList = ({ notifications, handleMarkAsRead }) => {
  return (
    <List disablePadding sx={{ overflowY: "auto", flexGrow: 1, p: 1 }}>
      <AnimatePresence>
        {notifications.length > 0 ? (
          notifications.map((notif, index) => {
            const notifId = notif.notificationId || notif.id;
            return (
              <motion.div
                key={notifId}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                  backgroundColor: "background.paper",
                }}
                style={{
                  marginBottom: "8px",
                  borderRadius: "16px",
                  transformStyle: "preserve-3d",
                }}
              >
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    px: 2.5,
                    borderRadius: "16px",
                    bgcolor: notif.isRead ? "transparent" : "rgba(59, 130, 246, 0.15)",
                    border: "1px solid",
                    borderColor: notif.isRead ? "transparent" : "rgba(59, 130, 246, 0.3)",
                    transition: "all 0.3s ease",
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
                            color: "primary.main",
                            bgcolor: "action.hover",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            "&:hover": { color: "primary.main", bgcolor: "action.hover" },
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
                        bgcolor: notif.isRead ? "transparent" : "rgba(59, 130, 246, 0.1)",
                        color: notif.isRead ? "text.disabled" : "#2563eb",
                        width: 40,
                        height: 40,
                        boxShadow: notif.isRead
                          ? "none"
                          : "inset 0 2px 4px rgba(255,255,255,0.5), 0 4px 8px rgba(37,99,235,0.15)",
                      }}
                    >
                      <AssignmentIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: notif.isRead ? 500 : 700,
                            fontSize: "0.92rem",
                            color: notif.isRead ? "text.secondary" : "text.primary",
                            lineHeight: 1.4,
                          }}
                        >
                          {notif.message}
                        </Typography>
                        {!notif.isRead && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <CircleIcon sx={{ fontSize: 10, color: "#3b82f6", mt: 0.5 }} />
                          </motion.div>
                        )}
                      </Box>
                    }
                    secondary={notif.createdAt}
                    secondaryTypographyProps={{
                      fontSize: "0.75rem",
                      mt: 0.8,
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              </motion.div>
            );
          })
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box sx={{ py: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <NotificationsIcon
                  sx={{
                    fontSize: 64,
                    color: "text.disabled",
                    filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.05))",
                  }}
                />
              </motion.div>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Bạn đã đọc hết mọi thông báo!
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </List>
  );
};
