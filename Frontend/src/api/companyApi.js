import axiosClient from "./axiosClient";

const companyApi = {
  getAllCompanies(params) {
    const url = "/api/v1/companies";
    return axiosClient.get(url, { params });
  },

  getCompanyById(id) {
    const url = `/api/v1/companies/${id}`;
    return axiosClient.get(url);
  },

  createCompany(data) {
    const url = "/api/v1/companies";
    return axiosClient.post(url, data);
  },

  updateCompany(id, data) {
    const url = `/api/v1/companies/${id}`;
    return axiosClient.put(url, data);
  },

  deleteCompany(id) {
    const url = `/api/v1/companies/${id}`;
    return axiosClient.delete(url);
  },
};

export default companyApi;
