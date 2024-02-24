import { PlayerStats } from '../../PropsType/Props';

interface ChildCompProp {
	stats: PlayerStats | null;
}

const Stats: React.FC<ChildCompProp> = ({ stats }) => {

	if (stats) {
		return (
			<>
				<div className="row">
					<h3>{stats.username} Stats</h3>
					<table className="table table-dark table-striped">
						<tbody>
							<tr>
								<th scope="row">Number of Losses</th>
								<td>{stats && stats.lose}</td>
							</tr>
							<tr>
								<th scope="row">Number of Wins</th>
								<td>{stats && stats.win}</td>
							</tr>
							<tr>
								<th scope="row">Level</th>
								<td>{stats && stats.level}</td>
							</tr>
							<tr>
								<th scope="row">Elo</th>
								<td>{stats && stats.elo}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="row">
					<h4>Achievements</h4>

					<table className="table table-dark table-striped">
						<tbody>
							<tr>
								<th scope="row">Get to level 5</th>
								{stats.success_one && 
									<td>GREAT SUCCESS</td>
								}
								{!stats.success_one &&
									<td>not done</td>
								}	
							</tr>
							<tr>
								<th scope="row">Add a Friend</th>
								{stats.success_two && 
									<td>GREAT SUCCESS</td>
								}
								{!stats.success_two &&
									<td>not done</td>
								}	
							</tr>
							<tr>
								<th scope="row">Play 10 games</th>
								{stats.success_three && 
									<td>GREAT SUCCESS</td>
								}
								{!stats.success_three &&
									<td>not done</td>
								}	
							</tr>
						</tbody>
					</table>
				</div>
			</>
		)
	}
	return (
		<div>No stats</div>
	)
}

export default Stats