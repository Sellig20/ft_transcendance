import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './features/login/Login';
import Auth from './features/login/Auth'
import Home from './features/login/Home';
import ProtectedRoute from './features/login/ProtectedRoute';

const App = () => {

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/auth" element={<Auth />} />
					<Route element={<ProtectedRoute />} />
						<Route path='/home' element={<Home />}/>
				</Routes>
			</Router>

		</div>
	);
};



export default App;