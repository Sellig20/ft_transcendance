// import { useState } from "react"
import login from './login.service'	


const Login: React.FC = () => {
// 	const [input, setInput] = useState({
// 		name: "",
// 		password: ""
// 	})

	// const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	setInput({
	// 		...input,
	// 		[event.target.name]: event.target.value
	// 	})
	// }
	const hanldeFTlogin =  () => {
		window.location.href = 'http://localhost:8000/auth/42'
	}
	const handletest = () => {
		login.gettest()
	}

	return (
		<div>
			<button onClick={hanldeFTlogin}>login 42</button>
			<button onClick={handletest}>TEST</button>
		</div>
	)
}

export default Login