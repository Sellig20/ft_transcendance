import axios from "axios";

const api = axios.create({
	baseURL: 'http://localhost:8000',
})

// const getToken = (): string | null => {

// 	return null
// }

// api.interceptors.request.use(
// 	config => {
// 		config.headers["Autorization"] = "Bearer " + getToken();
// 		return config;
// 	},
// 	(error) => {
// 		Promise.reject(error);
// 	}
// )

export default api

