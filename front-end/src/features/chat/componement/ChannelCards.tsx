import { useEffect, useState } from 'react'
import chatService from '../chat.service';

const Card = ({ name, isPerso, id, password, ispublic, channelInfo, userid} : {
	name: string,
	isPerso: boolean
	id: number,
	password: string,
	ispublic: boolean,
	channelInfo: any,
	userid : number
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
		// console.log(id)
		channelInfo.map((element: any) => {
			// console.log("perso",element)
			if(id === element.id)
			{
				// console.log(element.user_list)
				if (element.user_list[0].id !== userid)
				{
					name = element.user_list[0].username
					return ;
				}
				name = element.user_list[1].username
				return ;
			}
		})
		return (
			<div key={id}>
				<div className={color}>
					{name} {mode}
				</div>
			</div>
		)
	}
	return (
		<div key={id}>
			<div className={color}>
				{name} {mode}
			</div>
		</div>
	);
}

export const ChannelPublic = ({userid, clickHandler, channelInfo} : {
	userid: number,
	clickHandler: any,
	channelInfo: any
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
	public_channels.map((element: any) => {
		var val = element.id
		// console.log(element.name)
		
		const found = joined_channels.channel_list.find((x: { id: string; }) => x.id === val);

		channelNotJoined.push(element)
		// if (found === undefined)
		// {
		// }
	})
	
	// console.log("tesssssssssssss", public_channels, joined_channels.channel_list, channelNotJoined)
	return (
		<div>
			public channels:
			<br />
			{
				channelNotJoined.map((element: any) => {
					return (
						<div key={element.id} id={element.id} onClick={() => clickHandler(element)}>
							<Card name={element.name} isPerso={element.personal} id={element.id} password={element.password} ispublic={element.public} channelInfo={channelInfo} userid={userid}/>
						</div>
					)
				})
			}
		</div>
	);
}

export const ChannelCards = ({ channelInfo, clickHandler, userid} : {
	channelInfo: any,
	clickHandler: any,
	userid: number
}) => {
	if (channelInfo === undefined)
	{
		// console.log("[DEBUG] channelIdInfo pending...");
		return(
			<div>
				pending...
			</div>
		);
	}
	// console.log("[DEBUG] channelIdInfo loaded !", channelInfo);
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
							<Card name={element.name} isPerso={element.personal} id={element.id} password={element.password} ispublic={element.public} channelInfo={channelInfo} userid={userid}/>
						</div>
					)
				})
			}
			{/* <ChannelPublic /> */}
		</div>
	);
}