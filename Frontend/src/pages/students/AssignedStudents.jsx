import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Card,
  CircularProgress,
  Alert,
  Grid,
  Divider,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ClassIcon from "@mui/icons-material/Class";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axiosClient from "../../api/axiosClient";

const getInitials = (name) => {
  if (!name) return "";
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const AssignedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const response = await axiosClient.get("/api/v1/students", {
          params: { page: 0, size: 20 },
        });

        const studentList = response?.content || response?.data?.content || [];
        setStudents(studentList);
      } catch (err) {
        console.error("Lỗi khi tải thông tin sinh viên:", err);
        setError("Không thể tải thông tin sinh viên lúc này.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedStudents();
  }, []);

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
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#006064",
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

      <Grid container spacing={4}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} xl={4} key={student.studentId}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "visible",
                boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
                border: "1px solid #f0f0f0",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 50px rgba(0,0,0,0.1)",
                },
              }}
            >
              {/* Dải Banner phía trên Card - Dùng màu Xanh Ngọc để phân biệt với Mentor */}
              <Box
                sx={{
                  height: 110,
                  background:
                    "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  position: "relative",
                }}
              />

              <Box
                sx={{
                  px: 3,
                  pb: 4,
                  pt: 0,
                  position: "relative",
                  textAlign: "center",
                }}
              >
                {/* Avatar nổi */}
                <Avatar
                  src={student.avatarUrl}
                  sx={{
                    width: 96,
                    height: 96,
                    margin: "-48px auto 16px",
                    fontSize: 36,
                    bgcolor: "#ffffff",
                    color: "#0083b0",
                    fontWeight: "bold",
                    border: "4px solid #ffffff",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  }}
                >
                  {!student.avatarUrl && getInitials(student.fullName)}
                </Avatar>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "#2c3e50", mb: 0.5 }}
                >
                  {student.fullName}
                </Typography>

                <Chip
                  icon={<BadgeIcon fontSize="small" />}
                  label={`Mã SV: ${student.studentCode}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(0, 131, 176, 0.08)",
                    color: "#0083b0",
                    fontWeight: 700,
                    mb: 3,
                    px: 1,
                  }}
                />

                <Divider
                  sx={{ mb: 3, borderStyle: "dashed", borderColor: "#e0e0e0" }}
                />

                {/* Danh sách thông tin chi tiết */}
                <Stack spacing={2} sx={{ textAlign: "left" }}>
                  {/* Component con nội bộ để render các dòng thông tin cho gọn */}
                  <InfoRow
                    icon={<SchoolIcon fontSize="small" />}
                    label="Chuyên ngành"
                    value={student.major}
                  />
                  <InfoRow
                    icon={<ClassIcon fontSize="small" />}
                    label="Lớp danh nghĩa"
                    value={student.classRoom}
                  />
                  <InfoRow
                    icon={<EmailIcon fontSize="small" />}
                    label="Email"
                    value={student.email}
                  />
                  <InfoRow
                    icon={<PhoneIcon fontSize="small" />}
                    label="Số điện thoại"
                    value={student.phoneNumber}
                  />
                  <InfoRow
                    icon={<CalendarMonthIcon fontSize="small" />}
                    label="Ngày sinh"
                    value={student.dateOfBirth}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Component helper để render từng dòng thông tin tránh lặp code
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      sx={{
        p: 1.2,
        borderRadius: 2.5,
        bgcolor: "#f5f7fa",
        display: "flex",
        color: "#546e7a",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ overflow: "hidden" }}>
      <Typography
        variant="caption"
        sx={{
          color: "#90a4ae",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          display: "block",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: "#37474f",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value || "Chưa cập nhật"}
      </Typography>
    </Box>
  </Box>
);

export default AssignedStudents;
