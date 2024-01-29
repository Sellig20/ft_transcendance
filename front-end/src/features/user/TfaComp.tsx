import { useState } from "react";
import userService from "./user.service";


const TfaComp: React.FunctionComponent<{img: string}> = (img) => {
	const [code, setCode] = useState("");

	const handleTfaTurnOn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const rep = await userService.setTfaOn(code);
		// j'ai besoin d'un store dispatch pour faire disparaitre le 2 fa comp ?
		setCode("")
	}


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value);
	}

	return (
		<>
			<img src={img.img} alt="QR Code" />
			<form onSubmit={handleTfaTurnOn}>
				<input onChange={handleChange} type="number" name="code" value={code} />
				<button type="submit">validate</button>
			</form>
		</>
	)
}

export default TfaComp