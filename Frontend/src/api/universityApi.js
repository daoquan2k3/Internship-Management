import axiosClient from "./axiosClient";

export const universityApi = {
  // Admin only
  createUniversity: (data) => axiosClient.post("/api/v1/universities", data),
  getAllUniversities: (page = 1, size = 10, search = "") =>
    axiosClient.get("/api/v1/universities", { params: { page, size, search } }),
  getUniversityById: (id) => axiosClient.get(`/api/v1/universities/${id}`),
  updateUniversity: (id, data) =>
    axiosClient.put(`/api/v1/universities/${id}`, data),
  deleteUniversity: (id) => axiosClient.delete(`/api/v1/universities/${id}`),
};

export const universityJoinRequestApi = {
  createRequest: (data) => axiosClient.post("/api/v1/university-requests", data),
  updateStatus: (requestId, data) => axiosClient.put(`/api/v1/university-requests/${requestId}/status`, data),
  getRequestsByUniversity: (universityId, page = 1, limit = 10) => 
    axiosClient.get(`/api/v1/university-requests/university/${universityId}`, { params: { page, limit } }),
  getMyRequests: (page = 1, limit = 10) =>
    axiosClient.get(`/api/v1/university-requests/me`, { params: { page, limit } }),
};

export const universityClassApi = {
  createClass: (data) => axiosClient.post("/api/v1/university-classes", data),
  updateClass: (classId, data) => axiosClient.put(`/api/v1/university-classes/${classId}`, data),
  assignTeacher: (classId, teacherId) => axiosClient.put(`/api/v1/university-classes/${classId}/assign-teacher/${teacherId}`),
  getClassesByUniversity: (universityId, page = 1, limit = 10) =>
    axiosClient.get(`/api/v1/university-classes/university/${universityId}`, { params: { page, limit } }),
  getClassesByTeacher: (teacherId, page = 1, limit = 10) =>
    axiosClient.get(`/api/v1/university-classes/teacher/${teacherId}`, { params: { page, limit } }),
  getAllClasses: (page = 1, limit = 100) =>
    axiosClient.get("/api/v1/university-classes", { params: { page, limit } }),
  getMyClasses: (page = 1, limit = 100) =>
    axiosClient.get("/api/v1/university-classes/me", { params: { page, limit } }),
};

export const internshipApplicationApi = {
  submitApplication: (file, classId, companyName, taxCode, contactPhone, position, companyId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("classId", classId);
    if (companyName) formData.append("companyName", companyName);
    if (taxCode) formData.append("taxCode", taxCode);
    if (contactPhone) formData.append("contactPhone", contactPhone);
    if (position) formData.append("position", position);
    if (companyId) formData.append("companyId", companyId);
    return axiosClient.post("/api/v1/internship-applications", formData);
  },
  updateCompanyInfo: (applicationId, data) => axiosClient.put(`/api/v1/internship-applications/${applicationId}/company-info`, data),
  updateConditions: (id, data) => axiosClient.put(`/api/v1/internship-applications/${id}/conditions`, data),
  approveApplication: (id) => axiosClient.put(`/api/v1/internship-applications/${id}/approve`),
  rejectApplication: (id, reason) => axiosClient.put(`/api/v1/internship-applications/${id}/reject`, { reason }),
  getApplicationsByClass: (classId, status, page = 1, limit = 10) =>
    axiosClient.get(`/api/v1/internship-applications/class/${classId}`, { params: { status, page, limit } }),
  getMyApplications: (page = 1, limit = 10) =>
    axiosClient.get(`/api/v1/internship-applications/me`, { params: { page, limit } }),
  getAllCompanies: () => axiosClient.get("/api/v1/internship-applications/companies"),
  getCompanyApplications: (page = 1, limit = 10) =>
    axiosClient.get("/api/v1/internship-applications/company", { params: { page, limit } }),
};

export const finalEvaluationFormApi = {
  submitForm: (file, summaryFile, classId, companyScore, companyFeedback, isHardCopySubmitted = false) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (summaryFile) formData.append("summaryFile", summaryFile);
    formData.append("classId", classId);
    if (companyScore !== undefined && companyScore !== null && companyScore !== "") {
      formData.append("companyScore", companyScore);
    }
    if (companyFeedback !== undefined && companyFeedback !== null) {
      formData.append("companyFeedback", companyFeedback);
    }
    formData.append("isHardCopySubmitted", isHardCopySubmitted);
    return axiosClient.post("/api/v1/final-evaluations", formData);
  },
  updateHardCopyStatus: (formId, isSubmitted) => axiosClient.put(`/api/v1/final-evaluations/${formId}/hard-copy`, null, { params: { isSubmitted } }),
  updateCompanyScore: (formId, companyScore, companyFeedback) => axiosClient.put(`/api/v1/final-evaluations/${formId}/company-score`, null, { params: { companyScore, companyFeedback } }),
  evaluateByTeacher: (formId, data) => axiosClient.put(`/api/v1/final-evaluations/${formId}/teacher-evaluate`, data),
  evaluateByUniversityRep: (formId, data) => axiosClient.put(`/api/v1/final-evaluations/${formId}/rep-evaluate`, data),
  getFormsByClass: (classId, page = 1, limit = 10) =>
    axiosClient.get(`/api/v1/final-evaluations/class/${classId}`, { params: { page, limit } }),
  getMyForms: (page = 1, limit = 10) =>
    axiosClient.get(`/api/v1/final-evaluations/me`, { params: { page, limit } }),
  getFormsForTeacher: (classId = "", page = 1, limit = 10) =>
    axiosClient.get("/api/v1/final-evaluations/teacher", { params: { ...(classId ? { classId } : {}), page, limit } }),
  exportExcel: (classId = "", search = "") =>
    axiosClient.get("/api/v1/final-evaluations/export-excel", {
      params: { ...(classId ? { classId } : {}), search },
      responseType: "blob",
    }),
  exportZip: (classId = "", search = "") =>
    axiosClient.get("/api/v1/final-evaluations/export-zip", {
      params: { ...(classId ? { classId } : {}), search },
      responseType: "blob",
    }),
};

export const internshipPlacementApi = {
  getPlacementsByClass: (classId, page = 1, limit = 100, search = "") =>
    axiosClient.get(`/api/v1/placements/class/${classId}`, { params: { page, limit, search } }),
  getPlacementsByCompany: (companyId, page = 1, limit = 100) =>
    axiosClient.get(`/api/v1/placements/company/${companyId}`, { params: { page, limit } }),
  assignMentor: (placementId, mentorId) => 
    axiosClient.put(`/api/v1/placements/${placementId}/mentor/${mentorId}`),
  updateCompany: (placementId, companyId) => 
    axiosClient.put(`/api/v1/placements/${placementId}/company/${companyId}`),
  exportExcel: (classId = "") =>
    axiosClient.get("/api/v1/placements/export-excel", {
      params: { classId },
      responseType: "blob",
    }),
};


