import { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

const ReportUploadForm = ({
  title,
  setTitle,
  selectedFile,
  error,
  isUploading,
  handleFileChange,
  handleRemoveFile,
  handleSubmit
}) => {
  const fileInputRef = useRef(null);

  const onRemoveFileClick = () => {
    handleRemoveFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Stack spacing={4}>
        <TextField
          label="Tiêu đề báo cáo (Ví dụ: Báo cáo tuần 1 - Xây dựng DB)"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <Box
          sx={{
            border: "2px dashed #cbd5e1",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            bgcolor: selectedFile ? "action.hover" : "background.paper",
            transition: "all 0.2s",
            "&:hover": { borderColor: "primary.main", bgcolor: "action.selected" },
          }}
        >
          {selectedFile ? (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <AttachFileIcon sx={{ color: "#3b82f6", fontSize: 32 }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>{selectedFile.name}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </Box>
              <IconButton size="small" onClick={onRemoveFileClick} sx={{ color: "#ef4444" }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" sx={{ fontWeight: 500, color: "text.secondary", mb: 2 }}>
                Kéo thả file vào đây hoặc nhấp để duyệt
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                Chỉ hỗ trợ định dạng PDF, DOCX (Tối đa 10MB)
              </Typography>
              <Button
                component="label"
                variant="outlined"
                sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none" }}
              >
                Chọn tập tin
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </Button>
            </>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isUploading}
          startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          sx={{
            py: 1.5, borderRadius: 2, fontWeight: 700, bgcolor: "primary.main",
            boxShadow: "0 4px 14px rgba(21,101,192,0.2)", "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {isUploading ? "ĐANG TẢI LÊN..." : "XÁC NHẬN NỘP BÁO CÁO"}
        </Button>
      </Stack>
    </Paper>
  );
};

export default ReportUploadForm;
