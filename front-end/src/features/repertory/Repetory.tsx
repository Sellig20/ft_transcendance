import { useEffect, useState } from 'react';
import userService from '../user/user.service';
import { friend } from '../Homepage/UserCard';
import UserCardTwo from './UserCardTwo';

const Repertory = () => {
	const [users, setUsers] = useState<friend[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [friends, setFriends] = useState<number>(0)
	
	useEffect(()=> {
		
		const promise2 =  userService.getUsers();

		Promise.all([promise2]).then(([res2]) => {
				setUsers(res2);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
			})

	}, [friends])

	const handleAddFriend = async (id: number) => {
		await userService.addFriend(id);
		setFriends(friends + 1);
	}

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
				<div className="row row-cols-1 row-cols-md-4 g-4" >
					{users && users.map(friend => (
						<UserCardTwo key={friend.id} user={friend} handle={handleAddFriend}/>
					))}
				</div>
			</div>
		)
}

export default Repertory