
import {
  Typography, Paper, Stack, Box, Button, CircularProgress,
  FormControl, Select, MenuItem, TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, TextField
} from "@mui/material";
import { motion } from "framer-motion";
import TimelineIcon from "@mui/icons-material/Timeline";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";

const GradingTable = ({
  detail, rounds, criteria, selectedRoundId, selectedCriterionId,
  handleRoundChange, setSelectedCriterionId, isRoleNotAllowed, user,
  grades, handleGradeChange, maxScoreAllowed, savingGrades, handleSaveAllGrades
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <TimelineIcon color="primary" /> Đánh giá năng lực nhóm
      </Typography>

      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
        <Stack direction="row" spacing={3} sx={{ mb: 3, ml: 2, mt: 2 }}>
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, color: "text.secondary" }}>Vòng đánh giá</Typography>
            <Select
              value={selectedRoundId}
              onChange={handleRoundChange}
              displayEmpty
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
            >
              <MenuItem value="" disabled>-- Chọn vòng đánh giá --</MenuItem>
              {rounds.map((round) => (
                <MenuItem key={round.roundId || round.id} value={round.roundId || round.id}>{round.roundName || round.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 250 }} disabled={!selectedRoundId}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, color: "text.secondary" }}>Tiêu chí chấm điểm</Typography>
            <Select
              value={selectedCriterionId}
              onChange={(e) => setSelectedCriterionId(e.target.value)}
              displayEmpty
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
            >
              <MenuItem value="" disabled>{criteria.length === 0 ? "-- Không có tiêu chí --" : "-- Chọn tiêu chí --"}</MenuItem>
              {criteria.map((crit) => (
                <MenuItem key={crit.criterionId || crit.id} value={crit.criterionId || crit.id}>{crit.criterionName || crit.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Thành viên</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary", width: 140 }}>Đóng góp</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary", width: 100 }}>Điểm số</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Nhận xét của Mentor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detail.students?.map((student) => (
                <TableRow key={student.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: "text.primary", display: "block", mb: 0.5 }}>{student.name}</Typography>
                    <Chip label={`MSSV: ${student.code}`} size="small" sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", color: "text.secondary", fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>
                    {isRoleNotAllowed(user?.role) ? (
                      <Typography variant="body2" fontWeight="700" color="primary">{grades[student.id]?.contribution || "Chưa có"}</Typography>
                    ) : (
                      <FormControl fullWidth size="small">
                        <Select
                          value={grades[student.id]?.contribution || "100%"}
                          onChange={(e) => handleGradeChange(student.id, "contribution", e.target.value)}
                          sx={{ bgcolor: "background.paper", fontSize: "0.875rem" }}
                        >
                          <MenuItem value="100%">100%</MenuItem>
                          <MenuItem value="80%">80%</MenuItem>
                          <MenuItem value="50%">50%</MenuItem>
                          <MenuItem value="0%">0%</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell>
                    {isRoleNotAllowed(user?.role) ? (
                      <Chip label={grades[student.id]?.score ? `${grades[student.id].score} đ` : "N/A"} color={grades[student.id]?.score ? "success" : "default"} sx={{ fontWeight: "bold" }} />
                    ) : (
                      <TextField
                        size="small" placeholder={`0-${maxScoreAllowed}`} type="number"
                        inputProps={{ min: 0, max: maxScoreAllowed, step: 0.5 }}
                        value={grades[student.id]?.score || ""}
                        onChange={(e) => {
                          let val = parseFloat(e.target.value);
                          if (val > maxScoreAllowed) {
                            toast.warning(`Điểm tối đa của tiêu chí này chỉ là ${maxScoreAllowed}`, { toastId: 'maxScoreWarning' });
                          }
                          handleGradeChange(student.id, "score", e.target.value);
                        }}
                        sx={{ bgcolor: "background.paper", "& input": { textAlign: "center", fontWeight: "bold", color: "#1e3c72" }, width: "80px" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {isRoleNotAllowed(user?.role) ? (
                      <Typography variant="body2" sx={{ fontStyle: grades[student.id]?.comment ? "normal" : "italic", color: grades[student.id]?.comment ? "#333" : "#9e9e9e" }}>
                        {grades[student.id]?.comment || "Không có nhận xét"}
                      </Typography>
                    ) : (
                      <TextField
                        size="small" fullWidth placeholder="Nhập nhận xét..."
                        value={grades[student.id]?.comment || ""}
                        onChange={(e) => handleGradeChange(student.id, "comment", e.target.value)}
                        sx={{ bgcolor: "background.paper" }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!isRoleNotAllowed(user?.role) && (
          <Box sx={{ p: 2.5, bgcolor: "background.default", borderTop: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={savingGrades ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSaveAllGrades}
              disabled={savingGrades}
              sx={{ bgcolor: "#1e3c72", fontWeight: 800, borderRadius: 2, px: 3, boxShadow: "0 4px 14px rgba(30, 60, 114, 0.4)", "&:hover": { bgcolor: "#152b52" } }}
            >
              {savingGrades ? "ĐANG LƯU..." : "LƯU TOÀN BỘ ĐIỂM"}
            </Button>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default GradingTable;
