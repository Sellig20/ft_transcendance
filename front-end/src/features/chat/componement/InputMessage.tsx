import React from 'react'
import { useState, useEffect, useRef} from 'react'
import chatService from '../chat.service'

export const InputMessage = ({ channelinfo, newMessages, inputMessageRef, buttonHandler} : {
	channelinfo: any
	newMessages: any
	inputMessageRef: React.MutableRefObject<null>,
	buttonHandler: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>,
}) => {
	// console.log("channel selected:", channelinfo, newMessages)
	if(channelinfo === undefined)
		return ;
	return (
			<div className="d-flex justify-content-end">
				<input type="text" className="form-control" name="inputSend" id="inputSend" ref={inputMessageRef}/>
				<button type="button" className="btn btn-primary btn-lg" name='buttonSend' onClick={buttonHandler}>Send</button>
			</div>
	);
}