import { api } from './client';

const unwrap = (response) => response.data;

export const authApi = {
  login: (email, password, asAdmin) => api.post('/auth/login', { email, password, asAdmin }).then(unwrap),
  register: (fullName, email, password) => api.post('/auth/register', { fullName, email, password }).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
};

export const categoryApi = {
  list: () => api.get('/categories').then(unwrap),
  createCourse: (kode, nama) => api.post('/courses', { kode, nama }).then(unwrap),
  updateCourse: (id, kode, nama) => api.put(`/courses/${id}`, { kode, nama }).then(unwrap),
  deleteCourse: (id) => api.delete(`/courses/${id}`).then(unwrap),
  createGenre: (nama, contentType) => api.post('/genres', { nama, contentType }).then(unwrap),
  updateGenre: (id, nama, contentType) => api.put(`/genres/${id}`, { nama, contentType }).then(unwrap),
  deleteGenre: (id) => api.delete(`/genres/${id}`).then(unwrap),
};

export const contentApi = {
  list: (params) => api.get('/contents', { params }).then(unwrap),
  detail: (id) => api.get(`/contents/${id}`).then(unwrap),
  create: (formData) => api.post('/contents', formData).then(unwrap),
  update: (id, formData) => api.put(`/contents/${id}`, formData).then(unwrap),
  remove: (id) => api.delete(`/contents/${id}`).then(unwrap),
  setStatus: (id, isActive) => api.put(`/contents/${id}/status`, { isActive }).then(unwrap),
  // Berkas diambil sebagai blob (bukan src iframe langsung) agar membawa
  // header Authorization; iframe menampilkan object URL dari blob tersebut.
  fileBlobUrl: async (id) => {
    const response = await api.get(`/contents/${id}/file`, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  },
};

export const adminApi = {
  stats: () => api.get('/admin/stats').then(unwrap),
  activityLogs: (params) => api.get('/admin/activity-logs', { params }).then(unwrap),
  users: () => api.get('/admin/users').then(unwrap),
};
