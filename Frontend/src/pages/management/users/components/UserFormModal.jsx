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
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

const UserFormModal = ({
  open,
  onClose,
  onSave,
  editingUser,
  formData,
  setFormData,
  currentUserRole,
  universities,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <AnimatePresence>
        {open && (
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
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
              }}
            >
              <Box sx={{ p: 3, pb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "background.paper" }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.light" }}>
                  {editingUser ? "Cập nhật tài khoản" : "Thêm mới tài khoản"}
                </Typography>
                <IconButton onClick={onClose} sx={{ bgcolor: "background.default", "&:hover": { bgcolor: "#e0e0e0" } }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider />

              <Box sx={{ p: 4, bgcolor: "background.paper", overflowY: "auto", flex: 1 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth label="Tên đăng nhập"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={editingUser !== null}
                  />
                  <TextField
                    fullWidth label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <TextField
                    fullWidth label="Họ và tên"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  {!editingUser && (
                    <TextField
                      fullWidth label="Mật khẩu" type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  )}
                  <TextField
                    fullWidth label="Số điện thoại"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      value={formData.role} label="Vai trò"
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      disabled={editingUser !== null}
                    >
                      {currentUserRole !== "ROLE_MENTOR" && <MenuItem value="ROLE_STUDENT">Sinh viên</MenuItem>}
                      <MenuItem value="ROLE_UNIVERSITY_REP">Đại diện trường</MenuItem>
                      <MenuItem value="ROLE_TEACHER">Giáo viên</MenuItem>
                      <MenuItem value="ROLE_COMPANY_REP">Đại diện doanh nghiệp</MenuItem>
                      <MenuItem value="ROLE_COMPANY_MENTOR">Cố vấn doanh nghiệp</MenuItem>
                      {currentUserRole !== "ROLE_MENTOR" && <MenuItem value="ROLE_ADMIN">Admin</MenuItem>}
                    </Select>
                  </FormControl>

                  {formData.role === "ROLE_STUDENT" && (
                    <>
                      <TextField
                        fullWidth label="Mã sinh viên"
                        value={formData.studentCode}
                        onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                      />
                      <TextField
                        fullWidth label="Chuyên ngành"
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      />
                      <TextField
                        fullWidth label="Lớp"
                        value={formData.classRoom}
                        onChange={(e) => setFormData({ ...formData, classRoom: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="Ngày sinh"
                        type={formData.dateOfBirth ? "date" : "text"}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = "text";
                        }}
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                      <TextField
                        fullWidth label="Địa chỉ"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </>
                  )}

                  {["ROLE_TEACHER", "ROLE_UNIVERSITY_REP", "ROLE_COMPANY_MENTOR", "ROLE_COMPANY_REP"].includes(formData.role) && (
                    <>
                      <TextField
                        fullWidth label="Phòng ban"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                      {["ROLE_TEACHER", "ROLE_UNIVERSITY_REP"].includes(formData.role) && (
                        <>
                          <FormControl fullWidth>
                            <InputLabel>Cơ sở đào tạo</InputLabel>
                            <Select
                              value={formData.universityId || ""}
                              label="Cơ sở đào tạo"
                              onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                            >
                              <MenuItem value=""><em>Chọn cơ sở đào tạo</em></MenuItem>
                              {universities?.map((uni) => (
                                <MenuItem key={uni.universityId} value={uni.universityId}>
                                  {uni.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <TextField
                            fullWidth label="Cấp bậc (Học hàm/Học vị)"
                            value={formData.academicRank}
                            onChange={(e) => setFormData({ ...formData, academicRank: e.target.value })}
                          />
                        </>
                      )}
                      {["ROLE_COMPANY_MENTOR", "ROLE_COMPANY_REP"].includes(formData.role) && (
                        <TextField
                          fullWidth label="Chức vụ"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        />
                      )}
                    </>
                  )}
                </Stack>
              </Box>

              <Box sx={{ p: 3, pt: 2, display: "flex", gap: 2, bgcolor: "background.paper" }}>
                <Button fullWidth variant="outlined" color="inherit" onClick={onClose} sx={{ borderRadius: 2, py: 1.5 }}>
                  Hủy bỏ
                </Button>
                <Button fullWidth variant="contained" onClick={onSave} sx={{ borderRadius: 2, py: 1.5, boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)" }}>
                  Lưu thông tin
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default UserFormModal;
