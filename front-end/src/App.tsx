import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './features/login/Login';
import Auth from './features/login/Auth'
import Home from './features/login/Home';
import ProtectedRoute from './features/login/ProtectedRoute';
import UserPage from './features/user/UserPage'
import Navbar from './features/navbar/Navbar';
// import { Chat } from './features/Chat'
import { useSelector } from 'react-redux';
import { Rootstate } from './app/store';

import { Chat } from './features/chat/Chat'
const App = () => {
	
	const isAuth = useSelector((state: Rootstate) => state.user.connected);

	return (
		<div>
			<Router>
				{isAuth && <Navbar/>}
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/auth" element={<Auth />} />
					<Route path="/chat" element={<Chat />} />
					<Route element={<ProtectedRoute />} />
						<Route path='/home' element={<Home />} />
						<Route path='/user' element={<UserPage />} />
				</Routes>
			</Router>

		</div>
	);
};



export default App;