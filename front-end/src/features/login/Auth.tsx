import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from './login.service'
import { addUser } from "./login";
import loginService from "./login.service";
import { Rootstate } from "../../app/store";

const Auth = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const count = useRef(0);
	const [tfa, setTfa] = useState(false)
	const [code, setCode] = useState("")


	// const user = useSelector((state: Rootstate) => state.logedin.connected);
	// useIsNotAuth();
	useEffect(() => {

		// if (user || localStorage.getItem("token")){
		// 	userService.getUser().then(user => dispatch(addUser(user)));
		// 	navigate('/home')
		// 	return;
		// }
		// console.log('hello');
		
		if (count.current === 0) {
			
			const queryparms = new URLSearchParams(window.location.search);
			const tmp = queryparms.get('code');
			const tfa = queryparms.get('tfa');

			if (tmp)
				localStorage.setItem("token", tmp);
			if (tfa === 'OFF') {
				userService.getUser().then(user => dispatch(addUser(user)));
				navigate('/home')
			}
			else {
				setTfa(true)
			}
		}
		count.current++;

	}, [])

	const handleTfa = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { access_token } = await loginService.postTFAauth(code);
		if (access_token) {
			localStorage.setItem("token", access_token);
			const user = await userService.getUser()
			dispatch(addUser(user))
			navigate('/home')
			// console.log(access_token);
		}
	}
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value);
	}


	return (
		<>{tfa &&
			<form onSubmit={handleTfa}>
				<input onChange={handleChange} name="code" type="number" value={code} />
			</form>
		}
		</>
	)
}

export default Auth