import { toast } from 'react-toastify';
import api from '../api/api';


// const setTfaOn = async (code: string) => {
// 	const request = await api.post('/auth/2fa/turn-on', {TFACode: code})
// 	return request.data
// }

const getUserById = async (iduser: number) => {
	try {
		const request = await api.get(`/chat/getUserById/${iduser}`)
		return request.data
		
	} catch (error) {
		return (null)
	}
}

const findAllChannelJoinedByIdUser = async (iduser: number) => {
	try {
		const request = await api.get(`/chat/findAllChannelJoinedByIdUser/${iduser}`)
		return request.data
		
	} catch (error) {
		return null
	}
}

const findAllInfoInChannelById = async (idchannel: number) => {
	try {
		const request = await api.get(`/chat/findAllInfoInChannelById/${idchannel}`)
		return request.data
	} catch (error) {
		return null
	}
}

const createChannel = async (
	name: string, 
	isPersonal: boolean,
	isPublic: boolean,
	idUser: number,
	password: string
) => {
	try {
		const response = await api.post('/chat/createChannel', {name: name, isPersonal: isPersonal, isPublic: isPublic, idUser: idUser, password: password})
		return response
	} catch (error){
		return null;
	}
}

const leaveChannelById = async (
	userid: number, 
	channelid: number,
) => {
	try {
		return await api.post('/chat/leaveChannelById', {userid: userid, channelid: channelid})
	} catch (error){
		return null;
	}
}

const banChannelById = async (
	userid: number, 
	channelid: number,
) => {
	try {
		await api.post('/chat/banChannelById', {userid: userid, channelid: channelid})
	} catch (error){
		return null;
	}
}

const blockUserById = async (
	userid: number, 
	userToBan: number,
) => {
	try {
		await api.post('/chat/blockUserById', {userid: userid, userToBlock: userToBan})
	} catch (error){
		return null;
	}
}

const setAdminById = async (
	channelId: number, 
	userToSet: number,
) => {
	try {
		await api.post('/chat/setAdminById', {channelId: channelId, userToSet: userToSet})
	} catch (error){
		return null;
	}
}

const muteById = async (
	channelId: number,
	userToMute: number,
) => {
	try {
		await api.post('/chat/muteById', {channelId: channelId, userId: userToMute})
	} catch (error){
		// console.log(error);
		return null;
	}
}

const inviteUser = async (
	channelid: number,
	userid: number,
) => {
	try {
		await api.post('/chat/inviteUser', {channelid: channelid, userid: userid})
	} catch (error){
		return null;
	}
}

const inviteUserId = async (
	channelid: number,
	userid: number,
) => {
	try {
		await api.post('/chat/inviteUserId', {channelid: channelid, userid: userid})
	} catch (error){
		return null;
	}
}

const changePassword = async (
	channelid: number,
	password: string,
) => {
	try {
		await api.post('/chat/changePassword', {channelid: channelid, password: password})
	} catch (error){
		return null;
	}
}

const findAllPublicChannel = async () => {
	try {
		const request = await api.get(`/chat/findAllPublicChannel/`)
		return request.data
	} catch (error) {
		return null
	}
}

const findAllChannelJoinedId = async (iduser: number) => {
	try {
		const request = await api.get(`/chat/findAllChannelJoinedId/${iduser}`)
		return request.data
	} catch (error) {
		return null
	}
}

export default {
	getUserById: getUserById,
	findAllChannelJoinedByIdUser: findAllChannelJoinedByIdUser,
	findAllInfoInChannelById: findAllInfoInChannelById,
	createChannel: createChannel,
	leaveChannelById: leaveChannelById,
	banChannelById: banChannelById,
	blockUserById: blockUserById,
	setAdminById:setAdminById,
	muteById: muteById,
	inviteUser: inviteUser,
	changePassword: changePassword,
	findAllPublicChannel: findAllPublicChannel,
	findAllChannelJoinedId: findAllChannelJoinedId,
	inviteUserId: inviteUserId

}