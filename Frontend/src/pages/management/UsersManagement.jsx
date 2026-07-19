import { useState, useEffect } from "react";
import { userApi } from "../../api/resourceApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Stack,
  Modal,
  IconButton,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded"; // Icon cảnh báo xóa

const UsersManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  // State quản lý Form Modal (Thêm/Sửa)
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // State quản lý Alert Modal (Xóa)
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    role: "ROLE_STUDENT",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, role, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers(
        role,
        page,
        rowsPerPage,
        search,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        role: "ROLE_STUDENT",
        password: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingUser) {
        const payload = { ...formData };
        delete payload.password;
        await userApi.updateUser(editingUser.userId, payload);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await userApi.createUser(formData);
        toast.success("Thêm mới người dùng thành công!");
      }
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      console.error("Error saving data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. KHIẤN MỞ ALERT XÁC NHẬN XÓA
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setOpenDeleteModal(true);
  };

  // 2. ĐÓNG ALERT XÁC NHẬN XÓA
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUserToDelete(null);
  };

  // 3. THỰC HIỆN XÓA THẬT SAU KHI ĐÃ ẤN XÁC NHẬN
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const targetId = userToDelete.userId || userToDelete.id;
    try {
      setLoading(true);
      await userApi.deleteUser(targetId);
      toast.success("Xóa người dùng thành công!");
      handleCloseDeleteModal();
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (userRole) => {
    if (userRole === "ROLE_ADMIN") return "error";
    if (userRole === "ROLE_MENTOR") return "warning";
    return "primary";
  };

  const getRoleLabel = (userRole) => {
    if (userRole === "ROLE_ADMIN") return "Admin";
    if (userRole === "ROLE_MENTOR") return "Cố vấn";
    return "Học sinh";
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      {/* --- HEADER --- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: "-0.5px" }}
          >
            Quản lý người dùng
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Hệ thống quản lý thông tin và tài khoản
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => handleOpenModal()}
          sx={{
            borderRadius: "50px",
            px: 4,
            py: 1.5,
            boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 12px 20px rgba(26, 35, 126, 0.3)",
            },
          }}
        >
          Thêm người dùng
        </Button>
      </Box>

      {/* --- FILTER & SEARCH --- */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>Lọc theo vai trò</InputLabel>
          <Select
            value={role}
            label="Lọc theo vai trò"
            onChange={(e) => {
              setRole(e.target.value);
              setPage(0);
            }}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">Tất cả vai trò</MenuItem>
            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
            <MenuItem value="ROLE_MENTOR">Cố vấn</MenuItem>
            <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* --- 3D CARD LIST --- */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "flex-start",
        }}
      >
        <AnimatePresence>
          {data.map((user, index) => (
            <motion.div
              key={user.userId || user.id || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{ flex: "1 1 300px", maxWidth: "350px" }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
                  boxShadow: "8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff",
                  border: "1px solid rgba(255,255,255,0.5)",
                  height: "100%",
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
                    background: "rgba(26, 35, 126, 0.03)",
                    zIndex: 0,
                  }}
                />

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ position: "relative", zIndex: 1, mb: 2 }}
                >
                  <Avatar
                    src={user.avatarUrl}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: getRoleColor(user.role) + ".main",
                      fontWeight: "bold",
                    }}
                  >
                    {!user.avatarUrl && user.fullName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, lineHeight: 1.2 }}
                    >
                      {user.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username} | ID: {user.userId}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  spacing={1.5}
                  sx={{ position: "relative", zIndex: 1, mb: 3 }}
                >
                  <Typography variant="body2">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>SĐT:</strong> {user.phoneNumber}
                  </Typography>
                  <Box>
                    <Chip
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  <Button
                    startIcon={<EditIcon />}
                    size="small"
                    color="primary"
                    onClick={() => handleOpenModal(user)}
                    sx={{ borderRadius: 2 }}
                  >
                    Chỉnh sửa
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleOpenDeleteModal(user)} // Thay đổi gọi hàm mở Alert
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* --- PAGINATION --- */}
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

      {/* --- MODAL FORM --- */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyOntext: "center",
          justifyContent: "center",
          backdropFilter: "blur(3px)",
        }}
      >
        <AnimatePresence>
          {openModal && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{
                width: "100%",
                maxWidth: "500px",
                outline: "none",
                padding: "16px",
              }}
            >
              <Paper
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    pb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, color: "#1a237e" }}
                  >
                    {editingUser ? "Cập nhật tài khoản" : "Thêm mới tài khoản"}
                  </Typography>
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      bgcolor: "#f4f6f8",
                      "&:hover": { bgcolor: "#e0e0e0" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Divider />

                <Box sx={{ p: 4, bgcolor: "#fff" }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Tên đăng nhập"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      disabled={editingUser !== null}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                    {!editingUser && (
                      <TextField
                        fullWidth
                        label="Mật khẩu"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    )}
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                    <FormControl fullWidth>
                      <InputLabel>Vai trò</InputLabel>
                      <Select
                        value={formData.role}
                        label="Vai trò"
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                      >
                        <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>
                        <MenuItem value="ROLE_MENTOR">Cố vấn</MenuItem>
                        <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>

                <Box
                  sx={{ p: 3, pt: 0, display: "flex", gap: 2, bgcolor: "#fff" }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    onClick={handleCloseModal}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)",
                    }}
                  >
                    Lưu thông tin
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <AnimatePresence>
          {openDeleteModal && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{
                width: "100%",
                maxWidth: "400px",
                outline: "none",
                padding: "16px",
              }}
            >
              <Paper
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  p: 3,
                  bgcolor: "#fff",
                }}
              >
                <Stack
                  alignItems="center"
                  spacing={2}
                  sx={{ textAlignment: "center", textAlign: "center", mb: 3 }}
                >
                  {/* Icon Cảnh báo vòng tròn đỏ nảy */}
                  <Avatar
                    sx={{
                      bgcolor: "error.lighter",
                      width: 64,
                      height: 64,
                      color: "error.main",
                      mb: 1,
                    }}
                  >
                    <WarningAmberRoundedIcon sx={{ fontSize: 36 }} />
                  </Avatar>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#1a237e" }}
                  >
                    Xác nhận xóa người dùng?
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Bạn có chắc chắn muốn xóa tài khoản{" "}
                    <strong>{userToDelete?.fullName}</strong> (@
                    {userToDelete?.username})? Hành động này không thể hoàn tác.
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    onClick={handleCloseDeleteModal}
                    sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={handleConfirmDelete}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    Xóa ngay
                  </Button>
                </Stack>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </Box>
  );
};

export default UsersManagement;
