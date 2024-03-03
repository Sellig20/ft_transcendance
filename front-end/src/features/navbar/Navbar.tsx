import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { logout } from '../user/user.store';
import userService from '../user/user.service';

const Navbar = () => {

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = async () => {
		// disconnect la socket ici mais j'ai la flemme la
		// const so = useSelector((state: Rootstate) => state.user.socket);
		// console.log(so)
		await userService.changeUserStatus("offline");
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
	const handleRepertory = () => {
		navigate('/repertory');
	}

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
			<a className="" href="https://profile.intra.42.fr/" style={{paddingLeft: 10}} >
				<img src="/42_Logo.svg.png" alt="Logo" width="35" height="35" className="img-thumbnail bg-light"></img>
			</a>
			<div className="justify-content-center">
				<ul className="navbar-nav">


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
					<li className="nav-item">
						<a className="nav-link" onClick={handleRepertory}>Repertory</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navbar