import React, { useEffect, useState } from 'react'
import chatService from '../chat.service';

const whatColor = ({password, ispublic, personal} : {
	password: string,
	ispublic: boolean,
	personal: boolean
}) => {
	let color = "card bg-primary-subtle";
	if (!password)
		color = "card bg-danger"
	if (ispublic == true)
		color = "card bg-success"
	else if (personal === true)
		color = "card bg-dark-subtle"
	return (color)
}

const Card = ({ name, isPerso, id, password, ispublic} : {
	name: string,
	isPerso: boolean
	id: number,
	password: string,
	ispublic: boolean
}) => {
	let mode = "(private)"
	// let color = "card bg-secondary";
	let color = "card bg-primary-subtle";
	if (password !== null && password !== "")
	{
		color = "card bg-danger"
		mode = "(protected)"
	}
	else if (ispublic == true)
	{
		color = "card bg-success"
		mode = "(public)"
	}
	// else if (isPerso === true)
	// 	color = "card bg-dark-subtle"
	if (isPerso === true)
	{
		color = "card bg-success-subtle"
		mode = "(mp)"
	}
	return (
		<div key={id}>
			<div className={color}>
				{name} {mode}
			</div>
		</div>
	);
}

export const ChannelPublic = ({userid, clickHandler} : {
	userid: number,
	clickHandler: any
}) => {
	const [public_channels, setpublic_channels] = useState<any>([]);
	const [joined_channels, setJoined_channels] = useState<any>([]);
	
	useEffect(() => {
		async function getToken() {
			const res2 = await chatService.findAllChannelJoinedId(userid);
			if (res2 !== null)
				setJoined_channels(res2)
			const res = await chatService.findAllPublicChannel();
			if (res !== null)
				setpublic_channels(res);
		}
		getToken();
	}, [])

	let channelNotJoined : any = []
	public_channels.map((element: any, index : any) => {
		var val = element.id
		// console.log(element.name)
		
		const found = joined_channels.channel_list.find((x: { id: string; }) => x.id === val);

		if (found === undefined)
		{
			channelNotJoined.push(element)
		}
	})
	
	// console.log("tesssssssssssss", public_channels, joined_channels.channel_list, channelNotJoined)
	return (
		<div>
			public channels not joined:
			<br />
			{
				channelNotJoined.map((element: any) => {
					return (
						<div key={element.id} id={element.id} onClick={() => clickHandler(element)}>
							<Card name={element.name} isPerso={element.personal} id={element.id} password={element.password} ispublic={element.public}/>
						</div>
					)
				})
			}
		</div>
	);
}

export const ChannelCards = ({ channelInfo, clickHandler} : {
	channelInfo: any,
	clickHandler: any
}) => {
	if (channelInfo === undefined)
	{
		console.log("[DEBUG] channelIdInfo pending...");
		return(
			<div>
				pending...
			</div>
		);
	}
	console.log("[DEBUG] channelIdInfo loaded !", channelInfo);
	const nbrChannel = channelInfo.length;
	if (nbrChannel === 0)
	{
		return(
			<div>
				no channel joined...
			</div>
		);
	}
	const channel_list = channelInfo;
	if (nbrChannel === 0)
	{
		return(
			<div>
				no channel joined...
			</div>
		);
	}

	return (
		<div>
			channels joined:
			{
				channel_list.map((element: any) => {
					return (
						<div key={element.id} id={element.id} onClick={() => clickHandler(element)}>
							<Card name={element.name} isPerso={element.personal} id={element.id} password={element.password} ispublic={element.public}/>
						</div>
					)
				})
			}
			{/* <ChannelPublic /> */}
		</div>
	);
}