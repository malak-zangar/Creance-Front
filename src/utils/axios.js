import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5555/',
});

api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
