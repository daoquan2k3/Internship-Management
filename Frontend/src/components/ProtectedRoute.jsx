import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    const token = localStorage.getItem('accessToken');

    // 1. Nếu hệ thống đang gọi API getMe() để kiểm tra token, hiển thị vòng xoay loading
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    // 2. Nếu không có token hoặc chưa đăng nhập -> Đá về trang login
    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // 3. (Mở rộng) Nếu route có yêu cầu Role cụ thể mà user không khớp -> Đá về trang 403 hoặc trang chủ
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Truy cập bị từ chối: User có quyền ${user.role} không thể vào trang này.`);

        // Tự động điều hướng user về đúng trang chủ của họ dựa trên Role
        if (user.role === 'ROLE_ADMIN') {
            return <Navigate to="/admin-dashboard" replace />;
        } else if (user.role === 'ROLE_MENTOR') {
            return <Navigate to="/mentor-dashboard" replace />;
        } else {
            return <Navigate to="/dashboard" replace />; // Trang mặc định cho Student
        }
    }

    // 4. Nếu hợp lệ hết -> Cho phép render nội dung của trang
    return <Outlet />;
};

export default ProtectedRoute;