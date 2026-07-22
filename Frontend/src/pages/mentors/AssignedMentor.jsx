import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Grid } from "@mui/material";
import { AssignedMentorCard } from "./components/AssignedMentorCard";
import axiosClient from "../../api/axiosClient";

const AssignedMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyMentors = async () => {
      try {
        const response = await axiosClient.get("/api/v1/mentors", {
          params: { page: 0, size: 10 },
        });

        const mentorList = response?.content || response?.data?.content || [];
        setMentors(mentorList);
      } catch (err) {
        console.error("Lỗi khi tải thông tin cố vấn:", err);
        setError("Không thể tải thông tin cố vấn lúc này.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyMentors();
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

  if (mentors.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Bạn chưa được phân công Cố vấn hướng dẫn nào.
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
            color: "primary.light",
            mb: 1,
            letterSpacing: "-0.5px",
          }}
        >
          Cố vấn hướng dẫn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Thông tin các giảng viên và chuyên gia đang đồng hành cùng bạn
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {mentors.map((mentor) => (
          <Grid item xs={12} sm={6} lg={4} key={mentor.id}>
            <AssignedMentorCard mentor={mentor} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AssignedMentor;