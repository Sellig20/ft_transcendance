import { useSelector } from 'react-redux';
import { Rootstate } from '../../app/store';
import Stats from './Stats';
import { useEffect, useState } from 'react';
import userService from '../user/user.service';
import { PlayerStats } from '../../PropsType/Props';


const Home = () => {
	const [stats, setStats] = useState<PlayerStats | null>(null);
	const user = useSelector((state: Rootstate) => state.user);
	useEffect(()=> {
		userService.getSats().then(stats => {
			setStats(stats);
			console.log(stats);
			
		})
	}, [])



	console.log(user);
	




	return(

		<div className="container text-center">
			<div className="row">
				<div className="col">
					1 of 2
				</div>
				<div className="col">
					<Stats stats={stats}/>
				</div>
			</div>
		</div>

	)
}

export default Home