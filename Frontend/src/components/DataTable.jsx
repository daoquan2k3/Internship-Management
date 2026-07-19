import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as DetailIcon,
} from "@mui/icons-material";
import { useState } from "react";

export const DataTable = ({
  columns,
  data = [],
  loading = false,
  error = null,
  onEdit = null,
  onDelete = null,
  onAdd = null,
  totalCount = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange = null,
  onRowsPerPageChange = null,
  searchValue = "",
  onSearchChange = null,
  title = "Data",
  onDetail = null,

  // 2 PROPS MỚI GIÚP COMPONENT NÀY DÙNG ĐƯỢC CHO MỌI BẢNG TRONG DỰ ÁN
  idField = "id",
  nameField = "",
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && selectedRow) {
      onDelete(selectedRow); // Vẫn truyền nguyên cả row ra ngoài
    }
    setOpenDeleteDialog(false);
    setSelectedRow(null);
  };

  const handleChangePage = (event, newPage) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <h2>{title}</h2>
        {onAdd && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
            Thêm mới
          </Button>
        )}
      </Box>

      {onSearchChange && (
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{ width: "300px" }}
          />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}><CircularProgress /></Box>
        ) : (
          <>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.field} sx={{ fontWeight: "bold" }}>{column.label}</TableCell>
                  ))}
                  {/* SỬA LỖI TRỐNG TIÊU ĐỀ: Đổi onView thành onDetail */}
                  {(onEdit || onDelete || onDetail) && (
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + (onEdit || onDelete || onDetail ? 1 : 0)} sx={{ textAlign: "center", py: 3 }}>
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    // SỬ DỤNG idField ĐỂ ĐỌC KHÓA CHÍNH TỰ ĐỘNG
                    <TableRow key={row[idField] || index} hover>
                      {columns.map((column) => (
                        <TableCell key={`${index}-${column.field}`}>
                          {column.render ? column.render(row[column.field], row) : row[column.field]}
                        </TableCell>
                      ))}
                      {(onEdit || onDelete || onDetail) && (
                        // SỬA LỖI LỆCH ICON: Thêm align="center" cho TableCell và justifyContent: "center" cho Box
                        <TableCell align="center">
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                            {onEdit && (
                              <IconButton size="small" color="primary" onClick={() => onEdit(row)}>
                                <EditIcon />
                              </IconButton>
                            )}
                            {onDelete && (
                              <IconButton size="small" color="error" onClick={() => handleDeleteClick(row)}>
                                <DeleteIcon />
                              </IconButton>
                            )}
                            {onDetail && (
                              <IconButton size="small" color="info" onClick={() => onDetail(row)}>
                                <DetailIcon />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {onPageChange && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </>
        )}
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          {/* ĐỌC TÊN TỰ ĐỘNG DỰA VÀO nameField (NẾU CÓ) */}
          <p>Bạn có chắc chắn muốn xóa {nameField && selectedRow ? <b>{selectedRow[nameField]}</b> : "mục này"} không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};