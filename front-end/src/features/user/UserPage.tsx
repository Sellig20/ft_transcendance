import { useState } from 'react'
import TfaComp from './TfaComp'
import useIsAuth from '../hook/useIsAuth'
import userService from './user.service'
import { useDispatch, useSelector } from 'react-redux'
import { Rootstate } from '../../app/store'
import { changeTfa } from './user.store'
import loginService from '../login/login.service'

const UserPage: React.FunctionComponent = () => {
	useIsAuth()
	const dispatch = useDispatch();
	const user = useSelector((state: Rootstate) => state.user)
	console.log(user);
	
	const [img, setImg] = useState("")

	const handleTfaGen = async () => {
		if (!user.tfa_status) {
			setImg(await userService.genQrcode());
		}
	}
	const handleTfaOff = async () => {
		const rep = await loginService.getTfaOff(); //retour de axios 
		if (rep){
			dispatch(changeTfa(false))
		}
	}
	//si la 2fa est activee on ne doit plus pouvoir voir le gen button 
	//et on doit avoir un bouton pour la désactiver

	//si la 2fa n'est pas ativee on voit le bouton pour l'activer
	return (
		<div>
			{!user.tfa_status &&
				<>
					<button onClick={handleTfaGen}>turn on 2FA</button>
					<TfaComp img={img} />
				</>
			}
			{user.tfa_status &&
				<>
					<button onClick={handleTfaOff}>turn off 2FA</button>
				</>
			}
		</div>
	)
}

export default UserPage