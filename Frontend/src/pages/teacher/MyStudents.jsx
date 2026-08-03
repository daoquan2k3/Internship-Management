import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Pagination } from "@mui/material";
import { AssignedStudentTable } from "./components/AssignedStudentTable";
import axiosClient from "../../api/axiosClient";

const AssignedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setViewMode(nextView);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/v1/students", {
          params: { page: page - 1, size: 12 },
        });

        const data = response?.data || response;
        const studentList = data?.content || [];
        setStudents(studentList);
        setTotalPages(data?.totalPages || 1);
      } catch (err) {
        console.error("Lỗi khi tải thông tin sinh viên:", err);
        setError("Không thể tải thông tin sinh viên lúc này.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedStudents();
  }, [page]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (students.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Bạn chưa được phân công hướng dẫn sinh viên nào trong kỳ này.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: (theme) => theme.palette.mode === 'dark' ? "primary.light" : "#006064",
              mb: 1,
              letterSpacing: "-0.5px",
            }}
          >
            Sinh viên hướng dẫn
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Danh sách các sinh viên bạn đang trực tiếp quản lý và hỗ trợ
          </Typography>
        </Box>
      </Box>

      <AssignedStudentTable students={students} />

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default AssignedStudents;
