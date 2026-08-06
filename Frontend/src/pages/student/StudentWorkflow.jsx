import { useState, useEffect } from "react";
import { Box, Stepper, Step, StepLabel, Typography, Button, CircularProgress } from "@mui/material";
import { EmojiEvents as EmojiEventsIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import JoinUniversityStep from "./components/JoinUniversityStep";
import InternshipApplicationStep from "./components/InternshipApplicationStep";
import FinalEvaluationStep from "./components/FinalEvaluationStep";
import StudentReportSubmit from "./components/StudentReportSubmit";
import { universityJoinRequestApi, internshipApplicationApi, finalEvaluationFormApi } from "../../api/universityApi";

const steps = [
  "Gia nhập trường",
  "Nộp đơn vào lớp thực tập",
  "Báo cáo tiến độ",
  "Nộp phiếu đánh giá cuối kỳ"
];

const StudentWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Status records
  const [joinRequest, setJoinRequest] = useState(null);
  const [application, setApplication] = useState(null);
  const [activeAppCount, setActiveAppCount] = useState(0);
  const [finalForm, setFinalForm] = useState(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      // Fetch Join Request
      const joinRes = await universityJoinRequestApi.getMyRequests(1, 1);
      const latestJoin = joinRes?.content?.[0] || null;
      setJoinRequest(latestJoin);

      // Fetch Applications
      const appRes = await internshipApplicationApi.getMyApplications(1, 10);
      const allApps = appRes?.content || [];
      const latestApp = allApps[0] || null;
      setApplication(latestApp);

      const activeCount = allApps.filter(app => app.status === 'PENDING' || app.status === 'APPROVED').length;
      setActiveAppCount(activeCount);

      // Fetch Final Form
      const finalRes = await finalEvaluationFormApi.getMyForms(1, 1);
      const latestFinal = finalRes?.content?.[0] || null;
      setFinalForm(latestFinal);

      // Determine step
      if (!latestJoin || latestJoin.status !== "APPROVED") {
        setActiveStep(0);
      } else if (!latestApp || latestApp.status !== "APPROVED" || !latestApp.companyName) {
        setActiveStep(1);
      } else if (!latestFinal) {
        // Technically they can do progress reports during step 2. 
        // We'll let them submit final evaluation anytime after class approval, but typically after progress reports.
        setActiveStep(2);
      } else {
        const isApproved =
          latestFinal.universityRepStatus === "APPROVED" ||
          latestFinal.teacherStatus === "APPROVED" ||
          latestFinal.status === "APPROVED";
        if (!isApproved) {
          setActiveStep(3);
        } else {
          // Completed
          setActiveStep(4);
        }
      }

    } catch (error) {
      console.error("Lỗi lấy trạng thái:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary.main" mb={4}>
        Quy trình Thực tập
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2, mb: 4, minHeight: "40vh" }}>
        {activeStep === 0 && (
          <JoinUniversityStep joinRequest={joinRequest} onRefresh={fetchStatus} />
        )}
        {activeStep === 1 && (
          <InternshipApplicationStep application={application} activeAppCount={activeAppCount} universityId={joinRequest?.universityId} onRefresh={fetchStatus} />
        )}
        {activeStep === 2 && (
          <Box>
            <Box display="flex" justifyContent="flex-end" mb={3}>
              <Button variant="contained" color="primary" onClick={() => setActiveStep(3)} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)' }}>
                Đã hoàn thành các báo cáo? Nộp Phiếu cuối kỳ →
              </Button>
            </Box>
            <StudentReportSubmit classId={application?.classId} />
          </Box>
        )}
        {activeStep === 3 && (
          <FinalEvaluationStep finalForm={finalForm} classId={application?.classId} onRefresh={fetchStatus} onBack={() => setActiveStep(2)} />
        )}
        {activeStep === 4 && (
          <Box>
            {/* GIAI ĐOẠN CHÚC MỪNG HOÀN THÀNH THỰC TẬP HOÀNH TRÁNG */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 5,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)"
                    : "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                border: "2px solid #10b981",
                boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.3)",
                textAlign: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  bgcolor: "#10b981",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2.5,
                  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 52 }} />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 900, color: (theme) => theme.palette.mode === "dark" ? "#34d399" : "#047857", mb: 1.5, letterSpacing: "-0.5px" }}>
                🎉 CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH XUẤT SẮC KỲ THỰC TẬP! 🎉
              </Typography>
              <Typography variant="h6" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#6ee7b7" : "#065f46", fontWeight: 600, maxWidth: 700, mx: "auto", mb: 3, lineHeight: 1.6 }}>
                Tất cả các thủ tục từ xin phép, báo cáo tiến độ đến hồ sơ đánh giá cuối kỳ của bạn đã được Giảng viên và Khoa/Nhà trường phê duyệt hoàn tất.
              </Typography>

              {finalForm?.companyScore !== null && finalForm?.companyScore !== undefined && (
                <Box
                  sx={{
                    display: "inline-block",
                    px: 4,
                    py: 1.5,
                    bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
                    borderRadius: 4,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    border: "1px solid #6ee7b7",
                    mb: 3,
                  }}
                >
                  <Typography variant="caption" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#34d399" : "#059669", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
                    Điểm đánh giá doanh nghiệp
                  </Typography>
                  <Typography variant="h3" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#10b981" : "#047857", fontWeight: 900, mt: 0.5 }}>
                    {finalForm.companyScore} <Typography component="span" variant="h6" color="text.secondary">/ 10</Typography>
                  </Typography>
                </Box>
              )}

              {(finalForm?.companyFeedback || finalForm?.teacherFeedback || finalForm?.feedback) && (
                <Box sx={{ maxWidth: 650, mx: "auto", mb: 3, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", p: 2.5, borderRadius: 3, border: "1px dashed #34d399" }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: (theme) => theme.palette.mode === "dark" ? "#34d399" : "#059669", textTransform: "uppercase", display: "block", mb: 0.5 }}>
                    Lời nhận xét từ Giảng viên / Doanh nghiệp:
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: "italic", color: (theme) => theme.palette.mode === "dark" ? "#6ee7b7" : "#047857", fontWeight: 600 }}>
                    "{finalForm.companyFeedback || finalForm.teacherFeedback || finalForm.feedback}"
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#34d399" : "#059669", fontWeight: 600 }}>
                Chúc bạn tiếp tục gặt hái nhiều thành công và bước tiến vững chắc trên con đường sự nghiệp phía trước! 🚀
              </Typography>
            </Box>

            {/* HIỂN THỊ HỒ SƠ ĐÃ NỘP (VIEW-ONLY, KHÔNG CÓ NÚT NỘP LẠI) */}
            <FinalEvaluationStep finalForm={finalForm} classId={application?.classId} onRefresh={fetchStatus} onBack={() => setActiveStep(2)} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StudentWorkflow;
