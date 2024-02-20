import React from 'react';
import { Card, Button } from 'react-bootstrap';

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
  return (
    <Card style={{ width: '20rem'}}>
      {/* <Card.Img variant="top" src={user.img_url} /> */}
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{user.user_status}</Card.Subtitle>
        <Card.Text>
          ID: {user.id}<br />
          Elo: {user.elo}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default UserCard;