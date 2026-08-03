import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  Chip
} from "@mui/material";

const getInitials = (name) => {
  if (!name) return "";
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const AssignedStudentTable = ({ students }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
      <Table sx={{ minWidth: 650 }} aria-label="student list table">
        <TableHead sx={{ bgcolor: "action.hover" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>Sinh viên</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>Chuyên ngành</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>Lớp</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>Công ty thực tập</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>Liên hệ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.studentId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={student.avatarUrl}
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontWeight: 600,
                      fontSize: "1rem"
                    }}
                  >
                    {!student.avatarUrl && getInitials(student.fullName)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {student.fullName}
                    </Typography>
                    <Chip 
                      label={student.studentCode} 
                      size="small" 
                      sx={{ height: 20, fontSize: "0.7rem", mt: 0.5, fontWeight: 600, bgcolor: "action.selected", color: "text.secondary" }} 
                    />
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {student.major || "Chưa cập nhật"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {student.classRoom || "Chưa cập nhật"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {student.internshipCompany || "Chưa có"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                  {student.email || "Chưa cập nhật"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  {student.phoneNumber || ""}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
