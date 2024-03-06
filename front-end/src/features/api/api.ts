import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({
	baseURL: `http://${process.env.HOST_IP}:8000`,
});

api.interceptors.request.use(config => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
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
		//console.log(error.response.data);
		
		let notif;
		if (error.response.data.statusCode === 400 && error.response.data.message instanceof Array)
			notif = error.response.data.message[0];
		else if (error.response.data.statusCode === 400 && error.response.data.message)
			notif = error.response.data.message;
		else 
			notif = error.response.data.error

		toast.error(notif, {
			position: "top-center",
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		})
    }
    return Promise.reject(error);
});

export default api

