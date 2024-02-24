import { useSelector } from 'react-redux';
import { Rootstate } from '../../app/store';
import Stats from './Stats';
import { useEffect, useState } from 'react';
import userService from '../user/user.service';
import { PlayerStats } from '../../PropsType/Props';
import UserCard, { friend } from './UserCard';


const Home = () => {
	const [stats, setStats] = useState<PlayerStats | null>(null);
	const [friends, setFriends] = useState<friend[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const user = useSelector((state: Rootstate) => state.user);
	
	useEffect(()=> {
		const promise1: Promise<PlayerStats> =  userService.getSats();
		const promise2 =  userService.getFriends();
		Promise.all([promise1, promise2]).then(([res1, res2]) => {
				setStats(res1);
				setFriends(res2);
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
						{friends && friends.map(friend => (
							<UserCard key={friend.id} user={friend} />
						))}
					</div>
					<div className="col container">
						<div className="row justify-content-center">
							{user.img &&
								<img src={user.img} style={{ maxWidth: '150px' }} className="rounded float-end mt-3 img-thumbnail" alt="..."></img>
							}
						</div>
						<Stats stats={stats} />
					</div>
				</div>
			</div>
		)
}

export default Home