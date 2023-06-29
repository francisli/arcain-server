import axios from 'axios';

const instance = axios.create({
  headers: {
    Accept: 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

const Api = {
  assets: {
    create(data) {
      return instance.post('/api/assets', data);
    },
    upload(url, headers, file) {
      return instance.put(url, file, { headers });
    },
  },
  auth: {
    login(email, password) {
      return instance.post('/api/auth/login', { email, password });
    },
    logout() {
      return instance.get('/api/auth/logout');
    },
    register(data) {
      return instance.post('/api/auth/register', data);
    },
  },
  invites: {
    index() {
      return instance.get(`/api/invites`);
    },
    create(data) {
      return instance.post('/api/invites', data);
    },
    get(id) {
      return instance.get(`/api/invites/${id}`);
    },
    accept(id, data) {
      return instance.post(`/api/invites/${id}/accept`, data);
    },
    resend(id) {
      return instance.post(`/api/invites/${id}/resend`);
    },
    revoke(id) {
      return instance.delete(`/api/invites/${id}`);
    },
  },
  pages: {
    index() {
      return instance.get(`/api/pages`);
    },
    create(data) {
      return instance.post(`/api/pages`, data);
    },
    get(id) {
      return instance.get(`/api/pages/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/pages/${id}`, data);
    },
  },
  passwords: {
    reset(email) {
      return instance.post('/api/passwords', { email });
    },
    get(token) {
      return instance.get(`/api/passwords/${token}`);
    },
    update(token, password) {
      return instance.patch(`/api/passwords/${token}`, { password });
    },
  },
  photos: {
    index({ ProjectId, showAll } = {}) {
      return instance.get(`/api/photos`, { params: { ProjectId, showAll } });
    },
    create(data) {
      return instance.post(`/api/photos`, data);
    },
    reorder(data) {
      return instance.patch(`/api/photos/reorder`, data);
    },
    get(id) {
      return instance.get(`/api/photos/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/photos/${id}`, data);
    },
  },
  projects: {
    index({ showAll } = {}) {
      return instance.get(`/api/projects`, { params: { showAll } });
    },
    create(data) {
      return instance.post(`/api/projects`, data);
    },
    reorder(data) {
      return instance.patch(`/api/projects/reorder`, data);
    },
    get(id) {
      return instance.get(`/api/projects/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/projects/${id}`, data);
    },
  },
  users: {
    index() {
      return instance.get(`/api/users`);
    },
    me() {
      return instance.get('/api/users/me');
    },
    get(id) {
      return instance.get(`/api/users/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/users/${id}`, data);
    },
  },
};

export default Api;
