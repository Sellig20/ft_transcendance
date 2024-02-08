// import React, { Fragment } from 'react'

import chatService from '../chat.service'


const Message = ({ id, content, sender } : {
	id: number,
	content: string, 
	sender: string
}) => {
	// console.log("message id:", id, " message:", content);
	if (sender == "robin")
	{
		return (
			<>
			<div>
				{/* <div class="bg-danger"> */}
					<div className="ms-5">
						<div className="d-flex flex-row-reverse">
							<div className="p-3 mb-2 bg-primary text-white  rounded-5">
								de : {sender}
								<br />
								'{content}'
								<br />
								'id : {id}'
								(droite)
							</div>
						</div>
					</div>
				{/* </div> */}
				<div>
					<br />
				</div>
			</div>
			</>
		);
	}
	else
	{
		return (
			<>
			<div>
				{/* <div class="bg-danger"> */}
						<div className="d-flex flex-row mb-3">
							<div className="p-3 mb-2 bg-primary text-white  rounded-5">
								de : {sender}
								<br />
								'{content}'
								<br />
								'id : {id}'
								(gauche)
							</div>
						</div>
				{/* </div> */}
				<div>
					<br />
				</div>
			</div>
			</>
		);
	}
}

// const get_channinfo = async (
// 	id: number
// ) => {
// 	let r;
// 	await chatService.findAllChannelJoinedByIdUser(2).then(channelj => r=channelj);
// 	return (r);
// };

export const PrintChannel = ({ channelinfo } : {
	channelinfo: any
}) => {
	if (channelinfo === null || channelinfo === undefined)
	{
		console.log("no channel selected");
		return(
			<div>
				no channel selected...
			</div>
		);
	}
	console.log("channel_info = ", channelinfo);
	// if (channinfo.messages.length === 0)
	// {
	// 	return(
	// 		<div>
	// 			send message to start conversation !
	// 		</div>
	// 	);
	// }
	return (
		<div>
			info_channel recu
			{/* {
				channel_list.map((element: any) => {
					// console.log("caca");
					return (
						<div key={element.id}>
							<Card name={element.name} isPerso={element.personal} id={element.id}/>
						</div>
					)
				})
			} */}
		</div>
	);
}