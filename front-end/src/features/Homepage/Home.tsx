import { useSelector } from 'react-redux';
import { Rootstate } from '../../app/store';
import Stats from './Stats';
import { useEffect, useState } from 'react';
import userService from '../user/user.service';
import { Matchs, PlayerStats } from '../../PropsType/Props';
import UserCard, { friend } from './UserCard';
import MatchComp from '../usePage/MatchComp';


const Home = () => {

	const user = useSelector((state: Rootstate) => state.user);
	const [stats, setStats] = useState<PlayerStats | null>(null);
	const [friends, setFriends] = useState<friend[] | null>(null);
	const [match, setMatch] = useState<Matchs[] | null>(null)
	const [avatar, setAvatar] = useState("")
	const [loading, setLoading] = useState<boolean>(true);
	
	useEffect(()=> {
		const promise1: Promise<PlayerStats> = userService.getSats();
		const promise2 =  userService.getFriends();
		const promise3 = userService.getMatch(user.id);
		const promise4 = userService.getMyAvatar();

		Promise.all([promise1, promise2, promise3, promise4]).then(([res1, res2, matchs, img]) => {
				setStats(res1);
				setFriends(res2);
				setMatch(matchs);
				setLoading(false);
				let url;
				if (!img)
					url = "/avatarDefault.png"
				else
					url = URL.createObjectURL(new Blob([img]));
				setAvatar(url)	
				
			})
			.catch((error) => {
				console.log(error);
			})
			return () => {
				if (avatar) {
					URL.revokeObjectURL(avatar);
				}
			}
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
							<img src={avatar} style={{ maxWidth: '150px' }} className="rounded float-end mt-3 img-thumbnail" alt="..."></img>
						</div>
						<Stats stats={stats} />
						<div className="col">
						<h4>Match history</h4>

						<table className="table table-dark table-striped">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Winner</th>
									<th scope="col">Loser</th>
									<th scope="col">*</th>
								</tr>
							</thead>

							<tbody>
								{match && match.map((match, i) => (
									<MatchComp key={match.id} match={match} index={i + 1} userId={user.id} />
								))}
							</tbody>
						</table>
					</div>
					</div>
				</div>
			</div>
		)
}

export default Home