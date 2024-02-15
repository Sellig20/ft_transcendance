import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { Rootstate } from '../../app/store';
import { useEffect } from 'react';
import userService from '../user/user.service';
import api from '../api/api'
import { addAvatar } from '../user/user.store';



const Home = () => {

	const user = useSelector((state: Rootstate) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		// const setAvatar = async () => {
		// 	let req;
		// 	let response;
		// 	try {
		// 		req = await api.get('user/myavatar');
		// 		if (req.data === 'placeholder')
		// 			return null
		// 		response = await userService.getAvatar(req.data);
		// 	} catch (error) {
		// 		return null
		// 	}
		// 	return response.data
		// }

		// setAvatar().then( rep => {
		// 			const rawImg = rep;
		// 			const url = URL.createObjectURL(new Blob([rawImg]));
		// 			dispatch(addAvatar(url))
		// })

	}, [])


	console.log(user);
	
	const navigate = useNavigate();

	const handleUser = () => {
		navigate('/user');
	}
	const handleGame = () => {
		navigate('/game');
	}
	const handleChat = () => {
		navigate('/chat');
	}

	return(

		<div>
			en sah c'est beau
			<button onClick={handleUser}>settings</button>
			<button onClick={handleGame}>game</button>
			<button onClick={handleChat}>chat</button>
		</div>
	)
}

export default Home