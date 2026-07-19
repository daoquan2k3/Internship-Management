import { useState, useEffect } from "react";
import { assessmentResultApi } from "../../api/resourceApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import GradeIcon from "@mui/icons-material/Grade";

const AssessmentResultsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, [page, rowsPerPage, search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await assessmentResultApi.getAllResults(
        null,
        page,
        rowsPerPage,
        search,
      );
      setData(response?.content || response?.data?.content || []);
    } catch (err) {
      console.error("Lỗi lấy lịch sử đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: "-0.5px" }}
        >
          Lịch sử Đánh giá Sinh viên
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Tra cứu và xem lại kết quả điểm số, nhận xét của từng sinh viên
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên sinh viên, mã SV, tên đề tài..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          sx={{
            "& fieldset": { border: "none" },
            bgcolor: "#f8f9fa",
            borderRadius: 2,
          }}
        />
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            xl: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        <AnimatePresence>
          {data.length > 0 ? (
            data.map((result, index) => (
              <motion.div
                key={result.id || index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(145deg, #ffffff, #fcfcfc)",
                    boxShadow: "8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff",
                    border: "1px solid rgba(0,0,0,0.04)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -30,
                      right: -30,
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "rgba(21, 101, 192, 0.05)",
                      zIndex: 0,
                    }}
                  />

                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    sx={{ position: "relative", zIndex: 1, mb: 3 }}
                  >
                    <Avatar
                      src={result?.studentAvatarUrl}
                      sx={{
                        bgcolor: "#1e3c72",
                        width: 56,
                        height: 56,
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        boxShadow: "0 4px 10px rgba(30,60,114,0.3)",
                      }}
                    >
                      {!result?.studentAvatarUrl && result?.studentName
                        ? result.studentName.charAt(0).toUpperCase()
                        : null}
                    </Avatar>
                    <Box sx={{ ml: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1.2,
                        }}
                      >
                        {result.studentName || "Chưa có tên sinh viên"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", fontWeight: 600 }}
                      >
                        MSSV: {result.studentCode || "N/A"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    spacing={1.5}
                    sx={{
                      mb: 3,
                      position: "relative",
                      zIndex: 1,
                      bgcolor: "#f8f9fa",
                      p: 2,
                      borderRadius: 3,
                      flexGrow: 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <AssignmentTurnedInIcon
                        sx={{ color: "#757575", fontSize: 18 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        Đề tài:{" "}
                        <span style={{ fontWeight: 500 }}>
                          {result.assignmentName || "N/A"}
                        </span>
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <TrackChangesIcon
                        sx={{ color: "#757575", fontSize: 18 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Vòng:{" "}
                        <span style={{ fontWeight: 500, color: "#f57c00" }}>
                          {result.roundName || "N/A"}
                        </span>
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <GradeIcon sx={{ color: "#757575", fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        Tiêu chí:{" "}
                        <span style={{ fontWeight: 500 }}>
                          {result.criterionName || "N/A"}
                        </span>
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <PersonIcon sx={{ color: "#757575", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Mentor chấm:{" "}
                        <span style={{ fontWeight: 500 }}>
                          {result.evaluatorName || "N/A"}
                        </span>
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider
                    sx={{
                      mb: 2,
                      position: "relative",
                      zIndex: 1,
                      borderStyle: "dashed",
                    }}
                  />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", fontWeight: 600 }}
                      >
                        ĐIỂM SỐ
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          color: "#10b981",
                          lineHeight: 1,
                        }}
                      >
                        {result.score !== undefined
                          ? result.score
                          : "Chưa chấm"}
                      </Typography>
                    </Box>

                    {/* Link thẳng đến trang Chi tiết của nhóm đó để xem/chỉnh sửa */}
                    <Button
                      startIcon={<VisibilityIcon />}
                      size="small"
                      variant="contained"
                      onClick={() =>
                        navigate(`/admin/assessment-results/${result.id}`)
                      }
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        bgcolor: "#1e3c72",
                        "&:hover": { bgcolor: "#152b52" },
                        boxShadow: 0,
                        ml: 1,
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Stack>
                </Paper>
              </motion.div>
            ))
          ) : (
            <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 8 }}>
              <AssignmentTurnedInIcon
                sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Chưa có kết quả đánh giá nào.
              </Typography>
            </Box>
          )}
        </AnimatePresence>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 6,
        }}
      >
        <Button
          variant="outlined"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          sx={{ borderRadius: "50px", px: 3 }}
        >
          Trang trước
        </Button>
        <Typography variant="body2" fontWeight="bold">
          Trang {page + 1}
        </Typography>
        <Button
          variant="outlined"
          disabled={data.length < rowsPerPage}
          onClick={() => setPage((p) => p + 1)}
          sx={{ borderRadius: "50px", px: 3 }}
        >
          Trang sau
        </Button>
      </Box>
    </Box>
  );
};

export default AssessmentResultsManagement;
