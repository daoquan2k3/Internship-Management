import { useEffect, useState, useContext } from "react";
import { Box, Typography, Grid, Chip, Button, CircularProgress, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  internshipAssignmentApi,
} from "../../../api/resourceApi";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import FlagIcon from "@mui/icons-material/Flag";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { AuthContext } from "../../../context/AuthContext";

import AssignmentInfoCard from "./components/AssignmentInfoCard";
import StudentListCard from "./components/StudentListCard";

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await internshipAssignmentApi.getAssignmentById(id);
        const data = res?.data || res;
        setDetail(data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết:", err);
        toast.error("Không thể tải thông tin chi tiết.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case "COMPLETED": return { label: "Đã hoàn thành", color: "#2e7d32", bg: "#e8f5e9", icon: <CheckCircleIcon /> };
      case "IN_PROGRESS": return { label: "Đang thực hiện", color: "primary.main", bg: "#e3f2fd", icon: <PendingActionsIcon /> };
      case "PENDING": return { label: "Chờ duyệt", color: "#ed6c02", bg: "#fff3e0", icon: <AccessTimeIcon /> };
      case "CANCELLED": return { label: "Đã hủy", color: "#d32f2f", bg: "#ffebee", icon: <FlagIcon /> };
      default: return { label: "Chờ duyệt", color: "#ed6c02", bg: "#fff3e0", icon: <AccessTimeIcon /> };
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>;
  if (!detail) return <Typography sx={{ p: 4 }}>Không tìm thấy dữ liệu nhóm phân công.</Typography>;

  const statusStyle = getStatusInfo(detail.status);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "background.default" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ fontWeight: 700, color: "text.secondary" }}>
          Quay lại
        </Button>
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <Chip icon={statusStyle.icon} label={statusStyle.label} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 800, p: 2, borderRadius: "12px" }} />
        </motion.div>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <AssignmentInfoCard detail={detail} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <StudentListCard students={detail.students} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentDetail;
