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

export default {
	setTfaOn: setTfaOn,
	genQrcode: genQrcode,
	changeUserName: changeUserName,
	uploadFile: uploadFile

}