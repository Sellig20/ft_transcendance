import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import { Rootstate } from "../../app/store";

export const WebSocketQG = ({socket}) => {

	const {idP} = useParams();
	let id1P: number;	
	if (idP && parseInt(idP)){
		id1P = parseInt(idP, 10);
	}

	const [Isfirst, setIsfirst] = useState<boolean>(false)
    const userid = useSelector((state: Rootstate) => state.user.id);

    const navigate = useNavigate();
    const handleQuitQueue = () => {
        socket?.emit('quitQueue', socket.id);
        navigate('../');
    }



    useEffect(() => {
        const handlePrepareMatch = () => {
            // console.log("prepare match in queue gate");
            navigate("/game/startGame")
        }

		const handleFinishFirst = () => {
            setIsfirst(true);
        }

        socket?.on('prepareForMatch', handlePrepareMatch);
		socket?.on('firstFinish', handleFinishFirst);
        return () => {
            socket?.off('prepareForMatch', handlePrepareMatch);
			socket?.off('firstFinish', handleFinishFirst);
        };
    }, [socket]);
	
	if (Isfirst === true)
		socket?.emit("goQueueListPrivate", {socketId: socket.id, mapChoice: 1, userId: userid, user2: id1P})
    return (
        <div>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            />
            <div className="QG mt-4">
                <div className="jumbotron mt-4">
                    <h1>QUEUE</h1>
                    <div className="loading-dots">
                        <div><p>Loading</p></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                    </div>
                    <p> finding someone to play with you</p>

                    <div className="row">
                        <div className="col-12">
                            <button className="buttonGame" onClick={handleQuitQueue}>
                                <span>Quit Queue List</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WebSocketQG;