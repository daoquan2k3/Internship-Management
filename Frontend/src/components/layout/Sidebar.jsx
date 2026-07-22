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
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { allMenuItems } from "./navigationConfig";

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

export const Sidebar = ({
  user,
  expandedItems,
  handleMenuToggle,
  handleNavigate,
  isActive,
}) => {
  const getFilteredMenuItems = () => {
    if (!user) return [];
    const userRole = user?.role;
    return allMenuItems.filter((item) => item.roles.includes(userRole));
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
          p: 2.5,
          background: (theme) => theme.palette.mode === 'dark' 
            ? "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)"
            : "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
          backdropFilter: "blur(10px)",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
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
                        ? "action.selected"
                        : "transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "primary.light", minWidth: 42 }}>
                      {item.icon}
                    </ListItemIcon>
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
                <ListItem
                  component="div"
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    backgroundColor: isActive(item.path)
                      ? "action.selected"
                      : "transparent",
                    borderLeft: isActive(item.path)
                      ? "4px solid"
                      : "4px solid transparent",
                    borderColor: isActive(item.path) ? "primary.main" : "transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? "primary.light" : "text.secondary",
                      minWidth: 42,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 700 : 500,
                      color: isActive(item.path) ? "primary.light" : "text.primary",
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
          background: "background.paper",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
              border: 1,
              borderColor: "divider",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {/* Cột trái: Avatar */}
            <Avatar
              src={user?.avatarUrl}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid #ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                bgcolor: getRoleColor(user?.role),
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "1.2rem",
              }}
            >
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
                    : user?.role?.includes("MENTOR")
                      ? "Mentor"
                      : "Student"
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
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};
