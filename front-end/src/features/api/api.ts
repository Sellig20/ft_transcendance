import axios from "axios";

const api = axios.create({
	baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(config => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use((response) => {

    return response;
}, (error) => {
	if(error.response.status === 401) {
        console.log('uncool bros');
		
    }
    if (error.response && error.response.data) {
		console.log(error.response.status);
		
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
});

export default api

