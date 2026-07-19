import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const RequireProfileCompletion = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <CircularProgress />;

    const isProfileIncomplete = (userInfo) => {
        if (!userInfo || userInfo.role.includes('ADMIN')) return false;

        if (!userInfo.fullName || !userInfo.phoneNumber) return true;

        if (userInfo.role.includes('STUDENT')) {
            if (!userInfo.student || !userInfo.student.major || !userInfo.student.classRoom) return true;
        }

        if (userInfo.role.includes('MENTOR')) {
            if (!userInfo.mentor || !userInfo.mentor.department) return true;
        }

        return false;
    };

    if (isProfileIncomplete(user)) {
        if (window.location.pathname !== '/settings') {
            toast.info("Vui lòng cập nhật đầy đủ hồ sơ để tiếp tục sử dụng hệ thống.", {
                toastId: "profile-incomplete-toast", 
                autoClose: 5000
            });
            return <Navigate to="/settings" state={{ message: "Vui lòng cập nhật hồ sơ" }} replace />;
        }
    }

    return children ? children : <Outlet />;
};

export default RequireProfileCompletion;