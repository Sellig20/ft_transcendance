import api from '../api/api';


const setTfaOn = async (code: string) => {
	const request = await api.post('/auth/2fa/turn-on', {TFACode: code})
	return request.data
}

const genQrcode = async () => {
	const request = await api.get('auth/2fa/generate')
	return request.data
}

export default {
	setTfaOn: setTfaOn,
	genQrcode: genQrcode,

}