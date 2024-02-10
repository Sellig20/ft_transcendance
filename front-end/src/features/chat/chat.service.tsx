import api from '../api/api';


// const setTfaOn = async (code: string) => {
// 	const request = await api.post('/auth/2fa/turn-on', {TFACode: code})
// 	return request.data
// }

const getUserById = async (iduser: number) => {
	const request = await api.get(`/chat/getUserById/${iduser}`)
	return request.data
}

const findAllChannelJoinedByIdUser = async (iduser: number) => {
	const request = await api.get(`/chat/findAllChannelJoinedByIdUser/${iduser}`)
	return request.data
}

const findAllInfoInChannelById = async (idchannel: number) => {
	const request = await api.get(`/chat/findAllInfoInChannelById/${idchannel}`)
	return request.data
}

export default {
	getUserById: getUserById,
	findAllChannelJoinedByIdUser: findAllChannelJoinedByIdUser,
	findAllInfoInChannelById: findAllInfoInChannelById

}