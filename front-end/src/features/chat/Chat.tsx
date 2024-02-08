import React from 'react'
import { useState, useEffect, useRef} from 'react'
import { ChannelCards } from './componement/ChannelCards';
import { PrintChannel } from './componement/PrintChannel';
import { io, Socket } from "socket.io-client";
import chatService from './chat.service'

import { useSelector } from 'react-redux';
import { Rootstate } from '../../app/store';

export function Chat() {
	
	const [socket, setSocket] = useState<Socket>()
	const count = useRef(0)
	const [messageSocket, setMessageSocket] = useState<string[]>([]);

	const inputMessageRef = useRef(null);
	const inputFriendRef = useRef(null);


	const [channelJoined, setChannelJoined] = useState<any>(); // channel disponible
	const [channelSelect, setchannelSelect] = useState<any>(); // channel en cours d'affichage
	const [userinfo, setUserinfo] = useState<any>(null); // info du user connected
	const userid = useSelector((state: Rootstate) => state.user.id);
	
	const callApi = async (
		userid: any
		) => {
		await chatService.getUserById(userid).then(userinfo => setUserinfo(userinfo));
		await chatService.findAllChannelJoinedByIdUser(userid).then(channelj => setChannelJoined(channelj));
		// choper les infos du user connecte
		// await chatService.findAllInfoInChannelById(1).then(messageChann => setMessageInChannel(messageChann));
	}
	
	// ici c'est de la magie noir avec le count juste parce que le strict mode reload le componemen 2 foist
	// depuis react 18 sur la fonction use effect
	// donc j'utilise le count pour pas que la requete "io(_)" soit faite sur le premier load de page.
	useEffect(() => {
		if (count.current === 0)
		{
			callApi(userid);
			console.log("userinfo", userinfo)
			console.log("channel joined", channelJoined)
			const newSocket = io("http://localhost:8001")
			setSocket(newSocket)
			// fetch la socket du reducer
			// sdfsdfsdfg
		}
		count.current++;
	}, [setSocket])
	
	const send = (
		value: string
	) => {
		socket?.emit("MP", {to: socket?.id, recipient: "socket du destinataire", data:value})
		console.log("value:", value);
	}


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



	const buttonHandler = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		// let buttonname = event.currentTarget.name;
		event.preventDefault();
		if (inputMessageRef.current.value === null)
			return ;

		const input = inputMessageRef.current.value
		console.log("socket id:", socket?.id);
		if (input != "")
		{
			send(input);
			// console.log(messageSocket);
			inputMessageRef.current.value = "";
		}


		// setUpdated(inputMessageRef.current.value);
		// // const button: HTMLButtonElement = event.currentTarget;
		// // setClickedButton(button.name);
		// // console.log(buttonname);
		// // console.log(message);

	};

	const handleChannel = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		const id_chann = event.currentTarget.id
		console.log("clicked on a channel, id_channel =", id_chann);
		// setchannelSelectInfo() faire requete
		await chatService.findAllInfoInChannelById(Number(id_chann)).then(messageChann => setchannelSelect(messageChann));

	};
	
	const HandleAddFriendButton = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		if (inputFriendRef.current.value === null)
			return ;

		const input = inputFriendRef.current.value
		if (input != "")
		{
			console.log("click on friend button, value=", input);
			inputFriendRef.current.value = "";
		}
	};

	return (
		<div>
			<div>
				<h1>App: CHAT</h1>
			</div>

			<div className="ps-5 pb-5 pe-5 pt-5 d-flex flex-row">
				<div id='panel' className='bg-info w-25'>
					<ChannelCards channelInfo={channelJoined} clickHandler={handleChannel}/>
					<div id="addfriend" className="h-100 d-inline-block">
						<input type="text" className="form-control" name="inputAddfriend" id="inputAddfriend" ref={inputFriendRef}/>
						<button type="button" className="btn btn-primary btn-lg" name='buttonAddFriend' onClick={HandleAddFriendButton}>Add Friend</button>
					</div>
				</div>
				<div id='chat' className='bg-danger w-75'>
					<PrintChannel channelinfo={channelSelect}/>
					{/* {message_db.map( message => {
						return(
								<div key={message.id}>
									<Message id={message.id} content={message.content} sender={message.sender} recipient={message.recipient}/>
								</div>
						)
					})} */}
					<div className="d-flex justify-content-end">
						<input type="text" className="form-control" name="inputSend" id="inputSend" ref={inputMessageRef}/>
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