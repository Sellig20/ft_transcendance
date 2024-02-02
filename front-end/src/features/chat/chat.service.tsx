import api from '../api/api';


// const setTfaOn = async (code: string) => {
// 	const request = await api.post('/auth/2fa/turn-on', {TFACode: code})
// 	return request.data
// }

const getUserById = async (iduser: number) => {
	const request = await api.get(`/chat/getUserById/${iduser}`)
	return request.data
}

export default {
	getUserById: getUserById,

}