import React, { Fragment } from 'react'
import { useState, useEffect, useRef} from 'react'
import { Message } from '../componement/Message';
import { io, Socket } from "socket.io-client";
import axios from 'axios'

export function Chat() {
	
	const [socket, setSocket] = useState<Socket>()
	const count = useRef(0)
	const [messageSocket, setMessageSocket] = useState<string[]>([]);
	const [inputbarre, setInputbarre] = useState<string>("");

	const send = (
		value: string
	) => {
		socket?.emit("MP", value);
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


		// const axios = require('axios');
		// axios.get('/user?ID=12345')
		// 	.then(function (reponse) {
		// 		// en cas de réussite de la requête

		// 		console.log("a");
		// 		console.log(reponse);
		// 	})
		// 	.catch(function () {
		// 		// en cas d’échec de la requête
		// 		// console.log(error);
		// 		console.log("b");
		// 	})
		// 	.finally(function () {
		// 		// dans tous les cas
		// 		console.log("c");
		// 	});
	};

	const handleMessage = (
		event : React.MouseEvent<HTMLButtonElement>
	) => {
		
		let  message_cpy = event.target.value;

		// console.log("msg'", message,"'");
		
		
		// console.log("post_msg'", message,"'");
		
		setInputbarre(message_cpy);
		if (message_cpy === "caca")
		{
			console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
		}
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
  );
}