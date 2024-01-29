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
	const req = await api.get('auth/login');
	return req.data
}
export default {
	get42: get42,
	gettest: gettest,
	getUser: getUser,
	getLoginStatus: getLoginStatus
}