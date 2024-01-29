import { useState } from 'react'
import TfaComp from './TfaComp'
import useIsAuth from '../hook/useIsAuth'
import userService from './user.service'

const UserPage: React.FunctionComponent = () => {
	useIsAuth()
	const [genQr, setGenQr] = useState(false)
	const [img, setImg] = useState("")

	const handleTfaGen = async () => {
		setGenQr(!genQr);
		setImg(await userService.genQrcode());
		console.log(img, 'in handle');
		
	}

	return (
		<div>userpage / setting
			<button onClick={handleTfaGen}>turn on 2FA</button>
			{genQr && 
				<TfaComp img={img}/>
			}
		</div>
	)
}

export default UserPage