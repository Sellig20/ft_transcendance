// import React, { Fragment } from 'react'

const Card = ({ name, isPerso, id} : {
	name: string,
	isPerso: boolean
	id: number
}) => {
	console.log(name, isPerso);
	let color: string = "card bg-secondary";
	if (isPerso === true)
		color = "card bg-secondary-subtle"
	// `
	return (
		<div key={id}>
			<div className={color}>
				{name}
			</div>
		</div>
	);
}

export const ChannelCards = ({ channelInfo } : {
	channelInfo: any,
}) => {
	if (channelInfo === undefined)
	{
		console.log("= a null");
		return ;
	}
	if (channelInfo.length === 0)
	{
		console.log("= a 0");
		return(
			<div>
				no channel joined...
			</div>
		);
	}
	console.log("print channel card props:", channelInfo[0].channel_list);
	const nbrChannel = channelInfo[0].channel_list.length;
	const channel_list = channelInfo[0].channel_list;
	channel_list.forEach((element: any) => {
		console.log(element)
	});
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
					// console.log("caca");
					return (
						<div key={element.id}>
							<Card name={element.name} isPerso={element.personal} id={element.id}/>
						</div>
					)
				})
			}
		</div>
	);
}