import Stats from '../Homepage/Stats';
import { useEffect, useState } from 'react';
import userService from '../user/user.service';
import { PlayerStats } from '../../PropsType/Props';
import { useNavigate, useParams } from 'react-router-dom';


const UserPage = () => {
	const navigate = useNavigate();
	const {userId} = useParams();
	let id: number;	
	if (userId && parseInt(userId)){
		id = parseInt(userId, 10);
	}
	const [stats, setStats] = useState<PlayerStats | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	
	useEffect(()=> {
		if (!id)
			navigate('/home');	
		const promise1: Promise<PlayerStats> =  userService.getSatsPlayer(id);
		const promise2 =  userService.getMatch(id);//

		Promise.all([promise1, promise2]).then(([res1, res2]) => {
			console.log(res1);
			console.log(res2);
			console.log(id);
			
				setStats(res1);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
			})

	}, [])

	if (loading) {
		return (
			<div className="row justify-content-center align-items-center vh-100">
				<div className="spinner-border " role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		)
	}
	else
		return (
			<div className="container text-center">
				<div className="row">
					<div className="col">
						<h4>Friends</h4>
					</div>
					<div className="col">
						<Stats stats={stats} />
					</div>
				</div>
			</div>
		)
}

export default UserPage