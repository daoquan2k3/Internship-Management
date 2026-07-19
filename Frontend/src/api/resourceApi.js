import axiosClient from "./axiosClient";

export const studentApi = {
  // Get all students (Admin/Mentor only)
  getAllStudents: (page = 0, size = 10, search = "") =>
    axiosClient.get("/api/v1/students", { params: { page, size, search } }),

  // Get current student info
  getCurrentStudentInfo: () => axiosClient.get("/api/v1/students/me"),

  // Get student by ID
  getStudentById: (studentId) =>
    axiosClient.get(`/api/v1/students/${studentId}`),

  // Create student (Admin only)
  createStudent: (data) => axiosClient.post("/api/v1/students", data),

  // Update student info
  updateStudent: (studentId, data) =>
    axiosClient.put(`/api/v1/students/${studentId}`, data),
};

export const mentorApi = {
  // Get all mentors
  getAllMentors: (page = 0, size = 10, search = "") =>
    axiosClient.get("/api/v1/mentors", { params: { page, size, search } }),

  // Get mentor by ID
  getMentorById: (mentorId) => axiosClient.get(`/api/v1/mentors/${mentorId}`),

  // Create mentor (Admin only)
  createMentor: (data) => axiosClient.post("/api/v1/mentors", data),

  // Update mentor info (Admin/Mentor)
  updateMentor: (mentorId, data) =>
    axiosClient.put(`/api/v1/mentors/${mentorId}`, data),

  getMentorInfo: () => axiosClient.get("/api/v1/mentors/info"),
};

export const userApi = {
  // Get all users by role (Admin) - returns PageResponseDTO
  getAllUsers: (role = "", page = 0, size = 10, search = "") =>
    axiosClient.get("/api/v1/users/profiles", {
      params: { role, page, size, search },
    }),

  // Get user by ID - returns ApiResponse
  getUserById: (userId) => axiosClient.get(`/api/v1/users/${userId}`),

  // Create user (Admin) - returns ApiResponse
  createUser: (data) => axiosClient.post("/api/v1/users", data),

  // Update user info - returns ApiResponse
  updateUser: (userId, data) =>
    axiosClient.put(`/api/v1/users/${userId}`, data),

  // Update user role (Admin) - returns ApiResponse
  updateUserRole: (userId, data) =>
    axiosClient.put(`/api/v1/users/${userId}/role`, data),

  // Update user status - returns ApiResponse
  updateUserStatus: (userId) =>
    axiosClient.put(`/api/v1/users/${userId}/status`),

  // Delete user (Admin) - returns ApiResponse
  deleteUser: (userId) => axiosClient.delete(`/api/v1/users/${userId}`),

  changePassword: (data) =>
    axiosClient.post("/api/v1/users/change-password", data),

  uploadAvatar: (userId, formData) => {
    return axiosClient.put(`/api/v1/users/${userId}/avatar`, formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
  },
};

export const internshipPhaseApi = {
  // Get all phases
  getAllPhases: (search = "", page = 0, size = 10) =>
    axiosClient.get("/api/v1/internship-phases", {
      params: { search, page, size },
    }),

  // Get phase by ID
  getPhaseById: (phaseId) =>
    axiosClient.get(`/api/v1/internship-phases/${phaseId}`),

  // Create phase
  createPhase: (data) => axiosClient.post("/api/v1/internship-phases", data),

  // Update phase
  updatePhase: (phaseId, data) =>
    axiosClient.put(`/api/v1/internship-phases/${phaseId}`, data),

  // Delete phase
  deletePhase: (phaseId) =>
    axiosClient.delete(`/api/v1/internship-phases/${phaseId}`),
};

export const internshipAssignmentApi = {
  // Get all assignments
  getAllAssignments: (search = "", page = 0, size = 10) =>
    axiosClient.get("/api/v1/internship-assignments", {
      params: { search, page, size },
    }),

  // Get assignment by ID
  getAssignmentById: (assignmentId) =>
    axiosClient.get(`/api/v1/internship-assignments/${assignmentId}`),

  // Create assignment
  createAssignment: (data) =>
    axiosClient.post("/api/v1/internship-assignments", data),

  // Update assignment
  updateAssignment: (assignmentId, data) =>
    axiosClient.put(
      `/api/v1/internship-assignments/${assignmentId}/status`,
      data,
    ),

  // Update assignment status
  updateAssignmentStatus: (assignmentId, data) =>
    axiosClient.put(
      `/api/v1/internship-assignments/${assignmentId}/status`,
      data,
    ),
};

export const assessmentRoundsApi = {
  // Get all rounds
  getAllRounds: (search = "", phaseId = "", page = 0, size = 10) =>
    axiosClient.get("/api/v1/assessment-rounds", {
      params: { search, phaseId, page, size },
    }),

  // Get round by ID
  getRoundById: (roundId) =>
    axiosClient.get(`/api/v1/assessment-rounds/${roundId}`),

  // Create round
  createRound: (data) => axiosClient.post("/api/v1/assessment-rounds", data),

  // Update round
  updateRound: (roundId, data) =>
    axiosClient.put(`/api/v1/assessment-rounds/${roundId}`, data),

  // Delete round
  deleteRound: (roundId) =>
    axiosClient.delete(`/api/v1/assessment-rounds/${roundId}`),
};

export const evaluationCriteriaApi = {
  // Get all criteria
  getAllCriteria: (search = "", page = 0, size = 10) =>
    axiosClient.get("/api/v1/evaluation-criterias", {
      params: { search, page, size },
    }),

  // Get criteria by ID
  getCriteriaById: (criteriaId) =>
    axiosClient.get(`/api/v1/evaluation-criterias/${criteriaId}`),

  // Create criteria
  createCriteria: (data) =>
    axiosClient.post("/api/v1/evaluation-criterias", data),

  // Update criteria
  updateCriteria: (criteriaId, data) =>
    axiosClient.put(`/api/v1/evaluation-criterias/${criteriaId}`, data),

  // Delete criteria
  deleteCriteria: (criteriaId) =>
    axiosClient.delete(`/api/v1/evaluation-criterias/${criteriaId}`),
};

export const assessmentResultApi = {
  // Get all results
  getAllResults: (assignmentId = "", page = 0, size = 10, search = "") =>
    axiosClient.get("/api/v1/assessment-results", {
      params: { assignmentId, page, size, search },
    }),

  // Get result by ID
  getResultById: (resultId) =>
    axiosClient.get(`/api/v1/assessment-results/${resultId}`),

  // Create result
  createResult: (data) => axiosClient.post("/api/v1/assessment-results", data),

  // Update result
  updateResult: (resultId, data) =>
    axiosClient.put(`/api/v1/assessment-results/${resultId}`, data),
  saveBulkGrades: (data) =>
    axiosClient.post("/api/v1/assessment-results/bulk", data),
};
export const reportApi = {
  uploadReport: (file, title) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    return axiosClient.post("/api/v1/reports/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAllReports: (search = "", page = 0, size = 10) =>
    axiosClient.get("/api/v1/reports", {
      params: { search, page, size },
    }),

  downloadReport: (reportId) => {
    return axiosClient.get(`/api/v1/reports/download/${reportId}`, {
      responseType: "blob",
    });
  },
  getMyReports: () => {
    return axiosClient.get("/api/v1/reports/my-reports");
  },
  exportExcel: (search = "", page = 0, size = 10) =>
    axiosClient.get(`/api/v1/reports/export-excel`, {
      params: { search, page, size },
      responseType: "blob",
    }),
  exportZip: (search = "", page = 0, size = 100) =>
    axiosClient.get(`/api/v1/reports/export-zip`, {
      params: { search, page, size },
      responseType: "blob",
    }),

  gradeReport: (reportId, data) => axiosClient.put(`/api/v1/reports/${reportId}/grade`, data),
};

export const notificationApi = {
  getMyNotifications: () => {
    return axiosClient.get("/api/v1/notifications/my-notifications");
  },
  markAsRead: (id) => {
    return axiosClient.put(`/api/v1/notifications/${id}/read`);
  },
  markAllAsRead: () =>
    axiosClient.put("/api/v1/notifications/mark-all-as-read"),
};

export const dashboardApi = {
  getStats: () => axiosClient.get("/api/v1/dashboards/stats"),
  getMentorStats: () => axiosClient.get("/api/v1/dashboards/mentor-stats"),
  getStudentStats: () => axiosClient.get("/api/v1/dashboards/student-stats"),
};