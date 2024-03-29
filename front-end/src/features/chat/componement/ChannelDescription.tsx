import { useRef} from 'react'
import chatService from '../chat.service'
import { toast } from 'react-toastify';
import { sha256 } from 'js-sha256';
import { useNavigate } from 'react-router-dom';

const handleLeave = async (
	userid: number,
	channelid: number,
	reload: any
) => {
	await chatService.leaveChannelById(Number(userid), Number(channelid))
	// console.log(res)
	reload();

};

const handleKick = async (
	userToKick: number,
	channelinfo: any,
	reload: any
) => {
	const res = await chatService.leaveChannelById(Number(userToKick), Number(channelinfo.id))
	if (res === null)
		return ;
	// setchannelSelect(null)
	reload(channelinfo.id);
};

const handleBan = async (
	userToBan: number,
	channelinfo: any,
	reload: any
) => {
	const res = await chatService.banChannelById(Number(userToBan), Number(channelinfo.id))
	if (res === null)
	{
		return ;
	}
	reload(channelinfo.id);

};

const handleBlock = async (
	iduserinfo: number,
	userToBan: number,
	reload: any,
) => {
	const res = await chatService.blockUserById(Number(iduserinfo), Number(userToBan))
	if (res === null)
	{
		return ;
	}
	reload();

};

const handleSetadmin = async (
	channelid: any,
	userToSet: number,
	reload: any,
) => {
	const res = await chatService.setAdminById(Number(channelid.id), Number(userToSet))
	if (res === null)
	{
		return;
	}
	reload(channelid.id);

};

const handleMute = async (
	channelinfo: any,
	userToMute: number,
	reload: any,
) => {
	const res = await chatService.muteById(Number(channelinfo.id), Number(userToMute))
	if (res === null)
	{
		return ;
	}
	reload(channelinfo.id);

};



const UserCard = ({ channelinfo, element, isOwner, isAdmin, userinfo, reload } : {
	channelinfo: any,
	element: any,
	isOwner: boolean,
	isAdmin: boolean,
	userinfo: any,
	reload: any
}) => {
	const navigate = useNavigate();
	const handleProfil = async (
		userToProfil: number,
	) => {
		navigate(`/user/${userToProfil}`)
	};
	const handleGame = async (
		idCard: number,
	) => {
		navigate(`/game/queuePrivate/${idCard}`)
	};

	let status = "membre"
	let idCard = element.id
	let	yourself = false

	if (idCard === userinfo.id)
		yourself = true
	if (channelinfo.admins.length !== 0 && channelinfo.admins.indexOf(idCard) !== -1)
		status = "admin"
	if (idCard === channelinfo.owner)
		status = "owner"

	if (isOwner === true)
	{
		if(yourself === true)
		{
			return (
				<div>
					{element.username} ({status}) (you)
				</div>
			)
		}
		else
		{
			return (
				<div>
					{element.username} ({status})
					<input type="button" value={"setAdmin"} onClick={() => handleSetadmin(channelinfo, idCard, reload)}/>
					<input type="button" value={"Mute (1min)"} onClick={() => handleMute(channelinfo, idCard, reload)}/>
					<input type="button" value={"kick"} onClick={() => handleKick(idCard, channelinfo, reload)}/>
					<input type="button" value={"Ban"} onClick={() => handleBan(idCard, channelinfo, reload)}/>
					<input type="button" value={"Block"} onClick={() => handleBlock(userinfo.id, idCard, reload)}/>
					<input type="button" value={"Profil"} onClick={() => handleProfil(idCard)}/>
					<input type="button" value={"PlayWith"} onClick={() => handleGame(idCard)}/>
				</div>
			)
		}
	}
	else if (isAdmin === true)
	{
		if (status !== "owner")
		{
			if (yourself === true)
			{
				return (
					<div>
						{element.username} ({status}) (you)
					</div>
				)
			}
			return (
				<div>
					{element.username} ({status})
					<input type="button" value={"Mute (1min)"} onClick={() => handleMute(channelinfo, idCard, reload)}/>
					<input type="button" value={"kick"} onClick={() => handleKick(idCard, channelinfo, reload)}/>
					<input type="button" value={"Ban"} onClick={() => handleBan(idCard, channelinfo, reload)}/>
					<input type="button" value={"Block"} onClick={() => handleBlock(userinfo.id, idCard, reload)}/>
					<input type="button" value={"Profil"} onClick={() => handleProfil(idCard)}/>
					<input type="button" value={"PlayWith"} onClick={() => handleGame(idCard)}/>
				</div>
			)
		}
		else if (status === "owner")
		{
			if (yourself === true)
			{
				<div>
					{element.username} ({status}) (you)
				</div>
			}
			return (
				<div>
					{element.username} ({status})
					<input type="button" value={"Block"} onClick={() => handleBlock(userinfo.id, idCard, reload)}/>
					<input type="button" value={"Profil"}  onClick={() => handleProfil(idCard)}/>
					<input type="button" value={"PlayWith"} onClick={() => handleGame( idCard)}/>
				</div>
			)
		}
	}
	else
	{
		if (yourself === true)
		{
			return (
				<div>
					{element.username} ({status}) (you)
				</div>
			)
		}
		else
		{
			return (
				<div>
					{element.username} ({status})
					<input type="button" value={"Block"} onClick={() => handleBlock(userinfo.id, idCard, reload)}/>
					<input type="button" value={"Profil"} onClick={() => handleProfil(idCard)}/>
					<input type="button" value={"PlayWith"} onClick={() => handleGame(idCard)}/>
				</div>
			)
		}
	}

}

const InviteUser = ({ channelinfo, reload } : {
	channelinfo: any,
	reload: any
}) => {

	const buttonHandler = async (
		channelinfo: any,
		reload: any,
	) => {
		if (inputMessageRef.current.value === "")
			return ;
		const res = await chatService.inviteUser(channelinfo.id, inputMessageRef.current.value)
		if (res !== null)
			reload(channelinfo.id)
		inputMessageRef.current.value = "";
	};

	const inputMessageRef = useRef<any>("");

	return (
		<div>
			<input type="text" name="inputSend" placeholder="username to invite" ref={inputMessageRef}/>
			<button type="button" name='buttonSend' onClick={() => buttonHandler(channelinfo, reload)}>add to channel</button>
		</div>
	)
}

const ChangePassword = ({ channelinfo, userinfo, reload} : {
	channelinfo: any,
	userinfo: any,
	reload: any
}) => {

	const buttonHandler = async (
	) => {
		// console.log(inputPasswordRef.current.value)
		let hashed = ""
		if (inputPasswordRef.current.value === "")
			toast.error("password deleted")
		else
			hashed = sha256(inputPasswordRef.current.value)
		const res = await chatService.changePassword(channelinfo.id, hashed)
		if (res === null)
			return ;
		toast.success("password updated")
		reload(channelinfo.id)
		inputPasswordRef.current.value = "";
	};

	const inputPasswordRef = useRef<any>("");
	if (userinfo.id === channelinfo.owner)
	{
		return (
			<div>
				<input type="password" name="inputSend" placeholder="new password" ref={inputPasswordRef}/>
				<button type="button" name='buttonSend' onClick={() => buttonHandler()}>change password</button>
			</div>
		)
	}
}

export const ChannelDescription = ({ channelinfo, userinfo, reload} : {
	channelinfo: any,
	userinfo:	any,
	reload: any
}) => {
	let isOwner = false
	let isAdmin = false
	
	if(channelinfo.owner === userinfo.id)
		isOwner = true
	if(isOwner === false && channelinfo.admins.length !== 0 && channelinfo.admins.indexOf(userinfo.id) !== -1)
		isAdmin = true
	// console.log("channelinfoooo", channelinfo)
	if (channelinfo.personal === true)
	{
		return (
			<div>
				WELCOME TO : {channelinfo.name}
				<br />
				{
					channelinfo.user_list.map((element: any, index:any) => {
						return (
							<div key={element.id}>
								<UserCard channelinfo={channelinfo} element={element} isOwner={isOwner} isAdmin={isAdmin} userinfo={userinfo} reload={reload}/>
							</div>
						)
					})
				}
			</div>
		)
	}
	else
	{
		return (
			<div>
				WELCOME TO : {channelinfo.name}
				<br />
				<input type="button" value={"LEAVE CHANNEL"} id={userinfo.id} onClick={() => handleLeave(userinfo.id, channelinfo.id, reload)}/>
				<ChangePassword channelinfo={channelinfo} userinfo={userinfo} reload={reload}/>
				<InviteUser channelinfo={channelinfo} reload={reload}/>
				{
					channelinfo.user_list.map((element: any, index:any) => {
						return (
							<div key={index}>
								<UserCard channelinfo={channelinfo} element={element} isOwner={isOwner} isAdmin={isAdmin} userinfo={userinfo} reload={reload}/>
							</div>
						)
					})
				}
			</div>
		)
	}
}