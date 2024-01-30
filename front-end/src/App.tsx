import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './features/login/Login';
import Auth from './features/login/Auth'
import { Chat } from './features/Chat'
const App = () => {

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/auth" element={<Auth />} />
					{/* <Route path="/chat" element={<Chat />} /> */}
					{/* <Route element={<ProtectedRoute />} />
						<Route path='/home' element={<Home />}/> */}
				</Routes>
			</Router>

		</div>
	);
};



export default App;