import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './features/login/Login';
import Auth from './features/login/Auth'
import Home from './features/login/Home';
import ProtectedRoute from './features/login/ProtectedRoute';
import UserPage from './features/user/UserPage'

import { Chat } from './features/chat/Chat'
const App = () => {

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/auth" element={<Auth />} />
					<Route path="/chat" element={<Chat />} />
					<Route element={<ProtectedRoute />} />
						<Route path='/home' element={<Home />}/>
						<Route path='/user' element={<UserPage />}/>
				</Routes>
			</Router>

		</div>
	);
};



export default App;