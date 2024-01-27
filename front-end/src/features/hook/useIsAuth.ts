import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import login from '../login/login.service'
import { useRef } from "react";

function useIsAuth() {
	const count = useRef(0);
	const navigate = useNavigate()
	useEffect(() => {
		if (count.current === 0)
		login.getLoginStatus().then(login => {
			if (login) {
				return true;
			}
			else {
				navigate('/')
			}
		})
		count.current++;
	}, [])
}

export default useIsAuth