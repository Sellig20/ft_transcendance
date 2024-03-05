import React from 'react'
import { useRef} from 'react'
// import sha256 from 'crypto-js/sha256';
import { sha256 } from 'js-sha256';
import { toast } from 'react-toastify';

export const InputMessage = ({ channelinfo, inputMessageRef, buttonHandler, locked, setLocked} : {
	channelinfo: any
	newMessages: any
	inputMessageRef: React.MutableRefObject<null>,
	buttonHandler: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>,
	locked: boolean,
	setLocked: any
}) => {

	const handlepassword = async (
		) => {
			let psw_input = inputPasswordRef.current.value;
			if (psw_input === null)
				return ;
			psw_input = sha256(psw_input);
			if (psw_input === channelinfo.password)
			{
				console.log("acces to channel via password");
				setLocked(false)
			}
			else
			{
				toast.error("error wrong password")
			}
			inputPasswordRef.current.value = null
		};

	const inputPasswordRef = useRef(null);
	// console.log("channel selected:", channelinfo, newMessages)
	if(channelinfo === undefined || channelinfo === null)
		return ;
	if (locked === true)
	{
		return (
			<div className="d-flex justify-content-end">
				<input type="password" className="form-control" name="inputSend" id="inputSend" ref={inputPasswordRef}/>
				<button type="button" className="btn btn-primary btn-lg" name='buttonSend' onClick={() => handlepassword()}>Enter</button>
			</div>
		)
	}
	return (
			<div className="d-flex justify-content-end">
				<input type="text" className="form-control" name="inputSend" id="inputSend" ref={inputMessageRef}/>
				<button type="button" className="btn btn-primary btn-lg" name='buttonSend' onClick={buttonHandler}>Send</button>
			</div>
	);
}