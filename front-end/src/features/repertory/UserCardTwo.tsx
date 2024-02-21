import React from 'react';

export interface friend {
  id: number;
  username: string;
  user_status: string;
  elo: number;
  img_url: string;
}

interface UserCardProps {
	user: friend;
	handle: (userId: number) => void;
}



const UserCardTwo: React.FC<UserCardProps> = ({ user, handle }) => {

	const handleAddFriendClick = () => {
		handle(user.id);
	};

	return (
		<div className="col">
			<div className="card h-100">
				<div className="card-body">
				{/* <img src="/avatarDefault.png" className="img-thumbnail" style={{ maxWidth: '100px' }}  alt="..." /> */}
					<h5 className="card-title">{user.username}</h5>
					<p className="card-text">{user.user_status}</p>
					<p className="card-text">{user.elo}</p>
					<button type="button" className="btn btn-success btn-sm" onClick={handleAddFriendClick}>Add friend</button>
				</div>
			</div>
		</div>
	);
};

export default UserCardTwo;