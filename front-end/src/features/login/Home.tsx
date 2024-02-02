import { useSelector } from 'react-redux';
import useIsAuth from '../hook/useIsAuth'
import { useNavigate } from 'react-router-dom'
import { Rootstate } from '../../app/store';



const Home = () => {

	const user = useSelector((state: Rootstate) => state.user);
	console.log(user);
	
	const navigate = useNavigate();
	useIsAuth()

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