import { MessageProps } from "../PropsType/Props";

export function Message({
	id,
	content,
	sender
}: MessageProps) 
{
	// console.log("message id:", id, " message:", content);
	if (sender == "robin")
	{
		return (
			<>
			<div>
				{/* <div class="bg-danger"> */}
					<div className="ms-5">
						<div className="d-flex flex-row-reverse">
							<div className="p-3 mb-2 bg-primary text-white  rounded-5">
								de : {sender}
								<br />
								'{content}'
								<br />
								'id : {id}'
								(droite)
							</div>
						</div>
					</div>
				{/* </div> */}
				<div>
					<br />
				</div>
			</div>
			</>
		);
	}
	else
	{
		return (
			<>
			<div>
				{/* <div class="bg-danger"> */}
						<div className="d-flex flex-row mb-3">
							<div className="p-3 mb-2 bg-primary text-white  rounded-5">
								de : {sender}
								<br />
								'{content}'
								<br />
								'id : {id}'
								(gauche)
							</div>
						</div>
				{/* </div> */}
				<div>
					<br />
				</div>
			</div>
			</>
		);
	}
}