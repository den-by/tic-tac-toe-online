import axios from 'axios';

const token = sessionStorage.getItem('token');
const { VITE_SERVER_URL } = import.meta.env;

const axiosInstance = axios.create({
  headers: { Authorization: `Bearer ${token}` },
  withCredentials: true,
  baseURL: VITE_SERVER_URL,
});

export default axiosInstance;
