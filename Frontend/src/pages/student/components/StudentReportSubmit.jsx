import { useState, useEffect } from "react";
import { Box, Typography, Stack, CircularProgress, Alert } from "@mui/material";
import { reportApi, assessmentRoundsApi } from "../../../api/resourceApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import RoundReportCard from "./RoundReportCard";

const StudentReportSubmit = ({ classId }) => {
  const [assessmentRounds, setAssessmentRounds] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load both rounds and reports in parallel
      const [roundsRes, reportsRes] = await Promise.all([
        classId ? assessmentRoundsApi.getAllRounds("", "", classId, 0, 100) : Promise.resolve({ content: [] }),
        reportApi.getMyReports()
      ]);

      setAssessmentRounds(roundsRes?.content || []);
      setMyReports(reportsRes?.content || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setError("Không thể tải danh sách đợt báo cáo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  const handleDownload = async (report) => {
    const fileUrl = report.fileUrl;
    const fileName = report.originalFileName;

    if (!fileUrl) {
      toast.error("Không tìm thấy đường dẫn tải về!");
      return;
    }

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Tải xuống thành công!");
    } catch (error) {
      console.error("Lỗi download:", error);
      toast.error("Tải xuống thất bại.");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Find reports that don't belong to any round (legacy generic reports)
  const legacyReports = myReports.filter((r) => !r.roundId);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "80vh" }}
    >
      <Box sx={{ mb: 4, maxWidth: 800, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: (theme) => theme.palette.mode === 'dark' ? "primary.light" : "primary.main", mb: 1, letterSpacing: "-0.5px" }}
        >
          Nộp Báo cáo Tiến độ
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bạn cần hoàn thành báo cáo cho từng đợt theo thời hạn quy định.
        </Typography>
      </Box>

      <Stack spacing={4} sx={{ maxWidth: 800, mx: "auto" }}>
        {assessmentRounds.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Hiện tại chưa có yêu cầu nộp báo cáo nào từ giáo viên.
          </Alert>
        ) : (
          assessmentRounds.map((round) => {
            const roundId = round.id || round.roundId;
            const report = myReports.find((r) => r.roundId === roundId);
            return (
              <RoundReportCard
                key={roundId}
                round={round}
                report={report}
                onUploadSuccess={loadData}
                handleDownload={handleDownload}
              />
            );
          })
        )}

        {/* Báo cáo mồ côi (nếu có do dữ liệu cũ) */}
        {legacyReports.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
              Các báo cáo chung (Dữ liệu cũ)
            </Typography>
            {legacyReports.map((report) => (
              <RoundReportCard
                key={report.reportId}
                round={{ roundName: "Báo cáo không thuộc đợt nào", startDate: report.uploadTime, endDate: report.uploadTime, description: "Báo cáo này được tạo trước khi hệ thống cập nhật đợt nộp." }}
                report={report}
                onUploadSuccess={loadData}
                handleDownload={handleDownload}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default StudentReportSubmit;