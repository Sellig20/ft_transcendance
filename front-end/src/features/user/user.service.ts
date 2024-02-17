import api from '../api/api';


const setTfaOn = async (code: string) => {
	const request = await api.post('/auth/2fa/turn-on', {TFACode: code})
	return request.data
}

const genQrcode = async () => {
	const request = await api.get('auth/2fa/generate')
	return request.data
}

const changeUserName = async (name: string) => {
	let response
	try {
		response = await api.post('/user/name', {name: name})
	} catch (error){
		return error;
	}
	return response.data
}

const uploadFile = async (file: FormData) => {
	let response; 
	try {
		// const authToken = localStorage.getItem('token');
		response = await api.post('/user/upload', file, {
			headers: {
				"Content-Type": "multipart/form-data",
			}
		})
	} catch (error) {
		return error;
	}
	return response.data
}

const getAvatar = async (filename: string) => {
	let response;
	try {
		response = await api.get(`user/avatar${filename}`, {
			responseType: 'blob',
		})
	} catch (error) {
		return error;
	}
	
	return response.data
}

const changeUserStatus = async (status: string) => {
	let response
	try {
		response = await api.patch('/user/changeStatus', {status: status})
	} catch (error){
		return error;
	}
	return response.data
}

const getUserStatus = async (id: string) => {
	let response
	try {
		response = await api.patch(`/user/status${id}`)
	} catch (error){
		return error;
	}
	return response.data
}

const getSats = async () => {
	let response
	try {
		response = await api.get(`/user/stats`)
	} catch (error){
		return error;
	}
	return response.data
}

export default {
	setTfaOn: setTfaOn,
	genQrcode: genQrcode,
	changeUserName: changeUserName,
	uploadFile: uploadFile,
	getAvatar: getAvatar,
	changeUserStatus: changeUserStatus,
	getUserStatus: getUserStatus,
	getSats: getSats

}