import React, { Fragment } from 'react'

interface MessageProps {
	id: number
	content: string
	sender: string
	recipient : string
}

export function Message({id, content, sender}: MessageProps) {
	console.log("message id:", id, " message:", content);
	if (sender == "robin")
	{
		return (
			<>
			<div>
				{/* <div class="bg-danger"> */}
					<div class="ms-5">
						<div class="d-flex flex-row-reverse">
							<div class="p-3 mb-2 bg-primary text-white  rounded-5">
								de : {sender}
								<br />
								'{content}'
								<br />
								'id : {id}'
								(gauche)
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
						<div class="d-flex flex-row mb-3">
							<div class="p-3 mb-2 bg-primary text-white  rounded-5">
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


export function Chat() {
	let message_db: MessageProps[] = [
		{
			id: 1,
			content: 'message1',
			sender: 'robin',
			recipient : 'louis'
		},
		{
			id: 2,
			content: 'message2',
			sender: 'louis',
			recipient : 'robin'
		},
		{
			id: 3,
			content: 'message3',
			sender: 'robin',
			recipient : 'louis'
		},
		{
			id: 3,
			content: 'message3',
			sender: 'robin',
			recipient : 'louis'
		},
		{
			id: 3,
			content: 'message3',
			sender: 'robin',
			recipient : 'louis'
		},
		{
			id: 3,
			content: 'message3',
			sender: 'robin',
			recipient : 'louis'
		},
		{
			id: 3,
			content: 'message3',
			sender: 'louis',
			recipient : 'louis'
		}
	];

	return (
		<div className="ps-5 pb-5 pe-5 pt-5">
			{message_db.map( message => {
				return(
						<>
							<span>
								<Message key={message.id} id={message.id} content={message.content} sender={message.sender} recipient={message.recipient}/>
							</span>
						</>
				)
			})}
			<div class="d-flex justify-content-end">
				<input type="text" class="form-control" id="messageToSend"/>
				<button type="button" class="btn btn-primary btn-lg">Send</button>
			</div>
		</div>
  );
}