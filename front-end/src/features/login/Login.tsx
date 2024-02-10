const Login: React.FC = () => {

	const hanldeFTlogin = () => {
		window.location.href = 'http://localhost:8000/auth/42'
	}
	return (
		<div className="container-fluid d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
			<div className="text-center">
				<h1>FT_TRANSCENDANCE</h1>
				<button className="btn btn-primary" onClick={hanldeFTlogin}>Login 42</button>
			</div>
		</div>
	)
}

export default Login