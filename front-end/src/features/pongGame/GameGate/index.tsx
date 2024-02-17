import './style.css'
import { Link, useNavigate } from 'react-router-dom';

const GameGate: React.FC = () => {

    return (
        <div id="gameGate">
            <h1>PONG GAME</h1>
            
            <Link to="../QueueGate">Got to</Link>
            <br></br>
            <Link to="/">Quitter le gaaaame</Link>
        </div>
    )
}

export default GameGate;