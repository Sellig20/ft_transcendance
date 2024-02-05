import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { Rootstate } from "../../app/store";


function useIsNotAuth() {

	const user = useSelector((state: Rootstate) => state.user.connected)
	const count = useRef(0);
	const navigate = useNavigate()
	useEffect(() => {
		if (count.current === 0) {
			if (user) {
				console.log('user: ', user)
				navigate('/home');
			}
			else {
				console.log('you are not connected, user: ', user);
				return;
			}
		}
		count.current++;
	}, [])
}

export default useIsNotAuth