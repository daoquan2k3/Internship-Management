import { useEffect, useState, useContext } from "react";
import { Box, Typography, Grid, Chip, Button, CircularProgress, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  assessmentResultApi,
  assessmentRoundsApi,
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
import GradingTable from "./components/GradingTable";

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingGrades, setSavingGrades] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedCriterionId, setSelectedCriterionId] = useState("");

  const [rounds, setRounds] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const { user } = useContext(AuthContext);
  const isRoleNotAllowed = (role) => ["ROLE_STUDENT", "ROLE_ADMIN", "ROLE_COMPANY_REP", "COMPANY_REP"].includes(role);

  const [grades, setGrades] = useState({});

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await internshipAssignmentApi.getAssignmentById(id);
        const data = res?.data || res;
        setDetail(data);

        if (data && data.students) {
          const initialGrades = {};
          data.students.forEach((student) => {
            initialGrades[student.id] = { score: "", contribution: "100%", comment: "" };
          });
          setGrades(initialGrades);
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết:", err);
        toast.error("Không thể tải thông tin chi tiết.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const res = await assessmentRoundsApi.getAllRounds("", "", 0, 100);
        setRounds(res?.content || res?.data || []);
      } catch (err) {
        console.error("Lỗi load rounds:", err);
      }
    };
    fetchRounds();
  }, []);

  useEffect(() => {
    if (selectedRoundId && selectedCriterionId) {
      const fetchExistingGrades = async () => {
        try {
          const res = await assessmentResultApi.getAllResults(null, 0, 1000, "");
          let existingData = res?.content || res?.data?.content || [];
          existingData = existingData.filter(
            (item) => item.assignmentId === parseInt(id) &&
              item.roundId === parseInt(selectedRoundId) &&
              item.criterionId === parseInt(selectedCriterionId)
          );

          setGrades((prevGrades) => {
            const newGrades = { ...prevGrades };
            Object.keys(newGrades).forEach((studentId) => {
              newGrades[studentId] = { score: "", contribution: "100%", comment: "" };
            });
            existingData.forEach((item) => {
              if (newGrades[item.studentId]) {
                newGrades[item.studentId] = {
                  score: item.score !== null ? item.score : "",
                  contribution: item.contribution || "100%",
                  comment: item.comments || item.comment || "",
                };
              }
            });
            return newGrades;
          });
        } catch (err) {
          console.error("Lỗi lấy điểm cũ:", err);
        }
      };
      fetchExistingGrades();
    }
  }, [id, selectedRoundId, selectedCriterionId]);

  const handleRoundChange = async (event) => {
    const roundId = event.target.value;
    setSelectedRoundId(roundId);
    setSelectedCriterionId("");
    setCriteria([]);
    try {
      const res = await assessmentRoundsApi.getRoundById(roundId);
      const roundData = res?.data || res;
      setCriteria(roundData?.roundCriteria || []);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được tiêu chí");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "COMPLETED": return { label: "Đã hoàn thành", color: "#2e7d32", bg: "#e8f5e9", icon: <CheckCircleIcon /> };
      case "IN_PROGRESS": return { label: "Đang thực hiện", color: "primary.main", bg: "#e3f2fd", icon: <PendingActionsIcon /> };
      case "PENDING": return { label: "Chờ duyệt", color: "#ed6c02", bg: "#fff3e0", icon: <AccessTimeIcon /> };
      case "CANCELLED": return { label: "Đã hủy", color: "#d32f2f", bg: "#ffebee", icon: <FlagIcon /> };
      default: return { label: "Chờ duyệt", color: "#ed6c02", bg: "#fff3e0", icon: <AccessTimeIcon /> };
    }
  };

  const handleGradeChange = (studentId, field, value) => {
    setGrades((prev) => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
  };

  const handleSaveAllGrades = async () => {
    try {
      if (!selectedRoundId || !selectedCriterionId) {
        toast.warning("Vui lòng chọn đầy đủ Vòng đánh giá và Tiêu chí trước khi chấm điểm!");
        return;
      }
      setSavingGrades(true);
      const payload = {
        assignmentId: id,
        roundId: parseInt(selectedRoundId),
        criterionId: parseInt(selectedCriterionId),
        evaluations: Object.keys(grades).map((studentId) => ({
          studentId: parseInt(studentId),
          score: parseFloat(grades[studentId].score) || 0,
          contribution: grades[studentId].contribution,
          comment: grades[studentId].comment,
        })),
      };

      await assessmentResultApi.saveBulkGrades(payload);
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Đã lưu điểm cho toàn bộ nhóm thành công!");
    } catch (error) {
      console.error("Lỗi lưu điểm:", error);
      const backendMessage = error.response?.data?.message;
      const backendErrors = error.response?.data?.error;
      if (backendMessage && backendMessage !== "Validation failed") toast.error(`❌ Lỗi: ${backendMessage}`, { autoClose: 5000 });
      else if (backendErrors && Object.keys(backendErrors).length > 0) toast.error(`❌ Cảnh báo: ${Object.values(backendErrors)[0]}`, { autoClose: 5000 });
      else toast.error("❌ Không thể lưu điểm, vui lòng kiểm tra lại.");
    } finally {
      setSavingGrades(false);
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>;
  if (!detail) return <Typography sx={{ p: 4 }}>Không tìm thấy dữ liệu nhóm phân công.</Typography>;

  const statusStyle = getStatusInfo(detail.status);
  const currentCriterion = criteria.find((c) => (c.criterionId || c.id) === parseInt(selectedCriterionId));
  const maxScoreAllowed = currentCriterion?.maxScore || 10;

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
          <GradingTable
            detail={detail} rounds={rounds} criteria={criteria}
            selectedRoundId={selectedRoundId} selectedCriterionId={selectedCriterionId}
            handleRoundChange={handleRoundChange} setSelectedCriterionId={setSelectedCriterionId}
            isRoleNotAllowed={isRoleNotAllowed} user={user} grades={grades}
            handleGradeChange={handleGradeChange} maxScoreAllowed={maxScoreAllowed}
            savingGrades={savingGrades} handleSaveAllGrades={handleSaveAllGrades}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <StudentListCard students={detail.students} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentDetail;
