import { useState, useContext, useEffect } from "react";
import { Drawer, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { LogoutDialog } from "./LogoutDialog";
import { allMenuItems } from "./navigationConfig";

const drawerWidth = 280;

export const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

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
        navigate("/settings");
      }
    }
  }, [location.pathname, user, navigate]);

  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedItems = { ...expandedItems };
    let hasChanges = false;
    const userRole = user?.role;
    const filteredMenuItems = allMenuItems.filter((item) => item.roles.includes(userRole));

    filteredMenuItems.forEach((item, index) => {
      if (item.children) {
        const isChildActive = item.children.some((child) =>
          currentPath.includes(child.path)
        );
        if (isChildActive && !newExpandedItems[index]) {
          newExpandedItems[index] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedItems(newExpandedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, user]);

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

  return (
    <>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <TopBar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          handleOpenLogoutDialog={handleOpenLogoutDialog}
        />

        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
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
            <Sidebar
              user={user}
              expandedItems={expandedItems}
              handleMenuToggle={handleMenuToggle}
              handleNavigate={handleNavigate}
              isActive={isActive}
            />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              },
            }}
            open
          >
            <Sidebar
              user={user}
              expandedItems={expandedItems}
              handleMenuToggle={handleMenuToggle}
              handleNavigate={handleNavigate}
              isActive={isActive}
            />
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 4 },
            mt: 8,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: "background.default",
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

      <LogoutDialog
        open={logoutDialogOpen}
        handleClose={handleCloseLogoutDialog}
        confirmLogout={confirmLogout}
      />
    </>
  );
};
