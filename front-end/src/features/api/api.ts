import axios from "axios";

const api = axios.create({
	baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(config => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
	console.log('hello');
	
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api

