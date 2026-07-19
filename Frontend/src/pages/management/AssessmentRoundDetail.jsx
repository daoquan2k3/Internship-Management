import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, CircularProgress, Chip, Stack } from "@mui/material";
import { assessmentRoundsApi } from "../../api/resourceApi";
import { ArrowBack, AssignmentTurnedIn } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

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
                setRound(res?.data || res); // Tùy vào cấu trúc API
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", margin: "0 auto", backgroundColor: '#f4f6f8', minHeight: '100vh' }}>

            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 4, borderRadius: '50px', px: 3, fontWeight: 700, bgcolor: 'white', '&:hover': { bgcolor: '#f0f0f0' } }}
            >
                Quay lại danh sách
            </Button>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 4, background: 'linear-gradient(135deg, #ffffff, #fcfcfc)', boxShadow: '0 12px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.03)' }}>

                    <Box sx={{ mb: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: '900', color: '#1a237e', mb: 1.5, letterSpacing: '-0.5px' }}>
                            {round?.roundName || "Chưa có tên vòng đánh giá"}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
                            {round?.description || "Không có mô tả chi tiết."}
                        </Typography>
                    </Box>

                </Paper>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: '#1976d2', pl: 1 }}>
                    <AssignmentTurnedIn sx={{ mr: 1.5, fontSize: 32 }} />
                    <Typography variant="h5" sx={{ fontWeight: '800' }}>
                        Danh sách tiêu chí đánh giá
                    </Typography>
                </Box>
            </motion.div>

            {/* Render List Thẻ Tiêu Chí */}
            <motion.div variants={containerVariants} initial="hidden" animate="show">
                <Stack spacing={2}>
                    {round?.roundCriteria?.length > 0 ? (
                        round.roundCriteria.map((c, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3, bgcolor: '#ffffff', borderRadius: 3, border: '1px solid #e0e0e0',
                                        display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                                        justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: 2, transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: '#1976d2',
                                            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.1)',
                                            transform: 'translateX(4px)' // Hiệu ứng trượt ngang nhẹ
                                        }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                        {c.criterionName}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={`Trọng số: ${c.weight}%`}
                                            color="primary"
                                            sx={{ fontWeight: 700, px: 1, borderRadius: 2 }}
                                        />
                                        <Chip
                                            label={`Điểm tối đa: ${c.maxScore}`}
                                            color="secondary"
                                            variant="outlined"
                                            sx={{ fontWeight: 700, bgcolor: 'white', borderRadius: 2, borderColor: '#ce93d8' }}
                                        />
                                    </Box>
                                </Paper>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div variants={itemVariants}>
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed #bdbdbd', bgcolor: 'transparent' }}>
                                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    Chưa có tiêu chí nào được thiết lập cho vòng đánh giá này.
                                </Typography>
                            </Paper>
                        </motion.div>
                    )}
                </Stack>
            </motion.div>

        </Box>
    );
};

export default AssessmentRoundDetail;