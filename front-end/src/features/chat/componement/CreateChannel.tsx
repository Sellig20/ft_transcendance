import { useState, useEffect, useRef} from 'react'
import React from 'react'

export const CreateChannel = ({ clickHandler } : {
	clickHandler: (e:  React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	const inputNameRef = useRef(null);
	const inputPasswordRef = useRef(null);
	const [checkboxPrivate, setCheckboxPrivate] = useState(false);
	const [checkboxPublic, setcheckboxPublic] = useState(true);
	const [checkboxPassword, setcheckboxPassword] = useState(false);
	const [mode, setMode] = useState("");

	const hprivate = (
	) => {
		let newstate = !checkboxPrivate
		console.log("checkboxxxx: ",newstate, checkboxPublic, checkboxPassword)
		setCheckboxPrivate(true)
		setcheckboxPublic(false)
		setcheckboxPassword(false)
		setMode("private")

	};

	const hpublic = (
	) => {
		let newstate = !checkboxPublic
		console.log("checkboxxxx: ", checkboxPrivate, newstate, checkboxPassword)
		setCheckboxPrivate(false)
		setcheckboxPublic(true)
		setcheckboxPassword(false)
		setMode("public")

	};

	const hpassword = (
	) => {
		let newstate = !checkboxPassword
		console.log("checkboxxxx: ", checkboxPrivate, checkboxPublic, newstate)
		setCheckboxPrivate(false)
		setcheckboxPublic(false)
		setcheckboxPassword(true)
		setMode("password")
	};

	const fff = (
	) => {
		console.log("clique: ", mode, inputNameRef.current.value, inputPasswordRef.current.value)
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
			<input type="text" className="form-control" name="password" id="password" placeholder="password" ref={inputPasswordRef}/>
			<button type="button" className="btn btn-primary btn-lg" name='buttonAddFriend' onClick={() => fff()}>create</button>
		</div>
	)

}