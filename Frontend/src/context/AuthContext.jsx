import { createContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const response = await authApi.getMe();
        // Cập nhật lại toàn bộ data mới nhất vào Global State
        setUser(response.data || response);
      } catch (error) {
        console.error("Error fetching session information:", error);
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUser(); // Gọi hàm fetchUser ở trên
      setLoading(false);
    };

    initializeAuth();
  }, [fetchUser]);

  const login = async (username, password) => {
    const response = await authApi.login({ username, password });
    const accessToken = response.data.accessToken;
    const userData = response.data.user;

    localStorage.setItem("accessToken", accessToken);
    setUser(userData);

    return userData;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Error calling API logout:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
