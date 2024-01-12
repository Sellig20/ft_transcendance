import { useState } from "react"



const Login: React.FC = () => {
	const [input, setInput] = useState({
		name: "",
		password: ""
	})

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput({
			...input,
			[event.target.name]: event.target.value
		})
	}
	const handleLogininfo = (e: React.FormEvent<HTMLFormElement>) => {
		
	}

	return (
		<div>
			<form onSubmit={handleLogininfo}>
				<input onChange={handleChange} name="name" value={input.name} />
				<br />
				<input onChange={handleChange} name="password" value={input.password} />
				<br />
				<button>login</button>
			</form>
		</div>
	)
}

export default Login