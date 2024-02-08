// import React, { Fragment } from 'react'

import chatService from '../chat.service'


const Message = ({ id, content, sender } : {
	id: string,
	content: string, 
	sender: string
}) => {
	// console.log("message id:", id, " message:", content);
	if (sender == "1")
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

export const PrintChannel = ({ channelinfo } : {
	channelinfo: any
}) => {
	if (channelinfo === null || channelinfo === undefined)
	{
		return(
			<div>
				no channel selected...
			</div>
		);
	}
	console.log("channel_messages OK = ", channelinfo);
	const channel = channelinfo[0]
	console.log(channel.messages);
	if (channel.messages.length === 0)
	{
		return(
			<div>
				send message to start conversation !
			</div>
		);
	}
	return (
		<div>
			{channel.name}
			:
			{
				channel.user_list.map((element: any) => {
					// console.log("caca");
					return (
						<div key={element.id}>
							{element.username}
						</div>
					)
				})
			}
			{
				channel.messages.map((element: any) => {
					// console.log("caca");
					return (
						<div key={element.id}>
							<Message id={element.id} content={element.content} sender={element.userId}/>
						</div>
					)
				})
			}
		</div>
	);
}