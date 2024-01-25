import { Outlet, useNavigate } from "react-router-dom"



const Home = () => {
	// const navigate = useNavigate();
	// const { isAuthenticated } = useAuth();
	// if (!isAuthenticated){
	// 	navigate('/');
	// }
	return(
		<div>
			you are home
			<Outlet/>
		</div>
	)
}

export default Home