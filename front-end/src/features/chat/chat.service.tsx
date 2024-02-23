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

const createChannel = async (
	name: string, 
	isPersonal: boolean,
	isPublic: boolean,
	idUser: number,
	password: string
) => {
	let response
	try {
		response = await api.post('/chat/createChannel', {name: name, isPersonal: isPersonal, isPublic: isPublic, idUser: idUser, password: password})
	} catch (error){
		console.log(error);
		return error;
	}
	return response.data
}

const leaveChannelById = async (
	userid: number, 
	channelid: number,
) => {
	let response
	try {
		response = await api.post('/chat/leaveChannelById', {userid: userid, channelid: channelid})
	} catch (error){
		console.log(error);
		return error;
	}
	return response
}

const banChannelById = async (
	userid: number, 
	channelid: number,
) => {
	let response
	try {
		response = await api.post('/chat/banChannelById', {userid: userid, channelid: channelid})
	} catch (error){
		console.log(error);
		return error;
	}
	return response
}

const blockUserById = async (
	userid: number, 
	userToBan: number,
) => {
	let response
	try {
		response = await api.post('/chat/blockUserById', {userid: userid, userToBlock: userToBan})
	} catch (error){
		console.log(error);
		return error;
	}
	return response
}

const setAdminById = async (
	channelId: number, 
	userToSet: number,
) => {
	let response
	try {
		response = await api.post('/chat/setAdminById', {channelId: channelId, userToSet: userToSet})
	} catch (error){
		console.log(error);
		return null;
	}
	return response
}

export default {
	getUserById: getUserById,
	findAllChannelJoinedByIdUser: findAllChannelJoinedByIdUser,
	findAllInfoInChannelById: findAllInfoInChannelById,
	createChannel: createChannel,
	leaveChannelById: leaveChannelById,
	banChannelById: banChannelById,
	blockUserById: blockUserById,
	setAdminById:setAdminById

}