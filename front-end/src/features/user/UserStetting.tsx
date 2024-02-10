import { useState } from 'react'
import QrCode from './QrCode'
import userService from './user.service'
import { useDispatch, useSelector } from 'react-redux'
import { Rootstate } from '../../app/store'
import { changeTfa } from './user.store'
import loginService from '../login/login.service'

const UserSetting = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: Rootstate) => state.user)
	const [isTFAEnabled, setIsTFAEnabled] = useState(false);
	const [username, setUsername] = useState('');

	const [img, setImg] = useState("")

	const handleTfaGen = async () => {
		if (!user.tfa_status) {
			setImg(await userService.genQrcode());
			setIsTFAEnabled(!isTFAEnabled)
		}
	}
	const handleTfaOff = async () => {
		const rep = await loginService.getTfaOff(); //retour de axios 
		if (rep) {
			dispatch(changeTfa(false))
		}
	}

	const hanldeUsername =  async () => {
		const rep = await userService.changeUserName(username)
		console.log(rep);
	}

	//   const handleImageUpload = (event) => {
	//     setImage(URL.createObjectURL(event.target.files[0]));
	//   };
	return (
		<div className="container">
			<h1>User Settings</h1>

			<div className="mb-3">
				<label htmlFor="imageInput" className="form-label">Profile Image</label>
				{/* <input type="file" className="form-control" id="imageInput" accept="image/*" onChange={handleImageUpload} /> */}
				{/* {image && <img src={image} alt="Uploaded" className="mt-3 img-thumbnail" style={{ maxWidth: '200px' }} />} */}
			</div>
			{!user.tfa_status &&
				<div className="mb-3 form-check">
					<input type="checkbox" className="form-check-input" id="tfaCheckbox" checked={isTFAEnabled} onChange={handleTfaGen} />
					<label className="form-check-label" htmlFor="tfaCheckbox">Enable Two-Factor Authentication</label>
					{isTFAEnabled &&
						<QrCode img={img}/>
					}
				</div>
			}

			{user.tfa_status &&
				<>
					<button onClick={handleTfaOff} className="btn btn-danger mt-3">Turn Off 2FA</button>
				</>
			}
			<div className="mb-3 row">
				<label htmlFor="usernameInput" className="col-sm-2 col-form-label">Username</label>
				<div className="col-sm-10">
					<input type="text" className="form-control col-2" style={{ maxWidth: '300px' }} id="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)} />
				</div>
			</div>

			<button className="btn btn-primary" onClick={hanldeUsername} >Save Changes</button>
		</div>
	);
}

export default UserSetting