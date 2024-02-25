import React from 'react';
import { Matchs } from '../../PropsType/Props';

interface UserCardProps {
	match: Matchs;
	index: number;
	userId: number;
	// handle: (userId: number) => void;
}



const MatchComp: React.FC<UserCardProps> = ({ match, index, userId }) => {
	if (match.winnerId === userId) {
		return (
			<tr className="table-primary" >
				<th scope="row">{index}</th>
				<td>{match.winnerName}</td>
				<td>{match.loserName}</td>
				<td>WIN</td>
			</tr>
		);
	}
	else {
		return (
			<tr className="table-danger" >
				<th scope="row">{index}</th>
				<td>{match.winnerName}</td>
				<td>{match.loserName}</td>
				<td>LOSE</td>
			</tr>
		)
	}
};

export default MatchComp;