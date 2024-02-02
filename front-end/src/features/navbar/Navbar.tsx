import { useNavigate } from 'react-router-dom'

const Navbar = () => {


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
	const handleHome = () => {
		navigate('/home');
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid justify-content-center">
				<ul className="nav nav-tabs">
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