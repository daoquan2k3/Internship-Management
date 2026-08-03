import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, CircularProgress, Chip, Stack, Grid, Divider } from "@mui/material";
import { assessmentRoundsApi } from "../../../api/resourceApi";
import {
    ArrowBack,
    CalendarMonth as CalendarMonthIcon,
    School as SchoolIcon,
    Verified as VerifiedIcon,
    InfoOutlined as InfoOutlinedIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    BookmarkBorder as BookmarkBorderIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Hàm xử lý animation
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const AssessmentRoundDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [round, setRound] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await assessmentRoundsApi.getRoundById(id);
                setRound(res?.data || res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress sx={{ color: "primary.main" }} />
        </Box>
    );

    const isGroupActive = !round?.isDeleted;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1100px", margin: "0 auto", minHeight: '100vh' }}>

            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 4, borderRadius: '50px', px: 3, fontWeight: 700, bgcolor: 'white', borderColor: '#e2e8f0', color: '#334155', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' } }}
            >
                Quay lại danh sách
            </Button>

            <motion.div variants={containerVariants} initial="hidden" animate="show">
                {/* HERO BANNER - RICH AESTHETICS */}
                <motion.div variants={itemVariants}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            mb: 4,
                            borderRadius: 4,
                            position: "relative",
                            overflow: "hidden",
                            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                            color: "white",
                            boxShadow: "0 20px 40px rgba(30, 60, 114, 0.2)",
                        }}
                    >
                        {/* Decorative Circles */}
                        <Box sx={{ position: "absolute", top: -50, right: -50, width: 250, height: 250, borderRadius: "50%", background: "rgba(255, 255, 255, 0.08)", zIndex: 0 }} />
                        <Box sx={{ position: "absolute", bottom: -40, right: 100, width: 150, height: 150, borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", zIndex: 0 }} />

                        <Box sx={{ position: "relative", zIndex: 1 }}>
                            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" gap={2} sx={{ mb: 2 }}>
                                <Chip
                                    icon={<BookmarkBorderIcon sx={{ color: "#fff !important", fontSize: 18 }} />}
                                    label={`ID Vòng đánh giá: #${round?.id || id}`}
                                    sx={{ bgcolor: "rgba(255, 255, 255, 0.15)", color: "white", fontWeight: 700, backdropFilter: "blur(4px)", border: "1px solid rgba(255, 255, 255, 0.2)" }}
                                />

                                <Chip
                                    label={isGroupActive ? "• Đang hoạt động" : "• Đã khóa nộp bài"}
                                    sx={{
                                        bgcolor: isGroupActive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                        color: isGroupActive ? "#a7f3d0" : "#fca5a5",
                                        fontWeight: 800,
                                        border: `1px solid ${isGroupActive ? "#10b981" : "#ef4444"}`,
                                        backdropFilter: "blur(4px)"
                                    }}
                                />
                            </Stack>

                            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, letterSpacing: "-0.5px", textShadow: "0 2px 10px rgba(0,0,0,0.15)", fontSize: { xs: "2rem", md: "2.75rem" } }}>
                                {round?.roundName || "Chưa có tên vòng đánh giá"}
                            </Typography>

                            <Stack direction="row" alignItems="center" gap={1.5} sx={{ bgcolor: "rgba(0, 0, 0, 0.2)", p: 2, borderRadius: 3, maxWidth: "800px", backdropFilter: "blur(5px)" }}>
                                <InfoOutlinedIcon sx={{ color: "#60a5fa", flexShrink: 0 }} />
                                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6, color: "#f1f5f9" }}>
                                    {round?.description || "Không có mô tả yêu cầu chi tiết cho mốc đánh giá này."}
                                </Typography>
                            </Stack>
                        </Box>
                    </Paper>
                </motion.div>

                {/* KEY METRICS GRID */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -5 }} transition={{ duration: 0.2 }}>
                            <Paper sx={{ p: 3, borderRadius: 4, height: "100%", display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                                <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "#eff6ff", color: "#3b82f6", display: "flex" }}>
                                        <CalendarMonthIcon sx={{ fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>Thời gian thực hiện</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>Mốc thời gian</Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ mb: 2, borderStyle: "dashed" }} />
                                <Stack spacing={1}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                                        Bắt đầu: <span style={{ fontWeight: 700, color: "#0f172a" }}>{round?.startDate || "Chưa định rõ"}</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                                        Kết thúc: <span style={{ fontWeight: 700, color: "#dc2626" }}>{round?.endDate || "Chưa định rõ"}</span>
                                    </Typography>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -5 }} transition={{ duration: 0.2 }}>
                            <Paper sx={{ p: 3, borderRadius: 4, height: "100%", display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                                <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "#f5f3ff", color: "#8b5cf6", display: "flex" }}>
                                        <SchoolIcon sx={{ fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>Chương trình đào tạo</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>Giai đoạn thực tập</Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ mb: 2, borderStyle: "dashed" }} />
                                <Typography variant="body1" sx={{ fontWeight: 700, color: "#4c1d95", mb: 0.5 }}>
                                    {round?.phaseName || "Giai đoạn chung"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                    Mã giai đoạn (Phase ID): #{round?.phaseId || "N/A"}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -5 }} transition={{ duration: 0.2 }}>
                            <Paper sx={{ p: 3, borderRadius: 4, height: "100%", display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                                <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: isGroupActive ? "#ecfdf5" : "#fef2f2", color: isGroupActive ? "#10b981" : "#ef4444", display: "flex" }}>
                                        <VerifiedIcon sx={{ fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>Quy trình áp dụng</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>Trạng thái nộp bài</Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ mb: 2, borderStyle: "dashed" }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: isGroupActive ? "#065f46" : "#991b1b", mb: 0.5 }}>
                                    {isGroupActive ? "✓ Cho phép sinh viên nộp báo cáo" : "✕ Đã tạm dừng nhận báo cáo"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                    Hệ thống tự động đồng bộ theo trạng thái này
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* INSTRUCTIONS & GUIDELINES CARD */}
                <motion.div variants={itemVariants}>
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#fff7ed", color: "#f97316" }}>
                                <AssignmentTurnedInIcon sx={{ fontSize: 24 }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                Hướng dẫn thực hiện & Quy định nộp báo cáo
                            </Typography>
                        </Stack>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" gap={2}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        1
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                                            Theo dõi mốc thời gian
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                                            Sinh viên cần thực hiện công việc thực tập tại đơn vị theo đúng tiến độ từ <b>{round?.startDate || "ngày bắt đầu"}</b> đến <b>{round?.endDate || "ngày kết thúc"}</b>.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Stack direction="row" gap={2}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        2
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                                            Nộp báo cáo định kỳ
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                                            Truy cập vào mục <b>Quy trình Thực tập</b> hoặc <b>Quản lý Báo cáo</b>, chọn đúng mốc <b>{round?.roundName}</b> để tải lên báo cáo tuần/giai đoạn của mình.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Stack direction="row" gap={2}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#faf5ff", color: "#9333ea", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        3
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                                            Đánh giá từ Giảng viên
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                                            Giảng viên phụ trách lớp và Mentor tại doanh nghiệp sẽ trực tiếp xem xét báo cáo, chấm điểm và để lại lời nhận xét chi tiết trên hệ thống.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>
            </motion.div>
        </Box>
    );
};

export default AssessmentRoundDetail;