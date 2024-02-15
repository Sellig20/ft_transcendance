import { useEffect, useRef, useState } from "react"
import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from './login.service'
import { addAvatar, addUser } from "../user/user.store";
import loginService from "./login.service";
import { toast } from "react-toastify";

const Auth = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const count = useRef(0);
	const [tfa, setTfa] = useState(false)
	const [code, setCode] = useState("")

	

	// useIsNotAuth();
	useEffect(() => {

		if (localStorage.getItem("token"))
			navigate('/home')
		
		if (count.current === 0) {
			
			const queryparms = new URLSearchParams(window.location.search);
			const tmp = queryparms.get('code');
			const tfa = queryparms.get('tfa');

			if (tfa === 'OFF') {
				if (tmp)
					localStorage.setItem("token", tmp);
					userService.setAvatar().then((rawImg) => {
					const url = URL.createObjectURL(new Blob([rawImg]));
					dispatch(addAvatar(url))
				})
				userService.getUser().then(user => dispatch(addUser(user)));
				toast.success("you are logged in", {autoClose: false});
				navigate('/home');
			}
			else {
				setTfa(true);
			}
		}
		count.current++;

	}, [])

	const handleTfa = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const queryparms = new URLSearchParams(window.location.search);
		const urlcode = queryparms.get('code');
		const tfa = queryparms.get('tfa');
		const userId = queryparms.get('userId');

		if (tfa === 'ON' && urlcode === 'none' && userId) {
			const { access_token } = await loginService.postTFAauth(code, Number(userId));
			if (access_token) {
				localStorage.setItem("token", access_token);
				const user = await userService.getUser();
				dispatch(addUser(user));
				navigate('/home');
				// console.log(access_token);
			}
			else 
				navigate('/');
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