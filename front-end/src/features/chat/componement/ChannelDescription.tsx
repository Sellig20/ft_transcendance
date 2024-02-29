import React from 'react'
import { useState, useEffect, useRef} from 'react'
import chatService from '../chat.service'
import { userInfo } from 'os'
import { toast } from 'react-toastify';
import { sha256 } from 'js-sha256';

const handleLeave = async (
	userid: number,
	channelid: number,
	reload: any
) => {
	const res = await chatService.leaveChannelById(Number(userid), Number(channelid))
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
	channelinfo: any
) => {
	const res = await chatService.blockUserById(Number(iduserinfo), Number(userToBan))
	if (res === null)
	{
		return ;
	}
	reload();

};

const handleSetadmin = async (
	iduserinfo: number,
	userToSet: number,
	reload: any,
	channelinfo: any
) => {
	const res = await chatService.setAdminById(Number(channelinfo.id), Number(userToSet))
	if (res === null)
	{
		return;
	}
	reload(channelinfo.id);

};

const handleMute = async (
	iduserinfo: number,
	userToMute: number,
	reload: any,
	channelinfo: any
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
					<input type="button" value={"setAdmin"} id={element.id} onClick={() => handleSetadmin(userinfo.id, idCard, reload, channelinfo)}/>
					<input type="button" value={"Mute (1min)"} id={element.id} onClick={() => handleMute(userinfo.id, idCard, reload, channelinfo)}/>
					<input type="button" value={"kick"} id={element.id} onClick={() => handleKick(idCard, channelinfo, reload)}/>
					<input type="button" value={"Ban"} id={element.id} onClick={() => handleBan(idCard, channelinfo, reload)}/>
					<input type="button" value={"Block"} id={element.id} onClick={() => handleBlock(userinfo.id, idCard, reload, channelinfo)}/>
					<input type="button" value={"Profil"} id={element.id}/>
					<input type="button" value={"PlayWith"} id={element.id}/>
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
					<input type="button" value={"Mute (1min)"} id={element.id} onClick={() => handleMute(userinfo.id, idCard, reload, channelinfo)}/>
					<input type="button" value={"kick"} id={element.id} onClick={() => handleKick(idCard, channelinfo, reload)}/>
					<input type="button" value={"Ban"} id={element.id} onClick={() => handleBan(idCard, channelinfo, reload)}/>
					<input type="button" value={"Block"} id={element.id} onClick={() => handleBlock(userinfo.id, idCard, reload, channelinfo)}/>
					<input type="button" value={"Profil"} id={element.id}/>
					<input type="button" value={"PlayWith"} id={element.id}/>
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
					<input type="button" value={"Block"} id={element.id} onClick={() => handleBlock(userinfo.id, idCard, reload, channelinfo)}/>
					<input type="button" value={"Profil"} id={element.id}/>
					<input type="button" value={"PlayWith"} id={element.id}/>
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
					<input type="button" value={"Block"} id={element.id} onClick={() => handleBlock(userinfo.id, idCard, reload, channelinfo)}/>
					<input type="button" value={"Profil"} id={element.id}/>
					<input type="button" value={"PlayWith"} id={element.id}/>
				</div>
			)
		}
	}

}

const InviteUser = ({ channelinfo, userinfo, reload } : {
	channelinfo: any,
	userinfo: any,
	reload: any
}) => {

	const buttonHandler = async (
		channelinfo: any,
		userinfo: any,
		reload: any,
	) => {
		if (inputMessageRef.current.value === "")
			return ;
		const res = await chatService.inviteUser(channelinfo.id, inputMessageRef.current.value)
		if (res !== null)
			reload(channelinfo.id)
		inputMessageRef.current.value = "";
	};

	const inputMessageRef = useRef("");

	return (
		<div>
			<input type="text" name="inputSend" placeholder="username to invite" id="inputSend" ref={inputMessageRef}/>
			<button type="button" name='buttonSend' onClick={() => buttonHandler(channelinfo, userinfo, reload)}>add to channel</button>
		</div>
	)
}

const ChangePassword = ({ channelinfo, userinfo, reload } : {
	channelinfo: any,
	userinfo: any,
	reload: any
}) => {

	const buttonHandler = async (
		channelinfo: any,
		userinfo: any,
		reload: any,
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

	const inputPasswordRef = useRef("");
	if (userinfo.id === channelinfo.owner)
	{
		return (
			<div>
				<input type="password" name="inputSend" placeholder="new password" id="inputSend" ref={inputPasswordRef}/>
				<button type="button" name='buttonSend' onClick={() => buttonHandler(channelinfo, userinfo, reload)}>change password</button>
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
	console.log("channelinfoooo", channelinfo)
	return (
		<div>
			WELCOME TO : {channelinfo.name}
			<br />
			<input type="button" value={"LEAVE CHANNEL"} id={userinfo.id} onClick={() => handleLeave(userinfo.id, channelinfo.id, reload)}/>
			<ChangePassword channelinfo={channelinfo} userinfo={userinfo} reload={reload}/>
			<InviteUser channelinfo={channelinfo} userinfo={userinfo} reload={reload}/>
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