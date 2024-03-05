import { ChannelDescription } from './ChannelDescription';



const Message = ({content, sender, sender_name, userinfo} : {
	content: string, 
	sender: string,
	sender_name: string,
	userinfo: any
}) => {
	// console.log("message id:", id, " message:", content);
	if (userinfo.blocked_user.indexOf(sender) !== -1)
		return ;
	if (sender === userinfo.id)
	{
		return (
			<>
			<div>
				{/* <div class="bg-danger"> */}
					<div className="ms-5">
						<div className="d-flex flex-row-reverse">
							<div className="p-3 mb-2 bg-primary text-white  rounded-5">
								from : {sender_name}
								<br />
								{content}
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
								from : {sender_name}
								<br />
								{content}
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

export const PrintChannel = ({ channelinfo, newMessages, reload, userinfo, locked} : {
	channelinfo: any,
	newMessages: any,
	reload: () => void,
	userinfo: any,
	locked: boolean
}) => {
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
	if (channelinfo.password !== "" && channelinfo.password !== null && locked === true)
	{
		return(
			<div>
				please enter password...
			</div>
		);
	}
	console.log("[DEBUG] channel_messages loaded !", channelinfo);
	const channel = channelinfo
	if (newMessages.length !== 0)
		channel.messages.push(newMessages)
	// console.log("channel", channel.messages)
	console.log("channel message", newMessages)
	// if (channel.messages.length === 0)
	// {
	// 	return(
	// 		<div>
	// 			send message to start conversation !
	// 		</div>
	// 	);
	// }
	return (
		<div>
			<div>
				<ChannelDescription channelinfo={channel} userinfo={userinfo} reload={reload}/>
			</div>
			{
				channel.messages.map((element: any, index:any) => {
					return (
						<div key={index}>
							<Message content={element.content} sender={element.userId} sender_name={element.sender_name} userinfo={userinfo}/>
						</div>
					)
				})
			}
		</div>
	);
}