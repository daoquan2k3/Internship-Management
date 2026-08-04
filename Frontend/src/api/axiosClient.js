import axios from 'axios';
import { toast } from 'react-toastify'; // Import thư viện thông báo

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '');
const BASE_URL = rawBaseUrl.endsWith('/api/v1') ? rawBaseUrl.replace('/api/v1', '') : rawBaseUrl;

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
        if (config.data && (config.data instanceof FormData || config.data.constructor?.name === 'FormData' || typeof config.data.append === 'function')) {
            delete config.headers['Content-Type'];
            if (config.headers.post) delete config.headers.post['Content-Type'];
            if (config.headers.put) delete config.headers.put['Content-Type'];
            if (config.headers.common) delete config.headers.common['Content-Type'];
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
        
        // Không intercept 401 nếu đó là API login hoặc refresh token
        if (originalRequest.url.includes('/api/v1/auth/login') || originalRequest.url.includes('/api/v1/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest._retry = true;
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            // Fix for overlapping 401s: If token was already refreshed by another request while this one was in-flight
            const currentToken = localStorage.getItem('accessToken');
            const sentToken = originalRequest.headers['Authorization']?.split(' ')[1];
            if (currentToken && sentToken && currentToken !== sentToken) {
                originalRequest._retry = true;
                originalRequest.headers['Authorization'] = `Bearer ${currentToken}`;
                return axiosClient(originalRequest);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${BASE_URL.replace('/api/v1', '')}/api/v1/auth/refresh`, {}, {
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

                // Only log out if it's a 4xx error or an actual backend rejection, not a network/abort error.
                if (err.response && err.response.status >= 400 && err.response.status < 500) {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                }
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