import React from 'react'
import { useState, useEffect, useRef} from 'react'
import { ChannelCards } from './componement/ChannelCards';
import { PrintChannel } from './componement/PrintChannel';
import { CreateChannel } from './componement/CreateChannel';
import { InputMessage } from './componement/InputMessage';
import { io, Socket } from "socket.io-client";
import chatService from './chat.service'

import { useSelector } from 'react-redux';
import { Rootstate } from '../../app/store';

export function Chat() {
	
	const [socket, setSocket] = useState<Socket | null>(null)
	const count = useRef(0)
	const [messageSocket, setMessageSocket] = useState<any>([]);

	const inputMessageRef = useRef(null);
	const inputFriendRef = useRef(null);


	const [channelJoined, setChannelJoined] = useState<any>(); // channel disponible
	const [channelSelect, setchannelSelect] = useState<any>(); // channel en cours d'affichage
	const [userinfo, setUserinfo] = useState<any>(null); // info du user connected
	const userid = useSelector((state: Rootstate) => state.user.id);
	
	const reload = (
	) => {
		callApi(userid, 0, false)
	}

	const callApi = async (
		userid: any,
		newSocket: any,
		firstcall: boolean
		) => {
		await chatService.getUserById(userid).then(userinfo => {
			setUserinfo(userinfo)
			console.log("[FROM DB] userinfo:", userinfo)
			setChannelJoined(userinfo.channel_list)
			if (firstcall === true)
				newSocket?.emit("FIRST", {userid:userinfo.id, userinfo:userinfo})
		});
		// choper les infos du user connecte
		// await chatService.findAllInfoInChannelById(1).then(messageChann => setMessageInChannel(messageChann));
	}
	
	const first = (
		newSocket: Socket
	) => {
		callApi(userid, newSocket, true);
		setSocket(newSocket)
	}

	// ici c'est de la magie noir avec le count juste parce que le strict mode reload le componemen 2 foist
	// depuis react 18 sur la fonction use effect
	// donc j'utilise le count pour pas que la requete "io(_)" soit faite sur le premier load de page.
	useEffect(() => {
		if (count.current === 0)
		{
			const newSocket = io("http://localhost:8001")
			first(newSocket)
		}
		count.current++;
	}, [first])
	
	const send = (
		value: string
	) => {
		// to generate database
		if (value === "a")
			socket?.emit("MP", {from_socket: socket?.id, from_user: userinfo.id, data:value,})
		socket?.emit("MP", {from_socket: socket?.id, from_user: userinfo.id, data:value, to:channelSelect.id})
		console.log("value:", value);
	}


	const messageListener = (
		messageprop: any
	) => {
		if (channelSelect === undefined)
			return ;
		if (channelSelect.id === messageprop.from_channel)
		{
			console.log("msg recu:", messageprop)
			setMessageSocket(messageprop)
			setMessageSocket({content: messageprop.data, userId: messageprop.from_user})
		}
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
		event.preventDefault();
		if (inputMessageRef.current.value === null)
			return ;

		const input = inputMessageRef.current.value
		console.log("socket id:", socket?.id);
		if (input != "")
		{
			send(input);
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
		setMessageSocket([])
		const id_chann = event.currentTarget.id
		console.log("clicked on a channel, id_channel =", id_chann);
		// setchannelSelectInfo() faire requete
		await chatService.findAllInfoInChannelById(Number(id_chann)).then(messageChann => {
			if (messageChann === "") //	le channel existe pas
			{
				reload();
				return ;
			}
			setchannelSelect(messageChann)
		});

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
					<CreateChannel reload={reload} iduser={userid} userinfo={userinfo} setuserinfo={setUserinfo}/>
				</div>
				<div id='chat' className='bg-danger w-75'>
					<div key={1}>
						<PrintChannel channelinfo={channelSelect} newMessages={messageSocket} reload={reload}/>
						<InputMessage channelinfo={channelSelect} newMessages={messageSocket} buttonHandler={buttonHandler} inputMessageRef={inputMessageRef}/>
					</div>
					{/* <div className="d-flex justify-content-end">
						<input type="text" className="form-control" name="inputSend" id="inputSend" ref={inputMessageRef}/>
						<button type="button" className="btn btn-primary btn-lg" name='buttonSend' onClick={buttonHandler}>Send</button>
						
					</div> */}
					<div>
					{/* {
						messageSocket.map((messageSocket, index) => (
							<div key={index}>
								{messageSocket}
							</div>
						))
					} */}
					</div>
				</div>
			</div>
		</div>
  );
}