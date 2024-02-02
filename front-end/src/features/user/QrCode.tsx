import { useState } from "react";
import userService from "./user.service";
import { useDispatch } from "react-redux";
import { changeCo, changeTfa } from "./user.store";
import { useNavigate } from "react-router-dom";


const TfaComp: React.FunctionComponent<{img: string}> = (img) => {
	const [code, setCode] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleTfaTurnOn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const rep = await userService.setTfaOn(code);
		if (rep) {
			localStorage.removeItem("token")
			dispatch(changeTfa(true))
			dispatch(changeCo(false));
			navigate('/');
		}
		// j'ai besoin d'un store dispatch pour faire disparaitre le 2 fa comp ?
		setCode("")
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value);
	}

	return (
		<>
			<div className="mb-3">
				<img src={img.img} alt="QR Code" className="img-fluid mb-3" />
				<form onSubmit={handleTfaTurnOn} className="d-flex">
					<div className="col-auto">
						<input
							onChange={handleChange}
							type="number"
							name="code"
							value={code}
							className="form-control"
							maxLength={6}
							placeholder="123456"
							aria-label="TFA code"
							aria-describedby="tfaCode"
						/>
					</div>
					<button type="submit" className="btn btn-primary">Validate</button>
				</form>
			</div>
		</>
	)
}

export default TfaComp