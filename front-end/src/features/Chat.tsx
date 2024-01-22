import React, { Fragment } from 'react'
import { useState } from 'react'
import { Message } from '../componement/Message';


export function Chat() {
	// const [clickedButton, setClickedButton] = useState<string>("");
	const [message, setMessage] = useState<string>('');
	// const inputRef = useRef(null);


	const buttonHandler = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		let buttonname = event.currentTarget.name;
		event.preventDefault();
	
		// const button: HTMLButtonElement = event.currentTarget;
		// setClickedButton(button.name);
		// console.log(buttonname);
		console.log(message);
	};

	const handleMessage = (
		event : React.MouseEvent<HTMLButtonElement>
	) => {
		
		let  message_cpy = event.target.value;

		// console.log("msg'", message,"'");
		
		
		// console.log("post_msg'", message,"'");
		
		// if (message === "test")
		// 	console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
		setMessage(message_cpy);
	};
	
	let message_db: MessageProps[] = [
		{
			id: 0,
			content: 'message1',
			sender: 'robin',
			recipient : 'louis'
		},
		{
			id: 1,
			content: 'message2',
			sender: 'louis',
			recipient : 'robin'
		},
		{
			id: 2,
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
			id: 4,
			content: 'message3',
			sender: 'robin',
			recipient : 'louis'
		},
		{
			id: 5,
			content: 'message3',
			sender: 'robin',
			recipient : 'louis'
		},
		{
			id: 6,
			content: 'message3',
			sender: 'louis',
			recipient : 'louis'
		}
	];

	return (
		<div className="ps-5 pb-5 pe-5 pt-5">
			<div>
				<h1>App: CHAT</h1>
			</div>
			{message_db.map( message => {
				return(
						<>
							<span>
								<Message key={message.id} id={message.id} content={message.content} sender={message.sender} recipient={message.recipient}/>
							</span>
						</>
				)
			})}
			<div className="d-flex justify-content-end">
				<input type="text" className="form-control" name="inputSend" value={message} onChange={handleMessage}/>
				<button type="button" className="btn btn-primary btn-lg" name='buttonSend' onClick={buttonHandler}>Send</button>
				
			</div>
		</div>
  );
}