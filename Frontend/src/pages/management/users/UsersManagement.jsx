import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { userApi } from "../../../api/resourceApi";
import { universityApi } from "../../../api/universityApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Button, FormControl, InputLabel, Select, MenuItem,
  Paper, Typography, Stack, Avatar, Chip, Divider, IconButton, TextField, InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import UserFormModal from "./components/UserFormModal";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";

// ==========================================
// COMPONENT PHỤ: Thẻ User
// ==========================================
const UserCard = ({ user, index, onEdit, onDelete, getRoleColor, getRoleLabel }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ scale: 1.03, y: -5 }}
    style={{ flex: "1 1 300px", maxWidth: "350px" }}
  >
    <Paper sx={{ p: 3, borderRadius: 4, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.5)", height: "100%" }}>
      <Box sx={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(26, 35, 126, 0.03)", zIndex: 0 }} />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ position: "relative", zIndex: 1, mb: 2 }}>
        <Avatar src={user.avatarUrl} sx={{ width: 56, height: 56, bgcolor: getRoleColor(user.role) + ".main", fontWeight: "bold" }}>
          {!user.avatarUrl && user.fullName?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{user.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">@{user.username} | ID: {user.userId}</Typography>
        </Box>
      </Stack>
      <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1, mb: 3 }}>
        <Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>
        <Typography variant="body2"><strong>SĐT:</strong> {user.phoneNumber}</Typography>
        {(user.universityName || user.universityId) && (
          <Typography variant="body2" sx={{ color: "#00897b", fontWeight: 600 }}>
            🏫 Trường: {user.universityName || `ID: ${user.universityId}`}
          </Typography>
        )}
        {(user.companyName || user.companyId) && (
          <Typography variant="body2" sx={{ color: "#7b1fa2", fontWeight: 600 }}>
            🏢 Doanh nghiệp: {user.companyName || `ID: ${user.companyId}`}
          </Typography>
        )}
        <Box><Chip label={getRoleLabel(user.role)} color={getRoleColor(user.role)} size="small" sx={{ fontWeight: "bold" }} /></Box>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", zIndex: 1 }}>
        <Button startIcon={<EditIcon />} size="small" color="primary" onClick={() => onEdit(user)} sx={{ borderRadius: 2 }}>Chỉnh sửa</Button>
        <IconButton size="small" color="error" onClick={() => onDelete(user)}><DeleteIcon /></IconButton>
      </Stack>
    </Paper>
  </motion.div>
);

// ==========================================
// COMPONENT CHÍNH
// ==========================================
const UsersManagement = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const { user: currentUser } = useContext(AuthContext);
  const [universities, setUniversities] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    username: "", email: "", fullName: "", phoneNumber: "",
    role: currentUser?.role === "ROLE_MENTOR" ? "ROLE_TEACHER" : "ROLE_STUDENT",
    password: "", studentCode: "", major: "", classRoom: "", dateOfBirth: "",
    address: "", department: "", academicRank: "", position: "",
    universityId: null, companyId: null,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers(role, page, rowsPerPage, search);
        if (isMounted) setData(response?.content || []);
        
        const uniRes = await universityApi.getAllUniversities(1, 100);
        if (isMounted) setUniversities(uniRes?.content || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
    return () => { isMounted = false; };
  }, [role, page, rowsPerPage, search]);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers(role, page, rowsPerPage, search);
      setData(response?.content || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username, email: user.email, fullName: user.fullName,
        phoneNumber: user.phoneNumber, role: user.role,
        universityId: user.universityId || null, companyId: user.companyId || null,
        studentCode: user.student?.studentCode || "",
        major: user.student?.major || "",
        classRoom: user.student?.classRoom || "",
        dateOfBirth: user.student?.dateOfBirth || "",
        address: user.student?.address || "",
        department: user.mentor?.department || "",
        academicRank: user.mentor?.academicRank || "",
        position: user.mentor?.position || "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "", email: "", fullName: "", phoneNumber: "",
        role: currentUser?.role === "ROLE_MENTOR" ? "ROLE_TEACHER" : "ROLE_STUDENT",
        password: "", studentCode: "", major: "", classRoom: "", dateOfBirth: "",
        address: "", department: "", academicRank: "", position: "",
        universityId: null, companyId: null,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => { setOpenModal(false); setEditingUser(null); };

  const handleSave = async () => {
    try {
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
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const targetId = userToDelete.userId || userToDelete.id;
    try {
      await userApi.deleteUser(targetId);
      toast.success("Xóa người dùng thành công!");
      setOpenDeleteModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa dữ liệu:", err);
    }
  };

  const getRoleColor = (userRole) => {
    if (userRole === "ROLE_ADMIN") return "error";
    if (userRole === "ROLE_UNIVERSITY_REP") return "secondary";
    if (userRole === "ROLE_COMPANY_REP") return "info";
    if (userRole === "ROLE_TEACHER") return "success";
    if (userRole === "ROLE_COMPANY_MENTOR" || userRole === "ROLE_MENTOR") return "warning";
    return "primary";
  };

  const getRoleLabel = (userRole) => {
    if (userRole === "ROLE_ADMIN") return "Admin";
    if (userRole === "ROLE_UNIVERSITY_REP") return "Đại diện trường";
    if (userRole === "ROLE_COMPANY_REP") return "Đại diện DN";
    if (userRole === "ROLE_TEACHER") return "Giáo viên";
    if (userRole === "ROLE_COMPANY_MENTOR") return "Cố vấn DN";
    if (userRole === "ROLE_MENTOR") return "Cố vấn";
    return "Sinh viên";
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: "-0.5px" }}>Quản lý người dùng</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Hệ thống quản lý thông tin và tài khoản</Typography>
        </Box>
        {currentUser?.role !== "ROLE_COMPANY_REP" && (
          <Button variant="contained" size="large" startIcon={<PersonAddAlt1Icon />} onClick={() => handleOpenModal()} sx={{ borderRadius: "50px", px: 4, py: 1.5, boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)" }}>
            Thêm người dùng
          </Button>
        )}
      </Box>

      {/* FILTER & SEARCH */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 4, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm theo Trường học, Công ty, Tên, Email..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); }}
          sx={{ flex: "1 1 320px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setSearchTerm(""); setSearch(""); setPage(0); }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>Lọc theo vai trò</InputLabel>
          <Select value={role} label="Lọc theo vai trò" onChange={(e) => { setRole(e.target.value); setPage(0); }} sx={{ borderRadius: 2 }}>
            <MenuItem value="">Tất cả vai trò</MenuItem>
            {currentUser?.role !== "ROLE_MENTOR" && currentUser?.role !== "ROLE_COMPANY_REP" && <MenuItem value="ROLE_ADMIN">Admin</MenuItem>}
            {currentUser?.role !== "ROLE_COMPANY_REP" && <MenuItem value="ROLE_UNIVERSITY_REP">Đại diện trường</MenuItem>}
            {currentUser?.role !== "ROLE_COMPANY_REP" && <MenuItem value="ROLE_TEACHER">Giáo viên</MenuItem>}
            <MenuItem value="ROLE_COMPANY_REP">Đại diện doanh nghiệp</MenuItem>
            <MenuItem value="ROLE_COMPANY_MENTOR">Cố vấn doanh nghiệp</MenuItem>
            {currentUser?.role !== "ROLE_MENTOR" && <MenuItem value="ROLE_STUDENT">Sinh viên</MenuItem>}
          </Select>
        </FormControl>
      </Paper>

      {/* LIST OF CARDS */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-start" }}>
        <AnimatePresence>
          {data.map((user, index) => (
            <UserCard key={user.userId || user.id || index} user={user} index={index} onEdit={handleOpenModal} onDelete={(u) => { setUserToDelete(u); setOpenDeleteModal(true); }} getRoleColor={getRoleColor} getRoleLabel={getRoleLabel} />
          ))}
        </AnimatePresence>
      </Box>

      {/* PAGINATION */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 6 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage((p) => p - 1)} sx={{ borderRadius: "50px", px: 3 }}>Trang trước</Button>
        <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
        <Button variant="outlined" disabled={data.length < rowsPerPage} onClick={() => setPage((p) => p + 1)} sx={{ borderRadius: "50px", px: 3 }}>Trang sau</Button>
      </Box>

      {/* MODALS */}
      <UserFormModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        currentUserRole={currentUser?.role}
        universities={universities}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa người dùng?"
        message={<>Bạn có chắc chắn muốn xóa tài khoản <strong>{userToDelete?.fullName}</strong> (@{userToDelete?.username})? Hành động này không thể hoàn tác.</>}
      />
    </Box>
  );
};

export default UsersManagement;
