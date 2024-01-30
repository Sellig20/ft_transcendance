import { Outlet} from "react-router-dom"
import useIsAuth from '../hook/useIsAuth'



const Home = () => {
	useIsAuth()
	return(
		<div>
			you are home
			<Outlet/>
		</div>
	)
}

export default Home