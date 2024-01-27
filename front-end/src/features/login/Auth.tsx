import { useEffect, useState, useRef} from "react"
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
			console.log('av que le token soit save ds le local', tmp);
			if (tmp)
				localStorage.setItem("token", tmp);
			console.log('apres que le token soit save ds le local', localStorage.getItem("token"));

			userService.getUser().then(user => dispatch(addUser(user)));
			navigate('/home')
		}
		count.current++;

	}, [])



	return (<></>)
}

export default Auth