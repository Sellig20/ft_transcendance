import { useState } from 'react'
import QrCode from './QrCode'
import userService from './user.service'
import { useDispatch, useSelector } from 'react-redux'
import { Rootstate } from '../../app/store'
import { changeTfa } from './user.store'
import loginService from '../login/login.service'
import { toast } from 'react-toastify'

const UserSetting = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: Rootstate) => state.user)
	const [isTFAEnabled, setIsTFAEnabled] = useState(false);
	const [username, setUsername] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [image, setImage] = useState("")
	const [avatar, setAvatar] = useState("")
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

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.files && event.target.files[0])
		{
			setImage(URL.createObjectURL(event.target.files[0]));
			console.log(event.target.files[0]);
			
			setFile(event.target.files[0]);
		}
	}

	const uploadFile = async () => {
		let rep;
		if (file) 
		{
			if (file.size > 2097152){
				toast.error("Incorrect img size");
				setFile(null);
				setImage("");
				return null;
			}
			// console.log(file);
			
			const formData = new FormData();
			formData.append('avatar', file);
			rep = await userService.uploadFile(formData);
			// console.log(formData);
			console.log(rep);
			
			const rawImg = await userService.getAvatar(rep);
			const url = URL.createObjectURL(new Blob([rawImg]));
			setAvatar(url)
			
		}
		setFile(null);
		setImage("");
	}

	return (
		<div className="container">

			{avatar &&
				<img src={avatar} className="rounded float-end" alt="..."></img>
			}
			<h1>User Settings</h1>

			<div className="mb-3">
				<label htmlFor="imageInput" className="form-label">Profile Avatar</label>  
				<input type="file" placeholder="" className="form-control" id="imageInput" accept=".jpg" onChange={handleImageUpload} aria-describedby="imgHelp"/>
				<div id="imgHelp" className="form-text">Max size 2Mb and must be jpg</div>
				{image && 
					<>
						<img src={image} alt="Uploaded" className="mt-3 img-thumbnail" style={{ maxWidth: '200px' }} />
						<button className="btn btn-outline-success" onClick={uploadFile} >Upload</button>
					</>
				}
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