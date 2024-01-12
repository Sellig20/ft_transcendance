import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './features/login/Login';

const App = () => {

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/signin" element={<Login />} />
				</Routes>
			</Router>

		</div>
	);
};



export default App;