import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore, MenuOpen, Menu } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { allMenuItems } from "./navigationConfig";

const getRoleColor = (role) => {
  switch (role) {
    case "ADMIN":
    case "ROLE_ADMIN":
      return "#d32f2f";
    case "STUDENT":
    case "ROLE_STUDENT":
      return "#388e3c";
    case "UNIVERSITY_REP":
    case "ROLE_UNIVERSITY_REP":
      return "#9c27b0";
    case "COMPANY_REP":
    case "ROLE_COMPANY_REP":
      return "#ed6c02";
    case "TEACHER":
    case "ROLE_TEACHER":
    case "COMPANY_MENTOR":
    case "ROLE_COMPANY_MENTOR":
    case "MENTOR":
    case "ROLE_MENTOR":
      return "#1976d2";
    default:
      return "#666";
  }
};

export const Sidebar = ({
  user,
  expandedItems,
  handleMenuToggle,
  handleNavigate,
  isActive,
  isCollapsed,
  setIsCollapsed,
}) => {
  const onMenuParentClick = (index) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      // Wait for it to expand before toggling child menu if it was not expanded
      if (!expandedItems[index]) {
        setTimeout(() => handleMenuToggle(index), 100);
      }
    } else {
      handleMenuToggle(index);
    }
  };

  const getFilteredMenuItems = () => {
    if (!user) return [];
    const userRole = user?.role;
    return allMenuItems
      .filter((item) => item.roles.includes(userRole))
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter(
              (child) => !child.roles || child.roles.includes(userRole)
            ),
          };
        }
        return item;
      });
  };
  const filteredMenuItems = getFilteredMenuItems();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          p: 2,
          background: (theme) => theme.palette.mode === 'dark' 
            ? "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)"
            : "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
          backdropFilter: "blur(10px)",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          flexDirection: isCollapsed ? "column" : "row",
        }}
      >
        <Box sx={{ display: isCollapsed ? "none" : "block", overflow: "hidden" }}>
          <Typography
            sx={{ fontWeight: "800", mb: 0.2, letterSpacing: "0.5px", whiteSpace: "nowrap", fontSize: "1.1rem" }}
          >
            📚 Internship System
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, whiteSpace: "nowrap", display: "block" }}>
            Management Platform
          </Typography>
        </Box>
        
        {isCollapsed && (
          <Typography variant="h6" sx={{ mb: 1 }}>📚</Typography>
        )}

        <IconButton 
          size="small"
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{ 
            color: "text.primary",
            bgcolor: "action.hover",
            "&:hover": { bgcolor: "action.selected" },
            ml: isCollapsed ? 0 : 1,
          }}
        >
          {isCollapsed ? <Menu fontSize="small" /> : <MenuOpen fontSize="small" />}
        </IconButton>
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
                  <Tooltip title={isCollapsed ? item.label : ""} placement="right" arrow>
                    <ListItem
                      component="div"
                      onClick={() => onMenuParentClick(index)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "12px",
                        mb: 0.5,
                        backgroundColor: expandedItems[index] && !isCollapsed
                          ? "action.selected"
                          : "transparent",
                        transition: "all 0.3s ease",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        px: isCollapsed ? 1 : 2,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: "primary.light", minWidth: isCollapsed ? "auto" : 42, justifyContent: "center" }}>
                        {item.icon}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontWeight: 600,
                              color: "text.primary",
                            }}
                          />
                          {expandedItems[index] ? (
                            <ExpandLess sx={{ color: "text.secondary" }} />
                          ) : (
                            <ExpandMore sx={{ color: "text.secondary" }} />
                          )}
                        </>
                      )}
                    </ListItem>
                  </Tooltip>
                </motion.div>

                <Collapse in={expandedItems[index] && !isCollapsed} timeout="auto">
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
                              ? "action.selected"
                              : "transparent",
                            color: isActive(child.path) ? "primary.light" : "text.secondary",
                            "&:hover": {
                              backgroundColor: "action.hover",
                              color: "primary.light",
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
                <Tooltip title={isCollapsed ? item.label : ""} placement="right" arrow>
                  <ListItem
                    component="div"
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "12px",
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      px: isCollapsed ? 1 : 2,
                      backgroundColor: isActive(item.path)
                        ? "action.selected"
                        : "transparent",
                      borderLeft: isActive(item.path) && !isCollapsed
                        ? "4px solid"
                        : "4px solid transparent",
                      borderColor: isActive(item.path) && !isCollapsed ? "primary.main" : "transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive(item.path) ? "primary.light" : "text.secondary",
                        minWidth: isCollapsed ? "auto" : 42,
                        justifyContent: "center"
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: isActive(item.path) ? 700 : 500,
                          color: isActive(item.path) ? "primary.light" : "text.primary",
                        }}
                      />
                    )}
                  </ListItem>
                </Tooltip>
              </motion.div>
            )}
          </Box>
        ))}
      </List>

      <Box
        sx={{
          p: isCollapsed ? 1 : 2.5,
          background: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
          <Paper
            elevation={0}
            sx={{
              p: isCollapsed ? 1 : 1.5,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
              border: 1,
              borderColor: "divider",
              borderRadius: isCollapsed ? "50%" : 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {/* Cột trái: Avatar */}
            <Tooltip title={isCollapsed ? (user?.fullName || user?.username) : ""} placement="right">
              <Avatar
                src={user?.avatarUrl}
                sx={{
                  width: isCollapsed ? 40 : 48,
                  height: isCollapsed ? 40 : 48,
                  border: "2px solid #ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  bgcolor: getRoleColor(user?.role),
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: isCollapsed ? "1rem" : "1.2rem",
                  transition: "all 0.3s ease",
                }}
              >
                {!user?.avatarUrl &&
                  (user?.fullName?.charAt(0).toUpperCase() ||
                    user?.username?.charAt(0).toUpperCase())}
              </Avatar>
            </Tooltip>

            {/* Cột phải: Text */}
            {!isCollapsed && (
              <Box sx={{ overflow: "hidden", flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 0.2,
                    color: "text.secondary",
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
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
                      : user?.role?.includes("STUDENT")
                        ? "Student"
                        : user?.role?.includes("UNIVERSITY_REP")
                          ? "Đại diện trường"
                          : user?.role?.includes("COMPANY_REP")
                            ? "Đại diện doanh nghiệp"
                            : user?.role?.includes("COMPANY_MENTOR")
                              ? "Cố vấn DN"
                              : user?.role?.includes("TEACHER")
                                ? "Giáo viên"
                                : "Mentor"
                  }
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: `${getRoleColor(user?.role)}15`,
                    color: getRoleColor(user?.role),
                    fontWeight: "800",
                    border: `1px solid ${getRoleColor(user?.role)}40`,
                  }}
                />
              </Box>
            )}
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};
