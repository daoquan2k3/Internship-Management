import axios from 'axios';
import { toast } from 'react-toastify'; // Import thư viện thông báo

const BASE_URL = import.meta.env.DEV
    ? 'http://localhost:8080'
    : 'https://152.42.219.216.nip.io';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 1. REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {}, {
                    withCredentials: true
                });

                const newAccessToken = res.data.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                }


                axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                processQueue(null, newAccessToken);

                return axiosClient(originalRequest);
            } catch (err) {
                processQueue(err, null);

                localStorage.removeItem('accessToken');
                window.location.href = '#/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        // ==============================================================
        // B. XỬ LÝ THÔNG BÁO LỖI TOÀN CỤC (Áp dụng cấu trúc ApiResponse)
        // ==============================================================
        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data; // Đây là object ApiResponse từ backend

            const serverMessage = errorData?.message || 'Đã có lỗi xảy ra!';
            const serverError = errorData?.error;

            switch (status) {
                case 400: // Bad Request
                    // Nếu backend trả về Object chứa danh sách lỗi (như ảnh bạn chụp)
                    if (serverError && typeof serverError === 'object' && !Array.isArray(serverError)) {
                        // Trích xuất tất cả các câu thông báo lỗi ra thành một mảng
                        const errorMessages = Object.values(serverError);

                        if (errorMessages.length > 0) {
                            // Lấy câu lỗi đầu tiên tìm được để bật Toast
                            toast.error(errorMessages[0]);
                        } else {
                            toast.error(serverMessage || 'Dữ liệu không hợp lệ!');
                        }
                    }
                    // Nếu backend trả về một chuỗi string bình thường
                    else if (typeof serverError === 'string') {
                        toast.error(serverError);
                    }
                    // Nếu không có error, dùng đỡ message ("VALIDATION_ERROR")
                    else {
                        toast.warning(serverMessage);
                    }
                    break;

                case 403: // Forbidden
                    toast.error('Bạn không có quyền thực hiện hành động này!');
                    break;

                case 404: // Not Found
                    toast.error(serverMessage !== 'SUCCESS' ? serverMessage : 'Không tìm thấy dữ liệu yêu cầu!');
                    break;

                case 409: // Conflict
                    toast.error(serverMessage);
                    break;

                case 500: // Internal Server Error
                    toast.error(serverMessage !== 'SUCCESS' ? serverMessage : 'Lỗi hệ thống từ máy chủ (500)!');
                    break;

                default:
                    if (status !== 401) {
                        toast.error(`Lỗi ${status}: ${serverMessage}`);
                    }
                    break;
            }
        } else if (error.request) {
            // Trường hợp Server bị tắt hoặc mất kết nối mạng
            toast.error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại!');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;