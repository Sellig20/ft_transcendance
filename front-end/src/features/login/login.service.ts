import api from '../api/api'
import {userOnConnection} from './IUser'


const getUser = async (): Promise<userOnConnection> => {
	const request = await api.get('user/login');
	console.log(request);
	
	return request.data
}

const getLoginStatus = async () => {
	let req;
	try {
		req = await api.get('auth/login');
		console.log(req.data);
	} catch (error) {
		console.log("in error");
		return null;
	}
	return req.data
}

const postTFAauth = async (code: string, userId: number) => {
	try {
		const req = await api.post('auth/2fa/authenticate', { TFACode: code, idFront: userId });
		console.log(req.data);
		return req.data.access_token;
	} catch (error) {
		return null;
	}

}

const getTfaOff = async () => {
	const req = await api.get('auth/2fa/off');
	localStorage.removeItem("token");
	localStorage.setItem("token", req.data.access_token);
	return req.data
}




const setAvatar = async () => {
	let response;
	try {
		response = await api.get('user/myavatar', {
			responseType: 'blob',
		});
	} catch (error) {
		return null
	}
	return response.data
}

export default {
	getUser: getUser,
	getLoginStatus: getLoginStatus,
	postTFAauth: postTFAauth,
	getTfaOff: getTfaOff,
	setAvatar: setAvatar,
}