import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export interface friend {
	id: number;
	username: string;
	user_status: string;
	elo: number;
	img_url: string;
}

interface UserCardProps {
	user: friend;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
	const navigate = useNavigate();

	const seeUserPage = () => {
		navigate(`/user/${user.id}`)
	}
	return (
		<Card style={{ width: '20rem' }}>
			{/* <Card.Img variant="top" src={user.img_url} /> */}
			<Card.Body onClick={seeUserPage}>
				<Card.Title>{user.username}</Card.Title>
				<Card.Subtitle className="mb-2 text-muted">{user.user_status}</Card.Subtitle>
				<Card.Text>
					Elo: {user.elo}
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default UserCard;