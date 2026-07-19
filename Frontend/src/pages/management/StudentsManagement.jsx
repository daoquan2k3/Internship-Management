import { useState, useEffect } from "react";
import { studentApi } from "../../api/resourceApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
  Modal,
  IconButton,
  Avatar,
  Chip,
  Divider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SchoolIcon from '@mui/icons-material/School';

const StudentsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Đã thêm userId vào initial state để tránh lỗi uncontrolled input
  const [formData, setFormData] = useState({
    userId: "",
    studentCode: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    major: "",
    classRoom: "",
    address: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAllStudents(
        page,
        rowsPerPage,
        search,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);

      // LOGIC DATE OF BIRTH ĐƯỢC GIỮ NGUYÊN 100%
      let formattedDate = "";
      if (student.dateOfBirth) {
        if (student.dateOfBirth.includes("-")) {
          formattedDate = student.dateOfBirth;
        }
        else if (student.dateOfBirth.includes("/")) {
          const [day, month, year] = student.dateOfBirth.split("/");
          formattedDate = `${year}-${month}-${day}`;
        }
      }

      setFormData({
        userId: "", // Reset userId khi edit
        studentCode: student.studentCode || "",
        email: student.email || "",
        fullName: student.fullName || "",
        phoneNumber: student.phoneNumber || "",
        major: student.major || "",
        classRoom: student.classRoom || "",
        address: student.address || "",
        dateOfBirth: formattedDate,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        userId: "",
        studentCode: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        major: "",
        classRoom: "",
        address: "",
        dateOfBirth: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingStudent(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = { ...formData };
      
      // LOGIC KIỂM TRA DATE OF BIRTH GIỮ NGUYÊN
      if (!payload.dateOfBirth || payload.dateOfBirth.trim() === "") {
        payload.dateOfBirth = null;
      }

      if (editingStudent) {
        await studentApi.updateStudent(editingStudent.studentId, payload);
        toast.success("Cập nhật sinh viên thành công!");
      } else {
        await studentApi.createStudent(payload);
        toast.success("Thêm mới sinh viên thành công!");
      }
      handleCloseModal();
      fetchStudents(); 
    } catch (err) {
      console.error("Error saving student:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      
      {/* --- HEADER --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: '-0.5px' }}>
            Quản lý Sinh viên
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Danh sách và thông tin chi tiết sinh viên
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => handleOpenModal()}
          sx={{ 
            borderRadius: '50px', 
            px: 4, 
            py: 1.5, 
            boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 20px rgba(26, 35, 126, 0.3)' }
          }}
        >
          Thêm sinh viên
        </Button>
      </Box>

      {/* --- 3D CARD LIST --- */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-start' }}>
        <AnimatePresence>
          {data.map((student, index) => (
            <motion.div
              key={student.studentId || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{ flex: '1 1 300px', maxWidth: '350px' }}
            >
              <Paper
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  position: "relative", 
                  overflow: "hidden",
                  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                  boxShadow: '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
                  border: '1px solid rgba(255,255,255,0.5)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Decoration Circle */}
                <Box sx={{ 
                  position: 'absolute', top: -30, right: -30, 
                  width: 100, height: 100, borderRadius: '50%', 
                  background: 'rgba(25, 118, 210, 0.04)', zIndex: 0 
                }} />

                <Stack direction="row" spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1, mb: 2 }}>
                  <Avatar src={student.avatarUrl} sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 'bold' }}>
                    {!student.avatarUrl && student.fullName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {student.fullName || "Chưa cập nhật"}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      {`MSSV: ${student.studentCode }`}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
                  {student.classRoom && <Chip label={`Lớp: ${student.classRoom}`} size="small" color="info" variant="outlined" />}
                  {student.major && <Chip label={`Ngành học: ${student.major}`} size="small" color="success" variant="outlined" />}
                </Stack>

                <Stack spacing={1} sx={{ position: 'relative', zIndex: 1, mb: 3, flexGrow: 1 }}>
                  <Typography variant="body2"><strong>ID:</strong> {student.studentId || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {student.email || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>SĐT:</strong> {student.phoneNumber || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Ngày sinh:</strong> {student.dateOfBirth || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Địa chỉ:</strong> {student.address || 'N/A'}</Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    startIcon={<EditIcon />} 
                    size="small" 
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(student)}
                    sx={{ borderRadius: 2, boxShadow: 0 }}
                  >
                    Chỉnh sửa
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* --- PAGINATION --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 6 }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)} sx={{ borderRadius: '50px', px: 3 }}>
          Trang trước
        </Button>
        <Typography variant="body2" fontWeight="bold">Trang {page + 1}</Typography>
        <Button variant="outlined" disabled={data.length < rowsPerPage} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: '50px', px: 3 }}>
          Trang sau
        </Button>
      </Box>

      {/* --- MODAL FORM SINH VIÊN (SỬ DỤNG FRAMER MOTION MƯỢT MÀ) --- */}
      <Modal 
        open={openModal} 
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backdropFilter: 'blur(3px)' 
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
                width: '100%', 
                maxWidth: '550px', 
                outline: 'none', 
                padding: '16px' 
              }}
            >
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                
                <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a237e' }}>
                    {editingStudent ? "Cập nhật thông tin sinh viên" : "Thêm mới sinh viên"}
                  </Typography>
                  <IconButton onClick={handleCloseModal} sx={{ bgcolor: '#f4f6f8', '&:hover': { bgcolor: '#e0e0e0' } }}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Phần cuộn (scroll) được đưa vào Box này nếu nội dung quá dài */}
                <Box sx={{ p: 4, bgcolor: '#fff', overflowY: 'auto' }}>
                  <Stack spacing={3}>
                    
                    {!editingStudent && (
                      <TextField
                        fullWidth
                        label="User ID"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        disabled={editingStudent !== null}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Student Code"
                      value={formData.studentCode}
                      onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                      disabled={editingStudent !== null}
                    />

                    {editingStudent && (
                      <>
                        <TextField
                          fullWidth
                          label="Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                      </>
                    )}

                    <TextField
                      fullWidth
                      label="Major"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    />

                    <TextField
                      fullWidth
                      label="Classroom"
                      value={formData.classRoom}
                      onChange={(e) => setFormData({ ...formData, classRoom: e.target.value })}
                    />

                    <TextField
                      fullWidth
                      label="Address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />

                    {/* TEXT FIELD DATE OF BIRTH GIỮ NGUYÊN HOÀN TOÀN LOGIC */}
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type={formData.dateOfBirth ? "date" : "text"}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!formData.dateOfBirth) e.target.type = "text";
                      }}
                    />
                    
                  </Stack>
                </Box>

                <Box sx={{ p: 3, borderTop: '1px solid #eee', display: 'flex', gap: 2, bgcolor: '#fff' }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    color="inherit" 
                    onClick={handleCloseModal}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={handleSave}
                    sx={{ borderRadius: 2, py: 1.5, boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}
                  >
                    Lưu
                  </Button>
                </Box>

              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

    </Box>
  );
};

export default StudentsManagement;