import api from '../api/api'
const url = '/auth/42'
const urltest = '/user/test'

const get42 = async () => {
	const request = await api.get(url);
	console.log('hello');
	return request.data
}

const gettest = async () => {
	const request = await api.get(urltest);
	return request.data
}
export default {
	get42: get42,
	gettest: gettest
}