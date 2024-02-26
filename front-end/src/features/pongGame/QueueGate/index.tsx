import React from 'react';
import WebsocketQG from './websocketQG';

const QueueGate: React.FC = () => {

    return (
        <nav>
            <h1>Vous faites la queue on attend quelqun</h1>
            <WebsocketQG />
        </nav>
    )

}

export default QueueGate;