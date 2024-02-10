import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import login from './login.service'

const ProtectedRoute: React.FC = () => {

	const count = useRef(0);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (count.current === 0)
			login.getLoginStatus().then( rep => {
				if (!rep)
					navigate('/')
				else 
					setLoading(false)
		});
		count.current++;
	})
	return(
		<>
			{!loading && <Outlet/>}
		</>
	) 
				
}
export default ProtectedRoute