import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Autocomplete, Chip, RadioGroup, FormControlLabel, Radio, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { universityClassApi, internshipApplicationApi } from "../../../api/universityApi";
import { toast } from "react-toastify";

const InternshipApplicationStep = ({ application, activeAppCount, universityId, onRefresh }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [companyOption, setCompanyOption] = useState("none"); // none, system, custom
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    taxCode: "",
    contactPhone: "",
    position: ""
  });

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateCompanyInfo, setUpdateCompanyInfo] = useState({
    companyName: "",
    taxCode: "",
    contactPhone: "",
    position: ""
  });

  useEffect(() => {
    if (universityId) {
      const fetchClasses = async () => {
        try {
          const res = await universityClassApi.getClassesByUniversity(universityId, 1, 100);
          setClasses(res?.content || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchClasses();
    }
    const fetchCompanies = async () => {
      try {
        const res = await internshipApplicationApi.getAllCompanies();
        setCompanies(res || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, [universityId]);

  const handleSubmit = async () => {
    if (!selectedClass) {
      toast.warning("Vui lòng chọn lớp thực tập!");
      return;
    }
    if (companyOption === "system") {
      if (!selectedCompany || !companyInfo.position) {
        toast.warning("Vui lòng chọn công ty và điền vị trí thực tập!");
        return;
      }
    } else if (companyOption === "custom") {
      if (!companyInfo.companyName || !companyInfo.taxCode || !companyInfo.contactPhone || !companyInfo.position) {
        toast.warning("Vui lòng điền đầy đủ thông tin doanh nghiệp!");
        return;
      }
    }

    setIsLoading(true);
    try {
      await internshipApplicationApi.submitApplication(
        file,
        selectedClass.classId,
        companyOption === "custom" ? companyInfo.companyName : (companyOption === "system" ? selectedCompany.companyName : ""),
        companyOption === "custom" ? companyInfo.taxCode : (companyOption === "system" ? selectedCompany.companyCode : ""),
        companyOption === "custom" ? companyInfo.contactPhone : (companyOption === "system" ? selectedCompany.phoneNumber : ""),
        companyOption !== "none" ? companyInfo.position : "",
        companyOption === "system" ? selectedCompany.companyId : null
      );
      toast.success("Nộp đơn thành công!");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Nộp đơn thất bại.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCompany = async () => {
    if (!updateCompanyInfo.companyName || !updateCompanyInfo.taxCode || !updateCompanyInfo.contactPhone || !updateCompanyInfo.position) {
      toast.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setIsLoading(true);
    try {
      await internshipApplicationApi.updateCompanyInfo(application.applicationId, updateCompanyInfo);
      toast.success("Cập nhật thông tin thành công!");
      setIsUpdateModalOpen(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (application) {
    const statusMap = {
      PENDING: { label: "Đang chờ duyệt", color: "warning" },
      APPROVED: { label: "Đã vào lớp", color: "success" },
      REJECTED: { label: "Từ chối", color: "error" },
    };
    const currentStatus = statusMap[application.status] || { label: "Không xác định", color: "default" };
    const missingCompany = !application.companyName;

    return (
      <Box p={3} border="1px solid #eee" borderRadius={2} bgcolor="#f9f9f9">
        <Typography variant="h6" mb={2}>Đơn xin vào lớp thực tập</Typography>
        <Typography variant="body1" mb={1}>Lớp: <b>{application.className}</b></Typography>
        <Typography variant="body1" mb={2}>
          Trạng thái duyệt: <Chip label={currentStatus.label} color={currentStatus.color} size="small" />
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <Chip label={(application.isHardCopySubmitted ?? application.hardCopySubmitted) ? "Đã nộp bản cứng" : "Chưa nộp bản cứng"} color={(application.isHardCopySubmitted ?? application.hardCopySubmitted) ? "success" : "default"} />
          <Chip label={(application.isCreditConditionMet ?? application.creditConditionMet) ? "Đạt điều kiện tín chỉ" : "Chưa xét tín chỉ"} color={(application.isCreditConditionMet ?? application.creditConditionMet) ? "success" : "default"} />
        </Box>
        {application.softCopyUrl && (
          <Button variant="text" href={application.softCopyUrl} target="_blank">Xem bản mềm đã nộp</Button>
        )}
        <Box mt={2}>
          <Typography variant="subtitle2" color="text.secondary">Thông tin doanh nghiệp tiếp nhận:</Typography>
          <Typography variant="body2"><b>Tên doanh nghiệp:</b> {application.companyName || "Chưa cập nhật"}</Typography>
          <Typography variant="body2"><b>Mã số thuế:</b> {application.taxCode || "Chưa cập nhật"}</Typography>
          <Typography variant="body2"><b>SĐT liên hệ:</b> {application.contactPhone || "Chưa cập nhật"}</Typography>
          <Typography variant="body2"><b>Vị trí thực tập:</b> {application.position || "Chưa cập nhật"}</Typography>

          {missingCompany && application.status !== 'REJECTED' && (
            <Button variant="outlined" color="primary" size="small" sx={{ mt: 2 }} onClick={() => setIsUpdateModalOpen(true)}>
              Bổ sung thông tin doanh nghiệp
            </Button>
          )}
        </Box>

        <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Bổ sung thông tin doanh nghiệp</DialogTitle>
          <DialogContent dividers>
            <Box display="grid" gridTemplateColumns="1fr" gap={2}>
              <TextField label="Tên doanh nghiệp *" value={updateCompanyInfo.companyName} onChange={e => setUpdateCompanyInfo({ ...updateCompanyInfo, companyName: e.target.value })} fullWidth />
              <TextField label="Mã số thuế *" value={updateCompanyInfo.taxCode} onChange={e => setUpdateCompanyInfo({ ...updateCompanyInfo, taxCode: e.target.value })} fullWidth />
              <TextField label="Số điện thoại liên hệ *" value={updateCompanyInfo.contactPhone} onChange={e => setUpdateCompanyInfo({ ...updateCompanyInfo, contactPhone: e.target.value })} fullWidth />
              <TextField label="Vị trí thực tập *" value={updateCompanyInfo.position} onChange={e => setUpdateCompanyInfo({ ...updateCompanyInfo, position: e.target.value })} fullWidth />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsUpdateModalOpen(false)}>Hủy</Button>
            <Button variant="contained" color="primary" onClick={handleUpdateCompany} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box p={3} border="1px solid #eee" borderRadius={2}>
      <Typography variant="h6" mb={2}>Nộp đơn vào lớp thực tập</Typography>

      {activeAppCount >= 2 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Bạn đã đăng ký tối đa 2 lớp thực tập. Bạn không thể đăng ký thêm lớp mới tại thời điểm này.
        </Alert>
      )}

      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={3} alignItems="flex-start">
        <Autocomplete
          disabled={activeAppCount >= 2}
          options={classes}
          getOptionLabel={(option) => option.className + " (" + option.academicYear + ")"}
          onChange={(_, newValue) => setSelectedClass(newValue)}
          renderInput={(params) => <TextField {...params} label="Chọn lớp thực tập" variant="outlined" />}
          sx={{ flexGrow: 1, maxWidth: 500 }}
        />

        <Box>
          <Button variant="outlined" component="label" disabled={activeAppCount >= 2} sx={{ height: '56px' }}>
            Chọn file
            <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.docx,.doc,.png,.jpg,.jpeg" />
          </Button>
          {file && <Typography variant="body2" mt={1} color="primary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Typography>}
        </Box>
      </Box>

      <RadioGroup
        value={companyOption}
        onChange={(e) => setCompanyOption(e.target.value)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="system" control={<Radio disabled={activeAppCount >= 2} />} label="Ứng tuyển công ty đối tác trên hệ thống" />
        <FormControlLabel value="custom" control={<Radio disabled={activeAppCount >= 2} />} label="Tự điền thông tin công ty (Nếu tự tìm được)" />
        <FormControlLabel value="none" control={<Radio disabled={activeAppCount >= 2} />} label="Tôi chưa có đơn vị thực tập, cần trường hỗ trợ" />
      </RadioGroup>

      {companyOption === "system" && (
        <Box mb={3} p={2} border="1px solid #ddd" borderRadius={2} bgcolor="#fff">
          <Typography variant="subtitle2" mb={2} fontWeight="bold">Chọn công ty đối tác</Typography>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
            <Autocomplete
              disabled={activeAppCount >= 2}
              options={companies}
              getOptionLabel={(option) => `${option.companyName} (${option.companyCode})`}
              onChange={(_, newValue) => setSelectedCompany(newValue)}
              renderInput={(params) => <TextField {...params} label="Chọn công ty *" variant="outlined" />}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              disabled={activeAppCount >= 2}
              label="Vị trí ứng tuyển *"
              variant="outlined"
              value={companyInfo.position}
              onChange={(e) => setCompanyInfo({ ...companyInfo, position: e.target.value })}
            />
          </Box>
        </Box>
      )}

      {companyOption === "custom" && (
        <Box mb={3} p={2} border="1px solid #ddd" borderRadius={2} bgcolor="#fff">
          <Typography variant="subtitle2" mb={2} fontWeight="bold">Thông tin doanh nghiệp tiếp nhận</Typography>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
            <TextField
              disabled={activeAppCount >= 2}
              label="Tên doanh nghiệp *"
              variant="outlined"
              value={companyInfo.companyName}
              onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
            />
            <TextField
              disabled={activeAppCount >= 2}
              label="Mã số thuế *"
              variant="outlined"
              value={companyInfo.taxCode}
              onChange={(e) => setCompanyInfo({ ...companyInfo, taxCode: e.target.value })}
            />
            <TextField
              disabled={activeAppCount >= 2}
              label="Số điện thoại liên hệ *"
              variant="outlined"
              value={companyInfo.contactPhone}
              onChange={(e) => setCompanyInfo({ ...companyInfo, contactPhone: e.target.value })}
            />
            <TextField
              disabled={activeAppCount >= 2}
              label="Vị trí thực tập *"
              variant="outlined"
              value={companyInfo.position}
              onChange={(e) => setCompanyInfo({ ...companyInfo, position: e.target.value })}
            />
          </Box>
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        disabled={
            !selectedClass || 
            isLoading || 
            activeAppCount >= 2 || 
            (companyOption === "custom" && (!companyInfo.companyName || !companyInfo.taxCode)) ||
            (companyOption === "system" && (!selectedCompany || !companyInfo.position))
        }
        onClick={handleSubmit}
      >
        {isLoading ? "Đang xử lý..." : "Nộp đơn"}
      </Button>
    </Box>
  );
};

export default InternshipApplicationStep;
