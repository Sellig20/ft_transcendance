import React, { Fragment } from 'react'
import { useState, useEffect, useRef} from 'react'
import { Message } from '../../componement/Message';
import { io, Socket } from "socket.io-client";
import api from '../api/api';
import chatService from './chat.service'

export function Chat() {
	
	const [socket, setSocket] = useState<Socket>()
	const count = useRef(0)
	const [messageSocket, setMessageSocket] = useState<string[]>([]);

	const [inputbarre, setInputbarre] = useState<string>("");
	const [inputAddFriend, setInputAddFriend] = useState<string>("");

	const [channelJoined, setChannelJoined] = useState<any>();
	const [IdUser, setIdUser] = useState<number>();

	// setChannelJoined(chatService.getChannelJoinedByUserId(2));

	const send = (
		value: string
	) => {
		socket?.emit("MP", {recipient:"socketid", data:value})
		console.log("value:", value);
	}

	// ici c'est de la magie noir avec le count juste parce que le strict mode reload le componemen 2 foist
	// depuis react 18 sur la fonction use effect
	// donc j'utilise le count pour pas que la requete "io(_)" soit faite sur le premier load de page.
	useEffect(() => {
		if (count.current !== 0)
		{
			const newSocket = io("http://localhost:8001")
			setSocket(newSocket)
		}
		count.current++;
	}, [setSocket])

	const messageListener = (
		messageprop: string
	) => {
		setMessageSocket([...messageSocket, messageprop])
	};

	useEffect(() => {
		socket?.on("MP", messageListener)
		return () => {
		socket?.off("MP", messageListener)
		}
	}, [messageListener])



	const buttonHandler = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		// let buttonname = event.currentTarget.name;
		event.preventDefault();
	
		// const button: HTMLButtonElement = event.currentTarget;
		// setClickedButton(button.name);
		// console.log(buttonname);
		// console.log(message);
		console.log("socket id:", socket?.id);
		if (inputbarre != "")
		{
			send(inputbarre);
			console.log(messageSocket);
			setInputbarre("");
		}

	};
	
	const handleMessage = (
		event : React.MouseEvent<HTMLButtonElement>
		) => {
		let  message_cpy = event.target.value;
		setInputbarre(message_cpy);
	};

	const HandleAddFriendButton = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		if (inputAddFriend != "")
		{
			console.log(inputAddFriend);
			// action
			setInputAddFriend("");
		}
	};


	const handleAddFriendInput = async (
		event : React.MouseEvent<HTMLButtonElement>
	) => {
		let  value_cpy = event.target.value;
		setInputAddFriend(value_cpy);

		// console.log(await chatService.getUserById(2));
	};
	
	let message_db: any[] = [
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
		<div>
			<div>
				<h1>App: CHAT</h1>
			</div>

			<div className="ps-5 pb-5 pe-5 pt-5 d-flex flex-row">
				<div id='panel' className='bg-info w-25'>
				<div className='card bg-secondary'>
						Louis
					</div>
					<div className='card bg-secondary'>
						Robin
					</div>
					<div id="addfriend" className="h-100 d-inline-block">
						<input type="text" className="form-control" name="inputAddfriend" value={inputAddFriend} onChange={handleAddFriendInput}/>
						<button type="button" className="btn btn-primary btn-lg" name='buttonAddFriend' onClick={HandleAddFriendButton}>Add Friend</button>
					</div>
				</div>
				<div id='chat' className='bg-danger w-75'>
					{message_db.map( message => {
						return(
								<div key={message.id}>
									<Message id={message.id} content={message.content} sender={message.sender} recipient={message.recipient}/>
								</div>
						)
					})}
					<div className="d-flex justify-content-end">
						<input type="text" className="form-control" name="inputSend" value={inputbarre} onChange={handleMessage}/>
						<button type="button" className="btn btn-primary btn-lg" name='buttonSend' onClick={buttonHandler}>Send</button>
						
					</div>
					<div>
					{
						messageSocket.map((messageSocket, index) => (
							<div key={index}>
								{messageSocket}
							</div>
						))
					}
					</div>
				</div>
			</div>
		</div>
  );
}