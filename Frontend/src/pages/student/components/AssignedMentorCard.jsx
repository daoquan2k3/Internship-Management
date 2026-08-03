import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Card,
  Divider,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";

const getInitials = (name) => {
  if (!name) return "";
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const AssignedMentorCard = ({ mentor }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: "hidden", // Để avatar có thể nổi lên trên nếu cần
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
      {/* Dải Banner phía trên Card */}
      <Box
        sx={{
          height: 110,
          background: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
          position: "relative",
        }}
      />

      <Box sx={{ px: 3, pb: 4, pt: 0, position: "relative", textAlign: "center" }}>
        {/* Avatar nổi (Floating Avatar) */}
        <Avatar
          src={mentor.avatarUrl}
          sx={{
            width: 96,
            height: 96,
            margin: "-48px auto 16px", // Kéo avatar lên cắt ngang banner
            fontSize: 36,
            bgcolor: "background.paper",
            color: "primary.main",
            fontWeight: "bold",
            border: "4px solid",
            borderColor: "background.paper",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          {!mentor.avatarUrl && getInitials(mentor.fullName)}
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
          {mentor.fullName}
        </Typography>

        <Chip
          icon={<SchoolIcon fontSize="small" />}
          label={mentor.academicRank || "Giảng viên"}
          size="small"
          sx={{
            bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(21, 101, 192, 0.2)" : "rgba(21, 101, 192, 0.08)",
            color: (theme) => theme.palette.mode === 'dark' ? "#60a5fa" : "primary.main",
            fontWeight: 700,
            mb: 3,
            px: 1,
          }}
        />

        <Divider sx={{ mb: 3, borderStyle: "dashed", borderColor: "divider" }} />

        {/* Danh sách thông tin */}
        <Stack spacing={2.5} sx={{ textAlign: "left" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 2.5,
                bgcolor: "action.hover",
                display: "flex",
                color: "text.secondary",
              }}
            >
              <BadgeIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                Mã định danh
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {mentor.id}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 2.5,
                bgcolor: "action.hover",
                display: "flex",
                color: "text.secondary",
              }}
            >
              <BusinessIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                Khoa / Bộ phận quản lý
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {mentor.department || "Chưa cập nhật"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};
