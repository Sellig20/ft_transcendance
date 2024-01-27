import { Outlet } from 'react-router-dom';
import useIsAuth from '../hook/useIsAuth';

const ProtectedRoute = () => {
	useIsAuth()
	return(
		<Outlet/>
	)
}
export default ProtectedRoute