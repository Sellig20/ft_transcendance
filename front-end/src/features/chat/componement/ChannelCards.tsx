import React from 'react'

const Card = ({ name, isPerso, id} : {
	name: string,
	isPerso: boolean
	id: number
}) => {
	let perso = "public"
	let color: string = "card bg-secondary";
	if (isPerso === true)
	{
		color = "card bg-success-subtle"
		perso = "perso"
	}
	return (
		<div key={id}>
			<div className={color}>
				{name} {perso}
			</div>
		</div>
	);
}

export const ChannelCards = ({ channelInfo, clickHandler } : {
	channelInfo: any,
	clickHandler: (e:  React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	if (channelInfo === undefined)
	{
		console.log("nbr de channel joined = a null");
		return(
			<div>
				no channel joined...
			</div>
		);
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
	console.log("channel_id_info OK", channelInfo);
	const nbrChannel = channelInfo[0].channel_list.length;
	const channel_list = channelInfo[0].channel_list;
	// channel_list.forEach((element: any) => {
	// 	console.log(element)
	// });
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
						<div key={element.id} id={element.id} onClick={clickHandler}>
							<Card name={element.name} isPerso={element.personal} id={element.id}/>
						</div>
					)
				})
			}
		</div>
	);
}