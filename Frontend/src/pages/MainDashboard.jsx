import { useContext } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import AdminDashboard from "./admin/AdminDashboard";
import MentorDashboard from "./mentors/MentorDashboard";
import StudentDashboard from "./students/StudentDashboard";

const MainDashboard = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box sx={{ p: 4 }}>
          <Typography color="error">Không tìm thấy thông tin tài khoản!</Typography>
        </Box>
      </motion.div>
    );
  }

  const role = user.role;

  if (role === "ROLE_ADMIN" || role === "ADMIN") {
    return <AdminDashboard />;
  }
  else if (role === "ROLE_MENTOR" || role === "MENTOR") {
    return <MentorDashboard />;
  }
  else if (role === "ROLE_STUDENT" || role === "STUDENT") {
    return <StudentDashboard />;
  }
  else {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" color="error">
            Vai trò (Role) của bạn không hợp lệ hoặc chưa được cấp quyền truy cập bảng điều khiển.
          </Typography>
        </Box>
      </motion.div>
    );
  }
};

export default MainDashboard;