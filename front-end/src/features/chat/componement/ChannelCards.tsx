import React from 'react'

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

export const ChannelCards = ({ channelInfo, clickHandler } : {
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
			{
				channel_list.map((element: any) => {
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