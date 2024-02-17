import './style.css'
import { Link, useNavigate } from 'react-router-dom';

const GameGate: React.FC = () => {

    const navigate = useNavigate();

    const handleRedirectToQueueGate = () => {
        navigate('../queue');
    }

    return (
        <div id="gameGate">
            <h1>PONG GAME</h1>
            <button onClick={handleRedirectToQueueGate}>QueueGateuh</button>
            <Link to="../QueueGate">Got to</Link>
            <br></br>
            <Link to="/">Quitter le gaaaame</Link>
        </div>
    )
}

export default GameGate;