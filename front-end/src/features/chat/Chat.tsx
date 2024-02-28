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
import { toast } from 'react-toastify';

export function Chat() {
	
	const [socket, setSocket] = useState<Socket | null>(null)
	const count = useRef(0)
	const [messageSocket, setMessageSocket] = useState<any>([]);

	const inputMessageRef = useRef(null);
	const inputFriendRef = useRef(null);

	const [channelLocked, setChannelLocked] = useState<boolean>(false); // channel locked
	const [channelJoined, setChannelJoined] = useState<any>(); // channel disponible
	const [channelSelect, setchannelSelect] = useState<any>(); // channel en cours d'affichage
	const [userinfo, setUserinfo] = useState<any>(null); // info du user connected
	
	const userid = useSelector((state: Rootstate) => state.user.id);
	
	const reload = (
		send_to_channel?: number
	) => {
		if (send_to_channel === undefined)
			callApi(userid, 0, false)
		else
		{
			socket?.emit("RELOAD", {userinfo:userinfo, channelid:send_to_channel})
			// callApi(userid, 0, false)
		}
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
			if (channelSelect !== undefined && channelSelect !== null) // si plus acces au channelselected alors reset la variable
			{
				let finded = false
				userinfo.channel_list.map((element: any) => {
					if (element.id === channelSelect.id)
						finded = true
				})
				if (finded === false)
					setchannelSelect(null)
			}
			// if (firstcall === true)
			// 	newSocket?.emit("FIRST", {userid:userinfo.id, userinfo:userinfo})
		});
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
			const newSocket = io(`http://${process.env.HOST_IP}:8001`)
			first(newSocket)
		}
		count.current++;
	}, [first])
	
	const send = (
		value: string
	) => {
		socket?.emit("MP", {from_socket: socket?.id, from_user: userinfo.id, from_user_name: userinfo.username, data:value, to:channelSelect.id})
		console.log("value:", value);
	}

	const reloadListener = async (
		messageprop: any
	) => {
		// console.log("channelselected===", channelSelect, messageprop.channelid)
		if (channelSelect === undefined)
			return ;
		if (messageprop.channelid === channelSelect.id)
		{
			await chatService.findAllInfoInChannelById(Number(messageprop.channelid)).then(messageChann => {
				if (messageChann === "") //	le channel existe pas
				{
					reload();
					return ;
				}
				setchannelSelect(messageChann)
			});
			// setchannelSelect(messageprop.channelid)
			// reload()
		}
	};

	const messageListener = (
		messageprop: any
	) => {
		if (channelSelect === undefined)
			return ;
		if (channelSelect.id === messageprop.from_channel)
		{
			console.log("msg recu:", messageprop)
			reload(messageprop.from_channel)
			// setMessageSocket(messageprop)
			// setMessageSocket({content: messageprop.data, userId: messageprop.from_user, sender_name: messageprop.from_user_name})
		}
	};

	const firstListener = (
		messageprop: any
	) => {
		console.log("envoie des donnee users au server socket...", userid)
		socket?.emit("FIRST", {userid:userid})
	};

	useEffect(() => {
		socket?.on("FIRST", firstListener)
		return () => {
			socket?.off("FIRST", firstListener)
		}
	}, [firstListener])

	useEffect(() => {
		socket?.on("MP", messageListener)
		return () => {
			socket?.off("MP", messageListener)
		}
	}, [messageListener])

	useEffect(() => {
		socket?.on("RELOAD", reloadListener)
		return () => {
			socket?.off("RELOAD", reloadListener)
		}
	}, [reloadListener])



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
	};

	const handleChannel = async (
		// event: React.MouseEvent<HTMLButtonElement>
		channelinfo: any,
	) => {
		let found;
		found = false;
		setMessageSocket([])
		console.log("clicked on a channel, id_channel =", channelinfo.id);
		const messageChann = await chatService.findAllInfoInChannelById(Number(channelinfo.id))
		if (messageChann === null) //	le channel existe pas
		{
			reload();
			return ;
		}
		console.log(messageChann)
		messageChann.user_list.map((element: any, index:any) => {
			if (element.id === userid)
			{
				found = true
				return ;
			}
		})
		if (found === false) // userid n'est plus dans le channel
		{
			reload();
			toast.error("error acces denied")
			return ;
		}


		if (messageChann.password === null || messageChann.password === "")
			setChannelLocked(false)
		else
			setChannelLocked(true)
		setchannelSelect(messageChann)
	};
	
	return (
		<div>
			<div className="ps-5 pb-5 pe-5 pt-5 d-flex flex-row">
				{/* <div id='panel' className='bg-info w-25'> */}
				<div id='panel' className='w-25'>
					<ChannelCards channelInfo={channelJoined} clickHandler={handleChannel}/>
					<CreateChannel reload={reload} iduser={userid} userinfo={userinfo} setuserinfo={setUserinfo} setChannelSelected={setchannelSelect}/>
				</div>
				{/* <div id='chat' className='bg-danger w-75'> */}
				<div id='chat' className='bg-secondary w-75'>
					<div key={1}>
						<PrintChannel channelinfo={channelSelect} newMessages={messageSocket} reload={reload} userinfo={userinfo} locked={channelLocked}/>
						<InputMessage channelinfo={channelSelect} newMessages={messageSocket} buttonHandler={buttonHandler} inputMessageRef={inputMessageRef} locked={channelLocked} setLocked={setChannelLocked}/>
					</div>
				</div>
			</div>
		</div>
  );
}