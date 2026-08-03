import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box,
  MenuItem
} from "@mui/material";

const FinalGradeModal = ({
  open,
  onClose,
  selectedForm,
  gradeData,
  setGradeData,
  submittingGrade,
  onSubmit
}) => {
  if (!selectedForm) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Chấm Điểm Cuối Kỳ</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sinh viên: <b>{selectedForm.studentName}</b> ({selectedForm.studentCode || selectedForm.studentId})
        </Typography>

        <Box display="flex" flexDirection="column" gap={2.5}>
          <TextField
            label="Trạng thái duyệt *"
            select
            fullWidth
            value={gradeData.status}
            onChange={(e) => setGradeData({ ...gradeData, status: e.target.value })}
            variant="outlined"
          >
            <MenuItem value="APPROVED">Duyệt hoàn thành</MenuItem>
            <MenuItem value="REJECTED">Từ chối / Yêu cầu chỉnh sửa</MenuItem>
          </TextField>

          <TextField
            label="Điểm của Giáo Viên *"
            type="number"
            fullWidth
            value={gradeData.score}
            onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
            placeholder="Điểm từ 0 đến 10"
            variant="outlined"
            inputProps={{ min: 0, max: 10, step: 0.1 }}
          />

          <TextField
            label="Nhận xét của Giáo Viên"
            multiline
            rows={4}
            fullWidth
            value={gradeData.feedback}
            onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
            placeholder="Viết nhận xét đánh giá tổng quan..."
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submittingGrade}>
          Hủy bỏ
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={submittingGrade}
          startIcon={submittingGrade ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ borderRadius: "8px", px: 3 }}
        >
          {submittingGrade ? "Đang lưu..." : "Lưu Điểm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FinalGradeModal;
