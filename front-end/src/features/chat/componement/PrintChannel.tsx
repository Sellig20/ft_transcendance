import React from 'react'
import { useState, useEffect, useRef} from 'react'
import { ChannelDescription } from './ChannelDescription';

import chatService from '../chat.service'


const Message = ({ id, content, sender, sender_name} : {
	id: string,
	content: string, 
	sender: string,
	sender_name: string
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
								de : {sender_name}
								<br />
								'{content}'
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
								de : {sender_name}
								<br />
								'{content}'
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

export const PrintChannel = ({ channelinfo, newMessages, reload, userinfo} : {
	channelinfo: any,
	newMessages: any,
	reload: () => void,
	userinfo: any
}) => {
	console.log("print chann")
	if (channelinfo === "")
	{
		reload()
		return ;
	}
	if (channelinfo === undefined || channelinfo === null)
	{
		return(
			<div>
				no channel selected...
			</div>
		);
	}
	console.log("[DEBUG] channel_messages loaded !", channelinfo);
	const channel = channelinfo
	if (newMessages.length !== 0)
		channel.messages.push(newMessages)
	console.log("channel", channel.messages)
	console.log("tttttt", newMessages)
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
			<div>
				<ChannelDescription channelinfo={channel} userinfo={userinfo} reload={reload}/>
			</div>
			{
				channel.messages.map((element: any, index:any) => {
					return (
						<div key={index}>
							<Message id={element.id} content={element.content} sender={element.userId} sender_name={element.sender_name}/>
						</div>
					)
				})
			}
		</div>
	);
}