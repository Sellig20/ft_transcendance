import { useState, useEffect, useRef} from 'react'
import React from 'react'
import chatService from '../chat.service'

const Password = ({ passwordRef, isPassword} : {
	passwordRef: React.MutableRefObject<null>
	isPassword: boolean,
}) => {
	if (isPassword === true)
	{
		return (
			<input type="password" className="form-control" name="password" id="password" placeholder="password" ref={passwordRef}/>
		)
	}
	else
	{
		return ;
	}
}

export const CreateChannel = ({iduser, userinfo, setuserinfo, reload, setChannelSelected} : {
	iduser: any,
	userinfo: any,
	setuserinfo: any,
	reload: any,
	setChannelSelected: any
}) => {
	const inputNameRef = useRef(null);
	const inputPasswordRef = useRef(null);
	const [checkboxPrivate, setCheckboxPrivate] = useState(false);
	const [checkboxPublic, setcheckboxPublic] = useState(true);
	const [checkboxPassword, setcheckboxPassword] = useState(false);
	const [mode, setMode] = useState("");

	const hprivate = (
	) => {
		setCheckboxPrivate(true)
		setcheckboxPublic(false)
		setcheckboxPassword(false)
		setMode("private")

	};

	const hpublic = (
	) => {
		setCheckboxPrivate(false)
		setcheckboxPublic(true)
		setcheckboxPassword(false)
		setMode("public")

	};

	const hpassword = (
	) => {
		setCheckboxPrivate(false)
		setcheckboxPublic(false)
		setcheckboxPassword(true)
		setMode("password")
	};

	const handlerSubmite = async (
	) => {
		const CryptoJS = require('crypto-js');
		let channel_name = inputNameRef.current.value;
		let channel_password = null
		let	isPublic = true

		if (channel_name === "")
			return ;

		if (mode == "password")
		{
			channel_password = inputPasswordRef.current.value;
			isPublic = true
			if (channel_password === "")
				return ;
		}
		else if (mode == "public")
		{
			console.log("mode public")
			isPublic = true
		}
		else if (mode == "private")
		{
			console.log("mode private")
			isPublic = false
		}
		channel_password = CryptoJS.SHA256(channel_password);
		console.log("clique: ", mode, channel_name, channel_password)
		await chatService.createChannel(channel_name, false, isPublic, iduser, channel_password).then(res => {
			console.log("res", res)
			console.log("userinfo", userinfo)
			setuserinfo(userinfo.channel_list.push(res))
			setChannelSelected(null)
			reload()
			// setChannelJoined(userinfo.channel_list)
		})
		inputNameRef.current.value = ""
		// creer le channel avec une requete + reload la page si possible d'un maniere ou d'un autre
		// (peut etre en passant la ref des channels info id puis en l'incrementant avec le nouveau channel ?)
	};

	return (
		<div id="create_channel" className="h-100 d-inline-block">
			<input type="checkbox" name="checkboxPrivate" onChange={hprivate} checked={checkboxPrivate}/> private
			<br />
			<input type="checkbox" name="checkboxPublic" onChange={hpublic} checked={checkboxPublic}/> public
			<br />
			<input type="checkbox" name="checkboxPassword" onChange={hpassword} checked={checkboxPassword}/> password
			<br />
			{/* <input type="checkbox" checked={checkboxProtected}/> protected */}
			<input type="text" className="form-control" name="inputchannel" id="inputchannel" placeholder="name" ref={inputNameRef}/>
			<Password passwordRef={inputPasswordRef} isPassword={checkboxPassword}/>
			<button type="button" className="btn btn-primary btn-lg" name='buttonAddFriend' onClick={() => handlerSubmite()}>create</button>
		</div>
	)

}