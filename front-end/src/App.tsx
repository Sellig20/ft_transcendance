import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './features/login/Login';
import Auth from './features/login/Auth'
import Home from './features/Homepage/Home';
import ProtectedRoute from './features/login/ProtectedRoute';
import Navbar from './features/navbar/Navbar';
import UserSetting from './features/user/UserStetting';
import NotFound from './features/NotFound/NotFound';
// import { Chat } from './features/Chat'
import { useSelector } from 'react-redux';
import { Rootstate } from './app/store';
import { ToastContainer } from 'react-toastify';

import { Chat } from './features/chat/Chat'
const App = () => {
	
	const isAuth = useSelector((state: Rootstate) => state.user.connected);

	return (
		<div>
			<Router>
				{isAuth && <Navbar/>}
				<ToastContainer/>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/auth" element={<Auth />} />
					<Route element={<ProtectedRoute />} >
						<Route path="/chat" element={<Chat />} />
						<Route path='/home' element={<Home />} />
						<Route path='/user' element={<UserSetting />} />
					</Route>
					<Route path='*' element={<NotFound/>}/>
				</Routes>
			</Router>

		</div>
	);
};



export default App;