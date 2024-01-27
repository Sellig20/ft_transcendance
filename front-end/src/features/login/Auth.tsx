import { useEffect, useRef} from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from './login.service'
import { addUser } from "./login";

const Auth = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const count = useRef(0);

	useEffect(() => {
		if (count.current === 0) {
			const queryparms = new URLSearchParams(window.location.search);
			const tmp = queryparms.get('code');
			if (tmp)
				localStorage.setItem("token", tmp);
			userService.getUser().then(user => dispatch(addUser(user)));
			navigate('/home')
		}
		count.current++;

	}, [])



	return (<></>)
}

export default Auth