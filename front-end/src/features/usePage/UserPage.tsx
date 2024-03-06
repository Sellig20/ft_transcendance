import Stats from '../Homepage/Stats';
import { useEffect, useState } from 'react';
import userService from '../user/user.service';
import { Matchs, PlayerStats } from '../../PropsType/Props';
import { useNavigate, useParams } from 'react-router-dom';
import MatchComp from './MatchComp';


const UserPage = () => {
	const navigate = useNavigate();
	const {userId} = useParams();
	let id: number;	
	if (userId && parseInt(userId)){
		id = parseInt(userId, 10);
	}
	const [stats, setStats] = useState<PlayerStats | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [match, setMatch] = useState<Matchs[] | null>(null)
	const [avatar, setAvatar] = useState("")

	useEffect(() => {
		if (!id)
			navigate('/home');
		const promise1: Promise<PlayerStats> = userService.getSatsPlayer(id);
		const promise2 = userService.getMatch(id);
		const promise3 = userService.getAvatarById(id);

		Promise.all([promise1, promise2, promise3]).then(([stats, matchs, img]) => {
			let url;
			if (!img)
				url = "/avatarDefault.png"
			else
				url = URL.createObjectURL(new Blob([img]));
			setStats(stats);
			setMatch(matchs);
			setAvatar(url)
			setLoading(false);
		})
			.catch(() => {
				// console.log(error);
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
						<h4>Match history</h4>

						<table className="table table-dark table-striped">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Winner</th>
									<th scope="col">Loser</th>
									<th scope="col">Welo</th>
									<th scope="col">vs</th>
									<th scope="col">Lelo</th>
									<th scope="col">*</th>
								</tr>
							</thead>

							<tbody>
								{match && match.map((match, i) => (
									<MatchComp key={match.id} match={match} index={i + 1} userId={id} />
								))}
							</tbody>
						</table>


					</div>
					<div className="col">
						<div className="row justify-content-center">
							<img src={avatar} style={{ maxWidth: '150px' }} className="rounded float-end mt-3 img-thumbnail" alt="..."></img>
						</div>
						<Stats stats={stats} />
					</div>
				</div>
			</div>
		)
}

export default UserPage