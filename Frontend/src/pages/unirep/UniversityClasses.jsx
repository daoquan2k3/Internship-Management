import { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Autocomplete,
  Stack, Chip, IconButton, Tooltip, MenuItem, LinearProgress, Grid
} from "@mui/material";
import { Add as AddIcon, Class as ClassIcon, Edit as EditIcon, Close as CloseIcon, People as PeopleIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { universityClassApi, universityApi } from "../../api/universityApi";
import { userApi } from "../../api/resourceApi";
import { motion, AnimatePresence } from "framer-motion";

const SEMESTER_OPTIONS = ["HK1", "HK2", "HK3", "HKH (Hè)"];

const emptyForm = { className: "", academicYear: "", semester: "", maxStudents: 50, teacherId: null };

const UniversityClasses = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog tạo mới
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({ ...emptyForm });
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Dialog chỉnh sửa
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const uniRes = await universityApi.getAllUniversities(1, 100);
        setUniversities(uniRes?.content || []);
        if (uniRes?.content?.length > 0) {
          setSelectedUniversity(uniRes.content[0]);
        }
        const teacherRes = await userApi.getAllUsers("ROLE_TEACHER", 0, 100);
        setTeachers(teacherRes?.content || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitData();
  }, []);

  const fetchClasses = useCallback(async () => {
    if (!selectedUniversity) return;
    setLoading(true);
    try {
      const res = await universityClassApi.getClassesByUniversity(selectedUniversity.universityId, 1, 100);
      setClasses(res?.content || []);
    } catch (error) {
      toast.error("Không thể tải danh sách lớp học.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedUniversity]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // ---- TẠO LỚP MỚI ----
  const handleCreate = async () => {
    if (!createForm.className || !selectedUniversity) {
      toast.warning("Vui lòng điền tên lớp.");
      return;
    }
    setSubmittingCreate(true);
    try {
      const payload = { ...createForm, universityId: selectedUniversity.universityId };
      const classRes = await universityClassApi.createClass(payload);
      if (createForm.teacherId) {
        await universityClassApi.assignTeacher(classRes.classId || classRes.data?.classId, createForm.teacherId);
      }
      toast.success("Tạo lớp học thành công!");
      setOpenCreateDialog(false);
      setCreateForm({ ...emptyForm });
      fetchClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo lớp.");
      console.error(error);
    } finally {
      setSubmittingCreate(false);
    }
  };

  // ---- CHỈNH SỬA LỚP ----
  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setEditForm({
      className: cls.className || "",
      academicYear: cls.academicYear || "",
      semester: cls.semester || "",
      maxStudents: cls.maxStudents || 50,
      teacherId: cls.teacherId || null,
    });
    setOpenEditDialog(true);
  };

  const handleEdit = async () => {
    if (!editForm.className) {
      toast.warning("Tên lớp không được để trống.");
      return;
    }
    setSubmittingEdit(true);
    try {
      await universityClassApi.updateClass(editingClass.classId, editForm);
      toast.success("Cập nhật lớp học thành công!");
      setOpenEditDialog(false);
      setEditingClass(null);
      fetchClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật lớp.");
      console.error(error);
    } finally {
      setSubmittingEdit(false);
    }
  };

  const getTeacherValue = (teacherId) => teachers.find((t) => t.userId === teacherId) || null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.light", letterSpacing: "-0.5px" }}>
            Quản lý Lớp Thực Tập
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Quản lý danh sách các lớp và phân công giáo viên phụ trách
          </Typography>
        </Box>

        <Stack direction="row" gap={2} alignItems="center">
          <Paper sx={{ p: 1, px: 2, borderRadius: 3, bgcolor: "background.paper", display: "flex", alignItems: "center", gap: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Cơ sở đào tạo:</Typography>
            <Autocomplete
              options={universities}
              getOptionLabel={(option) => option.name}
              value={selectedUniversity}
              onChange={(_, newValue) => setSelectedUniversity(newValue)}
              renderInput={(params) => <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} sx={{ minWidth: 150 }} />}
              disableClearable
            />
          </Paper>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            disabled={!selectedUniversity}
            sx={{ borderRadius: "50px", px: 3, py: 1.2, boxShadow: "0 8px 20px rgba(26, 35, 126, 0.25)", textTransform: "none", fontWeight: "bold" }}
          >
            Tạo Lớp mới
          </Button>
        </Stack>
      </Box>

      {/* TABLE */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress size={50} thickness={4} />
        </Box>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 700 }}>ID Lớp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tên Lớp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Năm học</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Kỳ học</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Số lượng SV</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Giáo viên phụ trách</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {classes.map((c, index) => {
                    const count = c.studentCount ?? 0;
                    const max = c.maxStudents ?? 50;
                    const pct = max > 0 ? Math.min((count / max) * 100, 100) : 0;
                    const isFull = count >= max;
                    return (
                      <TableRow
                        component={motion.tr}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        hover
                        key={c.classId}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>#{c.classId}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <ClassIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                            {c.className}
                          </Box>
                        </TableCell>
                        <TableCell>{c.academicYear || <Typography variant="body2" color="text.disabled" fontStyle="italic">Chưa có</Typography>}</TableCell>
                        <TableCell>
                          {c.semester
                            ? <Chip label={c.semester} size="small" color="info" sx={{ fontWeight: 600 }} />
                            : <Typography variant="body2" color="text.disabled" fontStyle="italic">Chưa có</Typography>
                          }
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: 140 }}>
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <PeopleIcon sx={{ fontSize: 16, color: isFull ? "error.main" : "primary.main" }} />
                              <Typography fontWeight={700} variant="body2" color={isFull ? "error.main" : "text.primary"}>
                                {count}/{max}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={pct}
                              sx={{
                                width: 80, height: 4, borderRadius: 2,
                                bgcolor: "divider",
                                "& .MuiLinearProgress-bar": { bgcolor: isFull ? "error.main" : "primary.main" }
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{c.teacherName || <Typography variant="body2" color="text.disabled" fontStyle="italic">Chưa phân công</Typography>}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Chỉnh sửa lớp học">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(c)}
                              sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" }, borderRadius: 1.5, p: 0.8 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </AnimatePresence>
                {classes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography variant="body1" color="text.secondary">Chưa có lớp học nào được tạo cho trường này</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* DIALOG TẠO LỚP */}
      <Dialog open={openCreateDialog} onClose={() => !submittingCreate && setOpenCreateDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 800, pb: 1 }}>
          <Typography variant="h6" fontWeight={800} color="primary.light">Tạo Lớp Thực Tập Mới</Typography>
          <IconButton size="small" onClick={() => setOpenCreateDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: "20px !important", pb: 3, px: 3 }}>
          <Stack spacing={3.5} sx={{ mt: 1 }}>
            <TextField label="Tên lớp (*)" value={createForm.className} onChange={(e) => setCreateForm({ ...createForm, className: e.target.value })} fullWidth variant="outlined" />
            <Stack direction="row" spacing={2.5} sx={{ width: "100%" }}>
              <TextField
                label="Năm học"
                value={createForm.academicYear}
                onChange={(e) => setCreateForm({ ...createForm, academicYear: e.target.value })}
                sx={{ flex: 1 }}
                placeholder="VD: 2025-2026"
              />
              <TextField
                select
                label="Kỳ học"
                value={createForm.semester}
                onChange={(e) => setCreateForm({ ...createForm, semester: e.target.value })}
                sx={{ flex: 1 }}
              >
                <MenuItem value="">-- Chọn kỳ --</MenuItem>
                {SEMESTER_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Stack>
            <TextField label="Số lượng SV tối đa" type="number" value={createForm.maxStudents} onChange={(e) => setCreateForm({ ...createForm, maxStudents: parseInt(e.target.value) || 50 })} fullWidth inputProps={{ min: 1 }} />
            <Autocomplete
              options={teachers}
              getOptionLabel={(option) => option.fullName + " (" + option.email + ")"}
              onChange={(_, newValue) => setCreateForm({ ...createForm, teacherId: newValue?.userId })}
              renderInput={(params) => <TextField {...params} label="Giáo viên phụ trách (Tùy chọn)" helperText="Có thể phân công sau" />}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button onClick={() => setOpenCreateDialog(false)} disabled={submittingCreate} variant="outlined" sx={{ borderRadius: 2 }}>Hủy bỏ</Button>
          <Button variant="contained" onClick={handleCreate} disabled={submittingCreate} sx={{ borderRadius: 2, px: 4 }}>
            {submittingCreate ? <CircularProgress size={20} color="inherit" /> : "Lưu lớp học"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG CHỈNH SỬA LỚP */}
      <Dialog open={openEditDialog} onClose={() => !submittingEdit && setOpenEditDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 800, pb: 1 }}>
          <Typography variant="h6" fontWeight={800} color="warning.main">Chỉnh sửa Lớp #{editingClass?.classId}</Typography>
          <IconButton size="small" onClick={() => setOpenEditDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: "20px !important", pb: 3, px: 3 }}>
          <Stack spacing={3.5} sx={{ mt: 1 }}>
            <TextField label="Tên lớp (*)" value={editForm.className} onChange={(e) => setEditForm({ ...editForm, className: e.target.value })} fullWidth variant="outlined" />
            <Stack direction="row" spacing={2.5} sx={{ width: "100%" }}>
              <TextField
                label="Năm học"
                value={editForm.academicYear}
                onChange={(e) => setEditForm({ ...editForm, academicYear: e.target.value })}
                sx={{ flex: 1 }}
                placeholder="VD: 2025-2026"
              />
              <TextField
                select
                label="Kỳ học"
                value={editForm.semester}
                onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                sx={{ flex: 1 }}
              >
                <MenuItem value="">-- Chọn kỳ --</MenuItem>
                {SEMESTER_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Stack>
            <TextField label="Số lượng SV tối đa" type="number" value={editForm.maxStudents} onChange={(e) => setEditForm({ ...editForm, maxStudents: parseInt(e.target.value) || 50 })} fullWidth inputProps={{ min: 1 }} />
            <Autocomplete
              options={teachers}
              getOptionLabel={(option) => option.fullName + " (" + option.email + ")"}
              value={getTeacherValue(editForm.teacherId)}
              onChange={(_, newValue) => setEditForm({ ...editForm, teacherId: newValue?.userId || null })}
              renderInput={(params) => <TextField {...params} label="Giáo viên phụ trách" />}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button onClick={() => setOpenEditDialog(false)} disabled={submittingEdit} variant="outlined" sx={{ borderRadius: 2 }}>Hủy bỏ</Button>
          <Button variant="contained" color="warning" onClick={handleEdit} disabled={submittingEdit} sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}>
            {submittingEdit ? <CircularProgress size={20} color="inherit" /> : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UniversityClasses;
