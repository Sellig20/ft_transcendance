import { useState, useEffect, useRef} from 'react'
import React from 'react'
import chatService from '../chat.service'
import { sha256 } from 'js-sha256';
import { toast } from 'react-toastify';


const Password = ({ passwordRef, isPassword} : {
	passwordRef: any
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
		let	isPublic = true
		let psw = ""
		console.log(inputNameRef.current)
		if (inputNameRef.current === null)
			return ;
		let channel_name = inputNameRef.current.value
		
		if (channel_name === "")
		{
			toast.error("error invalid name")
			return ;
		}

		if (mode == "password")
		{
			if (inputPasswordRef.current === null || inputPasswordRef.current === undefined)
				return ;
			let channel_password = inputPasswordRef.current.value
			isPublic = true
			if (channel_password === "" || channel_password === null)
			{
				toast.error("error invalid password")
				return ;
			}
			psw = sha256(channel_password)
			inputPasswordRef.current.value = null
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
		// if (channel_password === undefined && mode !== "password")
		// 	channel_password = null
		// console.log("clique: ", mode, channel_password, channel_name)
		// inputNameRef.current = null
		// inputPasswordRef.current = null
		console.log("end", inputPasswordRef, inputNameRef)
		inputNameRef.current.value = ""
		const res = await chatService.createChannel(channel_name, false, isPublic, iduser, psw)
		if (res === null)
		{
			reload()
			return ;
		}
		reload()
		// setuserinfo(userinfo.channel_list.push(res.data))
		setChannelSelected(null)
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