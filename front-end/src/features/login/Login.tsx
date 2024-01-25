// import { useState } from "react"
import login from './login.service'	


const Login: React.FC = () => {
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