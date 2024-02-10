import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
	if (error.response.status === 401) {
		toast.error('please login', {
			position: "top-center",
			autoClose: false,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		})
	}
    if (error.response && error.response.data) {
		// console.log(error.response.data.error);
		toast.error(error.response.data.error, {
			position: "top-center",
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		})
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
});

export default api

