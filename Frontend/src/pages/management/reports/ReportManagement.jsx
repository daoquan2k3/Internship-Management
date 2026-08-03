import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Button,
  Chip,
  Divider,
  TextField,
  Tabs,
  Tab,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import ScoreIcon from "@mui/icons-material/Score";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { reportApi, assessmentRoundsApi } from "../../../api/resourceApi";
import { universityClassApi, finalEvaluationFormApi, internshipPlacementApi } from "../../../api/universityApi";
import { AuthContext } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ReportGradeModal from "./components/ReportGradeModal";
import ReportCardItem from "./components/ReportCardItem";
import FinalGradeModal from "./components/FinalGradeModal";

const statusLabelMap = {
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  PENDING: "Chờ duyệt",
};

const statusColorMap = {
  APPROVED: "success",
  REJECTED: "error",
  PENDING: "warning",
};

const ReportManagement = () => {
  const { user } = useContext(AuthContext);
  const isTeacher = user?.role === "TEACHER" || user?.role === "ROLE_TEACHER";

  const [currentTab, setCurrentTab] = useState(0); // 0: Báo cáo theo giai đoạn, 1: Báo cáo cuối kỳ
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);

  // --- STATE CHO CHỨC NĂNG CHẤM ĐIỂM ---
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [gradeData, setGradeData] = useState({ score: "", feedback: "" });
  const [submittingGrade, setSubmittingGrade] = useState(false);

  // --- STATE CHO AI ---
  const [analyzingId, setAnalyzingId] = useState(null);

  // --- STATE CHO VÒNG / TUẦN ĐÁNH GIÁ ---
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);

  // --- STATE CHO BÁO CÁO CUỐI KỲ ---
  const [finalForms, setFinalForms] = useState([]);
  const [loadingFinalForms, setLoadingFinalForms] = useState(false);
  const [processingHardCopyId, setProcessingHardCopyId] = useState(null);

  // --- STATE CHO CHẤM ĐIỂM CUỐI KỲ CỦA GIÁO VIÊN ---
  const [openFinalGradeDialog, setOpenFinalGradeDialog] = useState(false);
  const [selectedFinalForm, setSelectedFinalForm] = useState(null);
  const [finalGradeData, setFinalGradeData] = useState({ status: "APPROVED", score: "", feedback: "" });
  const [submittingFinalGrade, setSubmittingFinalGrade] = useState(false);

  // --- STATE CHO DIALOG CHỈNH SỬA ĐIỂM DOANH NGHIỆP ---
  const [openScoreDialog, setOpenScoreDialog] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [submittingScore, setSubmittingScore] = useState(false);

  // --- STATE CHO PHÂN BỔ THỰC TẬP (PLACEMENTS) ---
  const [placements, setPlacements] = useState([]);
  const [loadingPlacements, setLoadingPlacements] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.userId) return;
      try {
        const res = await universityClassApi.getMyClasses(1, 100);
        setClasses(res?.content || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách lớp:", error);
      }
    };
    fetchClasses();
  }, [user]);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const classIdParam = selectedClass ? selectedClass.classId : "";
      const res = await reportApi.getAllReports("", 0, 100, classIdParam);
      setReports(res?.content || []);
    } catch (err) {
      console.error("Lỗi khi tải báo cáo:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (currentTab === 0) {
      fetchReports();
    }
  }, [currentTab, fetchReports]);

  useEffect(() => {
    const fetchRounds = async () => {
      if (currentTab !== 0) return;
      try {
        const classIdParam = selectedClass ? selectedClass.classId : "";
        const res = await assessmentRoundsApi.getAllRounds("", "", classIdParam, 0, 100);
        setRounds(res?.content || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tuần/vòng đánh giá:", error);
      }
    };
    fetchRounds();
  }, [selectedClass, currentTab]);

  const fetchFinalForms = useCallback(async () => {
    try {
      setLoadingFinalForms(true);
      const classIdParam = selectedClass ? selectedClass.classId : "";
      if (!isTeacher && !classIdParam) {
        setFinalForms([]);
        setLoadingFinalForms(false);
        return;
      }
      let res;
      if (isTeacher) {
        res = await finalEvaluationFormApi.getFormsForTeacher(classIdParam, 1, 100);
      } else {
        res = await finalEvaluationFormApi.getFormsByClass(classIdParam, 1, 100);
      }
      setFinalForms(res?.content || []);
    } catch (err) {
      console.error("Lỗi khi tải báo cáo cuối kỳ:", err);
      toast.error("Không thể tải danh sách báo cáo cuối kỳ.");
    } finally {
      setLoadingFinalForms(false);
    }
  }, [selectedClass, isTeacher]);

  useEffect(() => {
    if (currentTab === 1) {
      fetchFinalForms();
    }
  }, [currentTab, fetchFinalForms]);

  const fetchPlacements = useCallback(async () => {
    try {
      setLoadingPlacements(true);
      const classIdParam = selectedClass ? selectedClass.classId : "";
      if (!classIdParam) {
        setPlacements([]);
        setLoadingPlacements(false);
        return;
      }
      const res = await internshipPlacementApi.getPlacementsByClass(classIdParam, 1, 100);
      setPlacements(res?.content || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phân bổ:", err);
    } finally {
      setLoadingPlacements(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (currentTab === 2) {
      fetchPlacements();
    }
  }, [currentTab, fetchPlacements]);

  const handleUpdateHardCopy = async (formId, isSubmitted) => {
    setProcessingHardCopyId(formId);
    try {
      await finalEvaluationFormApi.updateHardCopyStatus(formId, isSubmitted);
      toast.success("Cập nhật trạng thái bản cứng thành công!");
      fetchFinalForms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật.");
      console.error(error);
    } finally {
      setProcessingHardCopyId(null);
    }
  };

  const handleOpenScoreDialog = (form) => {
    setEditingForm(form);
    setScoreInput(form.companyScore !== null && form.companyScore !== undefined ? String(form.companyScore) : "");
    setFeedbackInput(form.companyFeedback || "");
    setOpenScoreDialog(true);
  };

  const handleCloseScoreDialog = () => {
    setOpenScoreDialog(false);
    setEditingForm(null);
    setScoreInput("");
    setFeedbackInput("");
  };

  const handleSubmitScore = async () => {
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 0 || score > 10) {
      toast.warning("Vui lòng nhập điểm hợp lệ từ 0 đến 10!");
      return;
    }
    try {
      setSubmittingScore(true);
      await finalEvaluationFormApi.updateCompanyScore(editingForm.id || editingForm.formId, score, feedbackInput);
      toast.success("Cập nhật điểm doanh nghiệp thành công!");
      handleCloseScoreDialog();
      fetchFinalForms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể cập nhật điểm.");
      console.error(error);
    } finally {
      setSubmittingScore(false);
    }
  };

  const handleOpenFinalGradeDialog = (form) => {
    setSelectedFinalForm(form);
    setFinalGradeData({
      status: "APPROVED",
      score: form.teacherScore !== null && form.teacherScore !== undefined ? String(form.teacherScore) : "",
      feedback: form.teacherFeedback || ""
    });
    setOpenFinalGradeDialog(true);
  };

  const handleCloseFinalGradeDialog = () => {
    setOpenFinalGradeDialog(false);
    setSelectedFinalForm(null);
  };

  const handleEvaluateByTeacher = async () => {
    if (finalGradeData.status === "APPROVED" && (!finalGradeData.score || finalGradeData.score < 0 || finalGradeData.score > 10)) {
      toast.warning("Vui lòng nhập điểm hợp lệ từ 0 đến 10!");
      return;
    }

    try {
      setSubmittingFinalGrade(true);
      await finalEvaluationFormApi.evaluateByTeacher(selectedFinalForm.id || selectedFinalForm.formId, {
        status: finalGradeData.status,
        teacherScore: parseFloat(finalGradeData.score) || null,
        teacherFeedback: finalGradeData.feedback
      });
      toast.success(`Đã ${finalGradeData.status === 'APPROVED' ? 'duyệt hoàn thành' : 'từ chối'} phiếu đánh giá cuối kỳ!`);
      handleCloseFinalGradeDialog();
      fetchFinalForms();
    } catch (error) {
      console.error("Lỗi duyệt phiếu:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái lúc này!");
    } finally {
      setSubmittingFinalGrade(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      toast.info("Đang khởi tạo dữ liệu Excel...");
      const classIdParam = selectedClass ? selectedClass.classId : "";
      const response = await reportApi.exportExcel(searchTerm, 0, 100, classIdParam);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bao_Cao_Thuc_Tap_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Xuất file thành công!");
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      toast.error("Không thể xuất file. Vui lòng thử lại!");
    } finally {
      setExporting(false);
    }
  };

  const handleExportZip = async () => {
    try {
      setExportingZip(true);
      toast.info("Đang nén toàn bộ file, vui lòng đợi...");
      const classIdParam = selectedClass ? selectedClass.classId : "";
      const response = await reportApi.exportZip(searchTerm, 0, 100, classIdParam);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Tat_Ca_Bao_Cao_${new Date().getTime()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tải toàn bộ báo cáo thành công!");
    } catch (error) {
      console.error("Lỗi xuất ZIP:", error);
      toast.error("Không thể nén file. Vui lòng thử lại!");
    } finally {
      setExportingZip(false);
    }
  };

  const handleExportFinalExcel = async () => {
    try {
      setExporting(true);
      toast.info("Đang khởi tạo dữ liệu Excel báo cáo cuối kỳ...");
      const classIdParam = selectedClass ? selectedClass.classId : "";
      const response = await finalEvaluationFormApi.exportExcel(classIdParam, searchTerm);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bao_Cao_Cuoi_Ky_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Xuất file Excel thành công!");
    } catch (error) {
      console.error("Lỗi xuất Excel cuối kỳ:", error);
      toast.error("Không thể xuất file. Vui lòng thử lại!");
    } finally {
      setExporting(false);
    }
  };

  const handleExportFinalZip = async () => {
    try {
      setExportingZip(true);
      toast.info("Đang nén toàn bộ file báo cáo cuối kỳ, vui lòng đợi...");
      const classIdParam = selectedClass ? selectedClass.classId : "";
      const response = await finalEvaluationFormApi.exportZip(classIdParam, searchTerm);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Tat_Ca_Bao_Cao_Cuoi_Ky_${new Date().getTime()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tải toàn bộ báo cáo cuối kỳ thành công!");
    } catch (error) {
      console.error("Lỗi xuất ZIP cuối kỳ:", error);
      toast.error("Không thể nén file. Vui lòng thử lại!");
    } finally {
      setExportingZip(false);
    }
  };

  const handleExportPlacements = async () => {
    try {
      setExporting(true);
      toast.info("Đang xuất danh sách phân bổ...");
      const classIdParam = selectedClass ? selectedClass.classId : "";
      const response = await internshipPlacementApi.exportExcel(classIdParam);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Danh_Sach_Phan_Bo_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Xuất danh sách phân bổ thành công!");
    } catch (error) {
      console.error("Lỗi xuất Excel phân bổ:", error);
      toast.error("Không thể xuất file. Vui lòng thử lại!");
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = async (report) => {
    const toastId = toast.loading("Đang xử lý tải file, vui lòng đợi...");
    try {
      if (!report.fileUrl) {
        toast.update(toastId, { render: "Không tìm thấy đường dẫn file!", type: "error", isLoading: false, autoClose: 3000 });
        return;
      }
      const response = await fetch(report.fileUrl, { method: "GET", mode: "cors" });
      if (!response.ok) throw new Error("Lỗi mạng");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileExtension = report.fileUrl.split('.').pop();
      const fallbackName = `Bao_cao_so_${report.reportId}.${fileExtension}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", report.originalFileName || fallbackName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.update(toastId, { render: "Tải xuống thành công!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      toast.update(toastId, { render: "Tải xuống thất bại. Vui lòng thử lại!", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  // --- XỬ LÝ MỞ DIALOG CHẤM ĐIỂM ---
  const handleOpenGradeDialog = (report) => {
    setSelectedReport(report);
    setGradeData({
      score: report.score || "",
      feedback: report.feedback || "",
    });
    setOpenGradeDialog(true);
  };

  const handleCloseGradeDialog = () => {
    setOpenGradeDialog(false);
    setSelectedReport(null);
  };

  const handleSubmitGrade = async () => {
    if (!gradeData.score || gradeData.score < 0 || gradeData.score > 10) {
      toast.warning("Vui lòng nhập điểm hợp lệ từ 0 đến 10!");
      return;
    }

    try {
      setSubmittingGrade(true);
      await reportApi.gradeReport(selectedReport.reportId, {
        score: parseFloat(gradeData.score),
        feedback: gradeData.feedback,
      });
      toast.success("Đã lưu điểm và gửi thông báo tới sinh viên!");
      handleCloseGradeDialog();
      fetchReports(); // Refresh lại danh sách để cập nhật UI
    } catch (error) {
      console.error("Lỗi chấm điểm:", error);
      toast.error("Không thể lưu điểm lúc này!");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const handleAnalyzeAI = async (report) => {
    try {
      setAnalyzingId(report.reportId);
      toast.info("AI đang phân tích báo cáo, vui lòng đợi...");
      await reportApi.analyzeReportAI(report.reportId);
      toast.success("Phân tích AI thành công!");
      fetchReports();
    } catch (error) {
      console.error("Lỗi phân tích AI:", error);
      toast.error(error.response?.data?.message || "Không thể phân tích báo cáo. Vui lòng thử lại!");
    } finally {
      setAnalyzingId(null);
    }
  };

  // Build danh sách options cho dropdown lọc theo tuần/vòng
  const roundOptions = useMemo(() => {
    const optionsMap = new Map();
    rounds.forEach((r) => {
      const id = r.id || r.roundId;
      if (id && r.roundName) {
        optionsMap.set(String(id), { id, roundName: r.roundName });
      }
    });
    // Tự động nhận diện từ danh sách reports nếu có đợt nộp chưa có trong map (hỗ trợ cả dữ liệu test cũ)
    reports.forEach((r) => {
      if (r.roundId && r.roundName && !optionsMap.has(String(r.roundId))) {
        optionsMap.set(String(r.roundId), { id: r.roundId, roundName: r.roundName });
      } else if (!r.roundId && r.title) {
        const match = r.title.match(/(tuần\s*\d+|vòng\s*\d+|đợt\s*\d+)/i);
        if (match) {
          const name = match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
          const fakeId = `title_${name}`;
          if (!optionsMap.has(fakeId)) {
            optionsMap.set(fakeId, { id: fakeId, roundName: name });
          }
        }
      }
    });
    return [{ id: null, roundName: "Tất cả các tuần" }, ...Array.from(optionsMap.values())];
  }, [rounds, reports]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentCode?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!selectedRound || selectedRound.id === null) return matchesSearch;

    const roundId = selectedRound.id;
    const roundName = (selectedRound.roundName || "").toLowerCase();

    const matchesRound =
      (report.roundId && (report.roundId === roundId || String(report.roundId) === String(roundId))) ||
      (report.roundName && report.roundName.toLowerCase() === roundName) ||
      (report.title && roundName && report.title.toLowerCase().includes(roundName));

    return matchesSearch && matchesRound;
  });

  const filteredFinalForms = finalForms.filter(
    (form) =>
      form.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(form.studentId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.className?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPlacements = placements.filter(
    (p) =>
      p.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* HEADER & SEARCH */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: "-0.5px" }}>
          Báo cáo & Đánh giá
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Danh sách báo cáo tiến độ, thiết lập vòng đánh giá giữa kỳ và đánh giá cuối kỳ do bạn phụ trách
        </Typography>
      </Box>

      {/* TABS & CLASS FILTER */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 4,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          bgcolor: "background.paper",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{
            "& .MuiTabs-indicator": { height: 3, borderRadius: 1.5 },
            "& .MuiTab-root": { fontWeight: 700, fontSize: "0.95rem", textTransform: "none", px: 3 },
          }}
        >
          <Tab label="Báo cáo theo giai đoạn" icon={<AssignmentTurnedInIcon />} iconPosition="start" />
          <Tab label="Báo cáo cuối kỳ" icon={<StarIcon />} iconPosition="start" />
          <Tab label="Phân bổ thực tập" icon={<PersonIcon />} iconPosition="start" />
        </Tabs>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          {/* Lớp phụ trách */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 250 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600} whiteSpace="nowrap">
              Lớp phụ trách:
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={[{ classId: null, className: "Tất cả các lớp" }, ...classes]}
              getOptionLabel={(option) => option.className + (option.academicYear ? ` (${option.academicYear})` : "")}
              value={selectedClass || { classId: null, className: "Tất cả các lớp" }}
              onChange={(_, newValue) => {
                if (!newValue || newValue.classId === null) {
                  setSelectedClass(null);
                } else {
                  setSelectedClass(newValue);
                }
                setSelectedRound(null); // Reset lọc theo tuần khi đổi lớp
              }}
              renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Chọn lớp" />}
              isOptionEqualToValue={(option, value) => option.classId === value?.classId}
              disableClearable
            />
          </Box>

          {/* Lọc theo tuần (Chỉ hiển thị ở Tab 0: Báo cáo theo giai đoạn) */}
          {currentTab === 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 220 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600} whiteSpace="nowrap">
                Tuần báo cáo:
              </Typography>
              <Autocomplete
                fullWidth
                size="small"
                options={roundOptions}
                getOptionLabel={(option) => option.roundName || ""}
                value={selectedRound || roundOptions[0]}
                onChange={(_, newValue) => {
                  if (!newValue || newValue.id === null) {
                    setSelectedRound(null);
                  } else {
                    setSelectedRound(newValue);
                  }
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Chọn tuần" />}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                disableClearable
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* SEARCH BAR */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, display: "flex", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <SearchIcon sx={{ color: "#9e9e9e", mr: 1, ml: 1 }} />
        <TextField
          fullWidth
          variant="outlined"
          placeholder={currentTab === 0 ? "Tìm kiếm theo tiêu đề, tên hoặc mã sinh viên..." : "Tìm kiếm theo tên sinh viên, mã SV hoặc lớp..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ "& fieldset": { border: "none" }, bgcolor: "background.paper", borderRadius: 2 }}
        />
      </Paper>

      {/* TAB 0: BÁO CÁO THEO GIAI ĐOẠN */}
      {currentTab === 0 && (
        <>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                disabled={exporting}
                onClick={handleExportExcel}
                startIcon={exporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
                sx={{ borderRadius: "12px", px: 3, py: 1.2, fontWeight: 700 }}
              >
                Xuất Data (Excel)
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                disabled={exportingZip}
                onClick={handleExportZip}
                startIcon={exportingZip ? <CircularProgress size={20} color="inherit" /> : <FolderZipIcon />}
                sx={{
                  borderRadius: "12px", px: 3, py: 1.2, fontWeight: 800,
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  boxShadow: "0 8px 25px rgba(30, 60, 114, 0.3)", textTransform: "none",
                  "&:hover": { background: "linear-gradient(135deg, #152b52 0%, #1c3869 100%)" },
                }}
              >
                {exportingZip ? "Đang nén file..." : "Tải toàn bộ File (ZIP)"}
              </Button>
            </motion.div>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3, alignItems: "stretch" }}>
              <AnimatePresence>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <ReportCardItem
                      key={report.reportId}
                      report={report}
                      index={index}
                      analyzingId={analyzingId}
                      handleAnalyzeAI={handleAnalyzeAI}
                      handleOpenGradeDialog={handleOpenGradeDialog}
                      handleDownload={handleDownload}
                    />
                  ))
                ) : (
                  <Box sx={{ gridColumn: "1 / -1", width: "100%", textAlign: "center", py: 8 }}>
                    <AssignmentTurnedInIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">Hiện chưa có báo cáo nào được tải lên trong lớp này.</Typography>
                  </Box>
                )}
              </AnimatePresence>
            </Box>
          )}
        </>
      )}

      {/* TAB 1: BÁO CÁO CUỐI KỲ */}
      {currentTab === 1 && (
        <>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                disabled={exporting}
                onClick={handleExportFinalExcel}
                startIcon={exporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
                sx={{ borderRadius: "12px", px: 3, py: 1.2, fontWeight: 700 }}
              >
                Xuất Data (Excel)
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                disabled={exportingZip}
                onClick={handleExportFinalZip}
                startIcon={exportingZip ? <CircularProgress size={20} color="inherit" /> : <FolderZipIcon />}
                sx={{
                  borderRadius: "12px", px: 3, py: 1.2, fontWeight: 800,
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  boxShadow: "0 8px 25px rgba(30, 60, 114, 0.3)", textTransform: "none",
                  "&:hover": { background: "linear-gradient(135deg, #152b52 0%, #1c3869 100%)" },
                }}
              >
                {exportingZip ? "Đang nén file..." : "Tải toàn bộ File (ZIP)"}
              </Button>
            </motion.div>
          </Box>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Mã SV</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Tên Sinh Viên</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Lớp</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Đơn đánh giá doanh nghiệp</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Điểm Doanh nghiệp</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Điểm Giáo viên</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Bản cứng</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Trạng thái duyệt</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }} align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingFinalForms ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <CircularProgress size={30} />
                      </TableCell>
                    </TableRow>
                  ) : filteredFinalForms.length > 0 ? (
                    filteredFinalForms.map((f) => (
                      <TableRow key={f.id || f.formId} sx={{ '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                        <TableCell sx={{ fontWeight: 600 }}>{f.studentCode || f.studentId}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>{f.studentName}</TableCell>
                        <TableCell>{f.className}</TableCell>
                        <TableCell>
                          {f.scannedFormUrl ? (
                            <Button
                              variant="outlined"
                              size="small"
                              component="a"
                              href={f.scannedFormUrl}
                              target="_blank"
                              rel="noreferrer"
                              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                            >
                              Xem file
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.disabled">Chưa nộp</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography fontWeight={700} color="secondary.main">
                              {f.companyScore !== null && f.companyScore !== undefined ? `${f.companyScore} Điểm` : "N/A"}
                            </Typography>
                            {f.companyFeedback && (
                              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block", maxWidth: 200 }}>
                                {f.companyFeedback}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography fontWeight={700} color="primary.main">
                              {f.teacherScore !== null && f.teacherScore !== undefined ? `${f.teacherScore} Điểm` : "Chưa chấm"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={f.isHardCopySubmitted ? 'Đã thu bản cứng' : 'Chưa thu'}
                            color={f.isHardCopySubmitted ? 'success' : 'warning'}
                            variant={f.isHardCopySubmitted ? 'filled' : 'outlined'}
                            size="small"
                            onClick={() => handleUpdateHardCopy(f.id || f.formId, !f.isHardCopySubmitted)}
                            disabled={processingHardCopyId === (f.id || f.formId)}
                            sx={{ cursor: 'pointer', fontWeight: 600, borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const st = f.universityRepStatus || f.status || f.teacherStatus || 'PENDING';
                            return (
                              <Chip
                                label={statusLabelMap[st] || st}
                                color={statusColorMap[st] || 'default'}
                                size="small"
                                sx={{ fontWeight: 600, borderRadius: 2 }}
                              />
                            );
                          })()}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            {(!f.teacherStatus || f.teacherStatus === 'PENDING') && (
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => handleOpenFinalGradeDialog(f)}
                                sx={{ textTransform: "none", borderRadius: 1.5 }}
                              >
                                Chấm điểm & Duyệt
                              </Button>
                            )}
                            <IconButton
                              size="small"
                              title="Chỉnh sửa điểm doanh nghiệp"
                              onClick={() => handleOpenScoreDialog(f)}
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' },
                                borderRadius: 1.5,
                                p: 0.8,
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          {(!isTeacher && (!selectedClass || !selectedClass.classId)) ? "Vui lòng chọn một lớp cụ thể để xem danh sách báo cáo cuối kỳ." : "Chưa có báo cáo cuối kỳ nào thuộc danh sách lớp được chọn."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        </>
      )}

      {/* TAB 2: DANH SÁCH PHÂN BỔ THỰC TẬP */}
      {currentTab === 2 && (
        <>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                disabled={exporting}
                onClick={handleExportPlacements}
                startIcon={exporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
                sx={{ borderRadius: "12px", px: 3, py: 1.2, fontWeight: 700 }}
              >
                Xuất Data (Excel)
              </Button>
            </motion.div>
          </Box>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Mã SV</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Tên Sinh Viên</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Lớp</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Doanh nghiệp tiếp nhận</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Mã số thuế</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Vị trí / CV</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Người hướng dẫn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingPlacements ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <CircularProgress size={30} />
                      </TableCell>
                    </TableRow>
                  ) : filteredPlacements.length > 0 ? (
                    filteredPlacements.map((p) => (
                      <TableRow key={p.placementId} sx={{ '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                        <TableCell sx={{ fontWeight: 600 }}>{p.studentCode}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>{p.studentName}</TableCell>
                        <TableCell>{p.className}</TableCell>
                        <TableCell>
                          <Typography fontWeight={600} color="secondary.main">{p.companyName}</Typography>
                        </TableCell>
                        <TableCell>{p.taxCode || "N/A"}</TableCell>
                        <TableCell>{p.position || "N/A"}</TableCell>
                        <TableCell>{p.mentorName || "Chưa phân công"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          {(!selectedClass || !selectedClass.classId) ? "Vui lòng chọn một lớp cụ thể để xem danh sách phân bổ." : "Chưa có dữ liệu phân bổ cho lớp này."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        </>
      )}

      {/* --- DIALOG CHẤM ĐIỂM BÁO CÁO --- */}
      <ReportGradeModal
        open={openGradeDialog}
        onClose={handleCloseGradeDialog}
        selectedReport={selectedReport}
        gradeData={gradeData}
        setGradeData={setGradeData}
        submittingGrade={submittingGrade}
        onSubmit={handleSubmitGrade}
      />

      {/* --- DIALOG CHẤM ĐIỂM BÁO CÁO CUỐI KỲ --- */}
      <FinalGradeModal
        open={openFinalGradeDialog}
        onClose={handleCloseFinalGradeDialog}
        selectedForm={selectedFinalForm}
        gradeData={finalGradeData}
        setGradeData={setFinalGradeData}
        submittingGrade={submittingFinalGrade}
        onSubmit={handleEvaluateByTeacher}
      />

      {/* --- DIALOG CHỈNH SỬA ĐIỂM DOANH NGHIỆP --- */}
      <Dialog
        open={openScoreDialog}
        onClose={handleCloseScoreDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, pb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ScoreIcon sx={{ color: 'warning.main' }} />
            <span>Chỉnh sửa Điểm Doanh nghiệp</span>
          </Stack>
          <IconButton size="small" onClick={handleCloseScoreDialog}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {editingForm && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Sinh viên: <b>{editingForm.studentName}</b> — Lớp: <b>{editingForm.className}</b>
              </Typography>
              <TextField
                label="Điểm doanh nghiệp (0 – 10)"
                type="number"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                fullWidth
                inputProps={{ min: 0, max: 10, step: 0.5 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><ScoreIcon fontSize="small" color="warning" /></InputAdornment>
                }}
                sx={{ mb: 2 }}
                helperText="Nhập điểm theo phiếu đánh giá có dấu mộc của công ty"
              />
              <TextField
                label="Nhận xét của doanh nghiệp (tuỳ chọn)"
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Điền nhận xét hoặc ghi chú từ phiếu đánh giá..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={handleCloseScoreDialog}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmitScore}
            variant="contained"
            color="warning"
            disabled={submittingScore}
            startIcon={submittingScore ? <CircularProgress size={16} color="inherit" /> : <ScoreIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            {submittingScore ? "Đang lưu..." : "Xác nhận lưu điểm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportManagement;
