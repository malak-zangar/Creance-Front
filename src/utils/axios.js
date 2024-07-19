import { notification } from 'antd';
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
    console.log(config)
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        
          notification.error({
            description:
              error?.response?.data?.erreur ||
              "Token expiré. Reconnectez-vous SVP.",
          });
        
        console.log('Token expiré. Reconnectez-vous SVP.');
        window.location.href = '/login';
      } else {
        console.error('Erreur HTTP:', error.response.status);
      }
    } 
    return Promise.reject(error);
  }
);

export default api;
