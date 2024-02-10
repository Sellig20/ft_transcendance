import { Outlet } from 'react-router-dom';
import React from 'react';
import useIsAuth from '../hook/useIsAuth';

const ProtectedRoute: React.FC = () => {
	useIsAuth()
	return <Outlet/>
}
export default ProtectedRoute