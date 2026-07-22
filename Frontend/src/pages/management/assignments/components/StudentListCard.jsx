import { Typography, Paper, Stack, Box, Avatar, Chip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import GroupsIcon from "@mui/icons-material/Groups";

const StudentListCard = ({ students }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <GroupsIcon color="primary" /> Thành viên nhóm ({students?.length || 0})
      </Typography>
      <Stack spacing={2}>
        <AnimatePresence>
          {students?.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper
                sx={{
                  p: 2.5, borderRadius: "18px", display: "flex", alignItems: "center", gap: 2,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid rgba(255, 255, 255, 0.1)",
                  "&:hover": { transform: "scale(1.02)", transition: "0.3s" }
                }}
              >
                <Avatar
                  src={student.avatarUrl}
                  sx={{ bgcolor: index % 2 === 0 ? "#3b82f6" : "#8b5cf6", width: 50, height: 50, fontWeight: 700 }}
                >
                  {!student.avatarUrl && student.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: "text.primary" }}>{student.name}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontWeight: 600 }}>MSSV: {student.code}</Typography>
                  <Chip label={student.major} size="small" sx={{ mt: 0.5, fontSize: "0.65rem", height: 18, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
                </Box>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>
    </Box>
  );
};

export default StudentListCard;
