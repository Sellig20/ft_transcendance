import useIsAuth from '../hook/useIsAuth'
import { useNavigate } from 'react-router-dom'



const Home = () => {
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
			you are home
			<button onClick={handleUser}>settings</button>
			<button onClick={handleGame}>game</button>
			<button onClick={handleChat}>chat</button>
		</div>
	)
}

export default Home