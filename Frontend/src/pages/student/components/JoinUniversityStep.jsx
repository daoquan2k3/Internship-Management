import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Autocomplete, Chip } from "@mui/material";
import { universityApi, universityJoinRequestApi } from "../../../api/universityApi";
import { toast } from "react-toastify";

const JoinUniversityStep = ({ joinRequest, onRefresh }) => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [studentCode, setStudentCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await universityApi.getAllUniversities(1, 100);
        setUniversities(res?.content || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUniversities();
  }, []);

  const handleJoin = async () => {
    if (!selectedUniversity || !studentCode.trim()) {
      toast.warning("Vui lòng chọn trường và nhập Mã số sinh viên.");
      return;
    }
    setIsLoading(true);
    try {
      await universityJoinRequestApi.createRequest({ 
        universityId: selectedUniversity.universityId,
        universityStudentId: studentCode.trim() 
      });
      toast.success("Đã gửi yêu cầu gia nhập trường!");
      onRefresh();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(err.response?.data?.message || "Mã số sinh viên này đã tồn tại hoặc đang chờ duyệt.");
      } else {
        toast.error("Gửi yêu cầu thất bại.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (joinRequest) {
    const statusMap = {
      PENDING: { label: "Đang chờ duyệt", color: "warning" },
      APPROVED: { label: "Đã được duyệt", color: "success" },
      REJECTED: { label: "Bị từ chối", color: "error" },
    };
    const currentStatus = statusMap[joinRequest.status] || { label: "Không xác định", color: "default" };

    return (
      <Box p={3} border="1px solid #eee" borderRadius={2} bgcolor="#f9f9f9">
        <Typography variant="h6" mb={2}>Trạng thái gia nhập trường</Typography>
        <Typography variant="body1" mb={1}>Trường: <b>{joinRequest.universityName}</b></Typography>
        <Typography variant="body1" mb={2}>
          Trạng thái: <Chip label={currentStatus.label} color={currentStatus.color} size="small" />
        </Typography>
        {joinRequest.status === 'REJECTED' && (
          <Button variant="outlined" color="primary" onClick={() => onRefresh()}>
            Làm mới và thử lại (Tính năng thử lại chưa hỗ trợ hoàn toàn)
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box p={3} border="1px solid #eee" borderRadius={2}>
      <Typography variant="h6" mb={2}>Xin gia nhập Trường/Khoa</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Vui lòng chọn trường học hoặc khoa của bạn để gửi yêu cầu gia nhập. Sau khi được duyệt, bạn sẽ nhận được email hướng dẫn thực tập.
      </Typography>

      <Autocomplete
        options={universities}
        getOptionLabel={(option) => option.name}
        onChange={(_, newValue) => setSelectedUniversity(newValue)}
        renderInput={(params) => <TextField {...params} label="Chọn trường (*)" variant="outlined" />}
        sx={{ mb: 2, maxWidth: 500 }}
      />
      
      <TextField 
        label="Mã số sinh viên tại trường (*)" 
        variant="outlined" 
        fullWidth
        value={studentCode}
        onChange={(e) => setStudentCode(e.target.value)}
        sx={{ mb: 3, maxWidth: 500 }}
      />

      <Box>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedUniversity || !studentCode.trim() || isLoading}
          onClick={handleJoin}
        >
          {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
        </Button>
      </Box>
    </Box>
  );
};

export default JoinUniversityStep;
