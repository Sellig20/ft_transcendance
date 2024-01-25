import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './features/login/Login';
import Home frome 

const App = () => {

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/signin" element={<Login />} />
					<Route element={<ProtectedRoute />} />
						<Route path='/home' element={<Home />}/>
				</Routes>
			</Router>

		</div>
	);
};



export default App;