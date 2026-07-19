import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Avatar, Chip,
    Stack, Card, CircularProgress, Alert, Grid, Divider
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import axiosClient from '../../api/axiosClient';

const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

const AssignedMentor = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyMentors = async () => {
            try {
                const response = await axiosClient.get('/api/v1/mentors', {
                    params: { page: 0, size: 10 }
                });

                const mentorList = response?.content || response?.data?.content || [];
                setMentors(mentorList);

            } catch (err) {
                console.error('Lỗi khi tải thông tin cố vấn:', err);
                setError('Không thể tải thông tin cố vấn lúc này.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyMentors();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;
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
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a237e', mb: 1, letterSpacing: '-0.5px' }}>
                    Cố vấn hướng dẫn
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Thông tin các giảng viên và chuyên gia đang đồng hành cùng bạn
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {mentors.map((mentor) => (
                    <Grid item xs={12} sm={6} lg={4} key={mentor.id}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                overflow: 'visible', // Để avatar có thể nổi lên trên nếu cần
                                boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 16px 50px rgba(0,0,0,0.1)',
                                }
                            }}
                        >
                            {/* Dải Banner phía trên Card */}
                            <Box sx={{
                                height: 110,
                                background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                position: 'relative'
                            }} />

                            <Box sx={{ px: 3, pb: 4, pt: 0, position: 'relative', textAlign: 'center' }}>
                                {/* Avatar nổi (Floating Avatar) */}
                                <Avatar
                                    src={mentor.avatarUrl}
                                    sx={{
                                        width: 96,
                                        height: 96,
                                        margin: '-48px auto 16px', // Kéo avatar lên cắt ngang banner
                                        fontSize: 36,
                                        bgcolor: '#ffffff',
                                        color: '#1565c0',
                                        fontWeight: 'bold',
                                        border: '4px solid #ffffff',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {!mentor.avatarUrl && getInitials(mentor.fullName)}
                                </Avatar>

                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50', mb: 0.5 }}>
                                    {mentor.fullName}
                                </Typography>

                                <Chip
                                    icon={<SchoolIcon fontSize="small" />}
                                    label={mentor.academicRank || 'Giảng viên'}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(21, 101, 192, 0.08)',
                                        color: '#1565c0',
                                        fontWeight: 700,
                                        mb: 3,
                                        px: 1
                                    }}
                                />

                                <Divider sx={{ mb: 3, borderStyle: 'dashed', borderColor: '#e0e0e0' }} />

                                {/* Danh sách thông tin */}
                                <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            p: 1.2,
                                            borderRadius: 2.5,
                                            bgcolor: '#f5f7fa',
                                            display: 'flex',
                                            color: '#546e7a'
                                        }}>
                                            <BadgeIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#90a4ae', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Mã định danh
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#37474f' }}>
                                                {mentor.id}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            p: 1.2,
                                            borderRadius: 2.5,
                                            bgcolor: '#f5f7fa',
                                            display: 'flex',
                                            color: '#546e7a'
                                        }}>
                                            <BusinessIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#90a4ae', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Khoa / Bộ phận quản lý
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#37474f' }}>
                                                {mentor.department || 'Chưa cập nhật'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AssignedMentor;