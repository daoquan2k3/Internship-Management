import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Card,
  Divider,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ClassIcon from "@mui/icons-material/Class";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const getInitials = (name) => {
  if (!name) return "";
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

// Component helper để render từng dòng thông tin
const InfoRow = ({ icon, label, value }) => (
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
      {icon}
    </Box>
    <Box sx={{ overflow: "hidden" }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
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
          color: "text.primary",
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

export const AssignedStudentCard = ({ student }) => {
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
      <Box
        sx={{
          height: 110,
          background: "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
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
        <Avatar
          src={student.avatarUrl}
          sx={{
            width: 96,
            height: 96,
            margin: "-48px auto 16px",
            fontSize: 36,
            bgcolor: "background.paper",
            color: "#0083b0",
            fontWeight: "bold",
            border: "4px solid",
            borderColor: "background.paper",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          {!student.avatarUrl && getInitials(student.fullName)}
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
          {student.fullName}
        </Typography>

        <Chip
          icon={<BadgeIcon fontSize="small" />}
          label={`Mã SV: ${student.studentCode}`}
          size="small"
          sx={{
            bgcolor: (theme) => theme.palette.mode === 'dark' ? "rgba(0, 131, 176, 0.2)" : "rgba(0, 131, 176, 0.08)",
            color: (theme) => theme.palette.mode === 'dark' ? "#38bdf8" : "#0083b0",
            fontWeight: 700,
            mb: 3,
            px: 1,
          }}
        />

        <Divider sx={{ mb: 3, borderStyle: "dashed", borderColor: "divider" }} />

        <Stack spacing={2} sx={{ textAlign: "left" }}>
          <InfoRow icon={<SchoolIcon fontSize="small" />} label="Chuyên ngành" value={student.major} />
          <InfoRow icon={<ClassIcon fontSize="small" />} label="Lớp danh nghĩa" value={student.classRoom} />
          <InfoRow icon={<EmailIcon fontSize="small" />} label="Email" value={student.email} />
          <InfoRow icon={<PhoneIcon fontSize="small" />} label="Số điện thoại" value={student.phoneNumber} />
          <InfoRow icon={<CalendarMonthIcon fontSize="small" />} label="Ngày sinh" value={student.dateOfBirth} />
        </Stack>
      </Box>
    </Card>
  );
};
