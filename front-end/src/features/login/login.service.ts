import api from '../api/api'
import {userOnConnection} from './IUser'


const url = '/auth/42'
const urltest = '/user/test'


const get42 = async () => {
	const request = await api.get(url);
	console.log('hello');
	return request.data
}

const getUser = async (): Promise<userOnConnection> => {
	const request = await api.get('user/login');
	console.log(request);
	
	return request.data
}

const gettest = async () => {
	const request = await api.get(urltest);
	return request.data
}

const getLoginStatus = async () => {
	let req;
	try {
		req = await api.get('auth/login');
	} catch (error) {
		if (localStorage.getItem("token"))
			localStorage.removeItem("token")
		return null
	}
	return req.data
}

const postTFAauth = async (code: string, userId: number) => {
	const req = await api.post('auth/2fa/authenticate', {TFACode: code, idFront: userId});
	return req.data;
}

const getTfaOff = async () => {
	const req = await api.get('auth/2fa/off');
	localStorage.removeItem("token");
	localStorage.setItem("token", req.data.access_token);
	return req.data
}

export default {
	get42: get42,
	gettest: gettest,
	getUser: getUser,
	getLoginStatus: getLoginStatus,
	postTFAauth: postTFAauth,
	getTfaOff: getTfaOff
}