import { useState, useEffect, useContext } from "react";
import { Box, Typography, CircularProgress, Alert, Grid, Divider } from "@mui/material";
import { AssignedMentorCard } from "./components/AssignedMentorCard";
import axiosClient from "../../api/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import Chip from "@mui/material/Chip";

const getInitials = (name) => {
  if (!name) return "";
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const ExternalMentorCard = ({ name, phone }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 16px 50px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box sx={{ height: 110, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", position: "relative" }} />
      <Box sx={{ px: 3, pb: 4, pt: 0, position: "relative", textAlign: "center" }}>
        <Avatar
          sx={{
            width: 96,
            height: 96,
            margin: "-48px auto 16px",
            fontSize: 36,
            bgcolor: "background.paper",
            color: "#10b981",
            fontWeight: "bold",
            border: "4px solid",
            borderColor: "background.paper",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          {getInitials(name)}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
          {name}
        </Typography>
        <Chip
          icon={<BusinessIcon fontSize="small" />}
          label="Cố vấn Doanh nghiệp (Tự liên hệ)"
          size="small"
          sx={{
            bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.08)",
            color: (theme) => theme.palette.mode === 'dark' ? "#34d399" : "#059669",
            fontWeight: 700,
            mb: 3,
            px: 1,
          }}
        />
        <Divider sx={{ mb: 3, borderStyle: "dashed", borderColor: "divider" }} />
        <Stack spacing={2.5} sx={{ textAlign: "left" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.2, borderRadius: 2.5, bgcolor: "action.hover", display: "flex", color: "text.secondary" }}>
              <BadgeIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                Số điện thoại
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {phone || "Chưa cập nhật"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

const AssignedMentor = () => {
  const { user } = useContext(AuthContext);
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

  const hasExternalMentor = user?.student?.externalMentorName;
  const isMentorsEmpty = mentors.length === 0;

  if (isMentorsEmpty && !hasExternalMentor) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Bạn chưa được phân công Cố vấn hướng dẫn nào và chưa khai báo người hướng dẫn ngoài.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", mb: 1, letterSpacing: "-0.5px" }}>
          Người Hướng Dẫn Của Tôi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Thông tin các giảng viên và chuyên gia đang đồng hành cùng bạn
        </Typography>
      </Box>

      {/* Render Giáo viên hướng dẫn từ hệ thống */}
      {mentors.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
            Giáo viên / Cố vấn từ hệ thống
          </Typography>
          <Grid container spacing={4}>
            {mentors.map((mentor) => (
              <Grid item xs={12} sm={6} lg={4} key={mentor.id}>
                <AssignedMentorCard mentor={mentor} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Render Cố vấn ngoài (Nếu có) */}
      {hasExternalMentor && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
            Người Hướng Dẫn (Tại Doanh Nghiệp)
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} lg={4}>
              <ExternalMentorCard 
                name={user.student.externalMentorName} 
                phone={user.student.externalMentorPhone} 
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AssignedMentor;