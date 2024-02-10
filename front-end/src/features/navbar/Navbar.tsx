import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { logout } from '../user/user.store';
import { Socket, io } from "socket.io-client";
import { Rootstate } from '../../app/store';
import { useSelector } from 'react-redux';

const Navbar = () => {

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		// disconnect la socket ici mais j'ai la flemme la
		// const so = useSelector((state: Rootstate) => state.user.socket);
		// console.log(so)
		dispatch(logout());
		localStorage.removeItem("token");
		navigate('/');
	}

	const handleUser = () => {
		navigate('/user');
	}
	const handleGame = () => {
		navigate('/game');
	}
	const handleChat = () => {
		navigate('/chat');
	}
	const handleHome = () => {
		navigate('/home');
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid justify-content-center">
				<ul className="nav nav-tabs">
					<li className="nav-item">
						<a className="nav-link" onClick={handleLogout} >Logout</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" onClick={handleHome} >Home</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" onClick={handleGame}>Game</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" onClick={handleChat}>Chat</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" onClick={handleUser}>Settings</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navbar