import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  IconButton,
  Divider,
  List,
  ListItem,
  Avatar,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const ReportHistoryList = ({
  myReports,
  isLoadingHistory,
  handleDownload
}) => {
  return (
    <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.light", mb: 2 }}>
        Lịch sử nộp bài của bạn
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {isLoadingHistory ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={30} />
        </Box>
      ) : myReports.length > 0 ? (
        <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
          {myReports.map((report, index) => (
            <ListItem
              key={report.reportId || index}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                flexDirection: "column",
                alignItems: "stretch",
                bgcolor: report.reportStatus === "GRADED" ? "#f8fafc" : "#ffffff",
                "&:hover": { borderColor: "#cbd5e1", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
              }}
            >
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" width="100%">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ flex: 1 }}
                >
                  <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0284c7" }}>
                    <AssignmentIcon />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.05rem" }}>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                      Ngày nộp: <span style={{ fontWeight: 500, color: "text.secondary" }}>{report.uploadTime}</span>
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                      File gốc: {report.originalFileName}
                    </Typography>
                  </Box>
                </Stack>

                {/* Nút tải về góc phải */}
                <IconButton color="primary" onClick={() => handleDownload(report)} sx={{ bgcolor: "#f1f5f9" }}>
                  <DownloadIcon />
                </IconButton>
              </Stack>

              {/* KHU VỰC HIỂN THỊ ĐIỂM & NHẬN XÉT */}
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px dashed #e2e8f0" }}>
                {report.reportStatus === "GRADED" ? (
                  <Box sx={{ p: 2, bgcolor: "#ecfdf5", borderRadius: 2, border: "1px solid #a7f3d0" }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <StarIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                      <Typography variant="subtitle2" sx={{ color: "#065f46", fontWeight: 800, fontSize: "0.95rem" }}>
                        Điểm đánh giá: {report.score} / 10
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#047857", lineHeight: 1.5 }}>
                      <strong>Nhận xét từ Mentor:</strong> {report.feedback || "Không có nhận xét thêm."}
                    </Typography>
                  </Box>
                ) : (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PendingActionsIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: "#d97706", fontWeight: 600 }}>
                      Trạng thái: Đang chờ Mentor chấm điểm...
                    </Typography>
                  </Stack>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <AssignmentIcon sx={{ fontSize: 48, opacity: 0.4, mb: 1 }} />
          <Typography>Bạn chưa nộp báo cáo nào.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ReportHistoryList;
