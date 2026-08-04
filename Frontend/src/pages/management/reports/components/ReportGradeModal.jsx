
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Button,
  CircularProgress
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import StarIcon from "@mui/icons-material/Star";

const ReportGradeModal = ({
  open,
  onClose,
  selectedReport,
  gradeData,
  setGradeData,
  submittingGrade,
  onSubmit
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)" },
        },
      }}
      PaperProps={{
        sx: { borderRadius: "20px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
          <EditNoteIcon color="primary" fontSize="large" /> Đánh giá Báo cáo
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 1 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Sinh viên: <strong style={{ color: "text.primary" }}>{selectedReport?.studentName}</strong> ({selectedReport?.studentCode})
          <br />
          Bài nộp: <strong style={{ color: "text.primary" }}>{selectedReport?.title}</strong>
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Điểm số (Thang điểm 10)"
            type="number"
            variant="outlined"
            fullWidth
            value={gradeData.score}
            onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
            InputProps={{
              endAdornment: <InputAdornment position="end">/ 10</InputAdornment>,
              inputProps: { min: 0, max: 10, step: 0.1 }
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <TextField
            label="Nhận xét của Mentor"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            placeholder="Nhập đánh giá, góp ý cho sinh viên..."
            value={gradeData.feedback}
            onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={submittingGrade}
          sx={{ borderRadius: "10px", fontWeight: 700, color: "text.secondary", borderColor: "#cbd5e1" }}
        >
          Hủy Bỏ
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={submittingGrade}
          startIcon={submittingGrade ? <CircularProgress size={20} color="inherit" /> : <StarIcon />}
          sx={{
            borderRadius: "10px", fontWeight: 800,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            "&:hover": { background: "linear-gradient(135deg, #059669 0%, #047857 100%)" },
          }}
        >
          {submittingGrade ? "Đang xử lý..." : "Lưu Điểm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportGradeModal;
