import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import login from './login.service'
import usePageCloseDetection from '../hook/usePageClose';
import { useDispatch } from 'react-redux';
import { logout } from '../user/user.store';

const ProtectedRoute: React.FC = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	usePageCloseDetection(() => {
	});

	useEffect(() => {
		login.getLoginStatus().then(rep => {
			if (!rep) {
				if (localStorage.getItem("token"))
					localStorage.removeItem("token")
				dispatch(logout());
				navigate('/')
			}
			else
				setLoading(false)
		});
	})
	return (
		<>
			{!loading && <Outlet />}
		</>
	) 
				
}
export default ProtectedRoute