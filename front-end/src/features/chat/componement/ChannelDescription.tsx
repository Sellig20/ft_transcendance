import React from 'react'
import { useState, useEffect, useRef} from 'react'
import chatService from '../chat.service'
import { userInfo } from 'os'

const handleLeave = async (
	userid: number,
	channelid: number,
	reload: any
) => {
	await chatService.leaveChannelById(Number(userid), Number(channelid)).then(res => {
		// setchannelSelect(null)
		reload();
		console.log(res)
	});

};

const handleKick = async (
	userToKick: number,
	channelinfo: any,
	reload: any
) => {
	await chatService.leaveChannelById(Number(userToKick), Number(channelinfo.id)).then(res => {
		// setchannelSelect(null)
		console.log(res, "kick user", userToKick, "from channel", channelinfo.name)
		reload(channelinfo.id);
	});

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

		if(status === "owner")
		{
			return (
				<div>
					{element.username} ({status}) (you)
				</div>
			)
		}
		else
		{
			if (yourself === true)
			{
				return (
					<div>
						{element.username} ({status}) (you)
						<input type="button" value={"setAdmin"} id={element.id}/>
						<input type="button" value={"Mute (1min)"} id={element.id}/>
						<input type="button" value={"kick"} id={element.id} onClick={() => handleKick(idCard, channelinfo, reload)}/>
						<input type="button" value={"Ban"} id={element.id}/>
					</div>
				)
			}
			return (
				<div>
					{element.username} ({status})
					<input type="button" value={"setAdmin"} id={element.id}/>
					<input type="button" value={"Mute (1min)"} id={element.id}/>
					<input type="button" value={"kick"} id={element.id} onClick={() => handleKick(idCard, channelinfo, reload)}/>
					<input type="button" value={"Ban"} id={element.id}/>
					<input type="button" value={"Profil"} id={element.id}/>
					<input type="button" value={"PlayWith"} id={element.id}/>
				</div>
			)
		}
	}
	if (isAdmin === true)
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
					<input type="button" value={"Mute (1min)"} id={element.id}/>
					<input type="button" value={"kick"} id={element.id} onClick={() => handleKick(idCard, channelinfo, reload)}/>
					<input type="button" value={"Ban"} id={element.id}/>
					<input type="button" value={"Profil"} id={element.id}/>
					<input type="button" value={"PlayWith"} id={element.id}/>
				</div>
			)
		}
		else
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
					<input type="button" value={"Profil"} id={element.id}/>
					<input type="button" value={"PlayWith"} id={element.id}/>
				</div>
			)
		}
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