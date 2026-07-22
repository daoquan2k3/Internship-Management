import { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { reportApi } from "../../api/resourceApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ReportUploadForm from "./components/ReportUploadForm";
import ReportHistoryList from "./components/ReportHistoryList";

const StudentReportSubmit = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // State lưu lịch sử
  const [myReports, setMyReports] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadReports = async () => {
      try {
        const res = await reportApi.getMyReports();
        if (isMounted) setMyReports(res?.content || []);
      } catch (err) {
        console.error("Lỗi lấy lịch sử:", err);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };
    loadReports();
    return () => { isMounted = false; };
  }, []);

  const refreshReports = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await reportApi.getMyReports();
      setMyReports(res?.content || []);
    } catch (err) {
      console.error("Lỗi lấy lịch sử:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validExtensions.includes(file.type)) {
        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        if (ext !== ".pdf" && ext !== ".docx") {
          setError("Hệ thống chỉ hỗ trợ tải lên file PDF hoặc DOCX.");
          return;
        }
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Kích thước file vượt quá giới hạn (10MB).");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !title.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và chọn file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await reportApi.uploadReport(selectedFile, title);

      if (response?.data?.success || response.success) {
        toast.success("Tải báo cáo lên thành công!");
        setTitle("");
        handleRemoveFile();
        refreshReports();
      } else {
        throw new Error(response?.data?.message || "Upload thất bại");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải file. Vui lòng thử lại.");
      toast.error("Upload thất bại.");
    } finally {
      setIsUploading(false);
    }
  };

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
          sx={{ fontWeight: 800, color: "primary.light", mb: 1, letterSpacing: "-0.5px" }}
        >
          Nộp Báo cáo Tiến độ
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tải lên tài liệu hoặc báo cáo hàng tuần của bạn để Mentor đánh giá.
        </Typography>
      </Box>

      <Stack spacing={4} sx={{ maxWidth: 800, mx: "auto" }}>
        {/* --- KHỐI NỘP BÀI --- */}
        <ReportUploadForm 
          title={title}
          setTitle={setTitle}
          selectedFile={selectedFile}
          error={error}
          isUploading={isUploading}
          handleFileChange={handleFileChange}
          handleRemoveFile={handleRemoveFile}
          handleSubmit={handleSubmit}
        />

        {/* --- KHỐI LỊCH SỬ NỘP BÀI KÈM ĐIỂM SỐ --- */}
        <ReportHistoryList
          myReports={myReports}
          isLoadingHistory={isLoadingHistory}
          handleDownload={handleDownload}
        />
      </Stack>
    </Box>
  );
};

export default StudentReportSubmit;