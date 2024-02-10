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
						<div key={element.id} id={element.id} onClick={clickHandler}>
							<Card name={element.name} isPerso={element.personal} id={element.id}/>
						</div>
					)
				})
			}
		</div>
	);
}