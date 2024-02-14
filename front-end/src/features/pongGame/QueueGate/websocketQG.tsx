// import { useContext, useEffect, useState } from "react"
// import { WebsocketContext } from "../../contexts/WebsocketContext"
// import { useNavigate } from 'react-router-dom';
// import { SlowBuffer } from "buffer";
// import { Server } from "http";

// interface User {
//     clientId: string;
//     // Ajoutez d'autres propriétés nécessaires ici
// }

// const WebsocketQG = () => {

//     const socket = useContext(WebsocketContext);
//     const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

//     useEffect(() => {

//         console.log("composant monté pour queue list");
//         console.log('Socket connected:', socket.connected);

//         const handleConnect = () => {
//             console.log('Connected in Queue list!');
//         }
        
//         const handleConnection = ({ clientId, userArray}: { clientId: string, userArray: any[] }) => {
//             console.log(`User react -> ${clientId} | User array react -> ${userArray}`)
//             setConnectedUsers(userArray);
//         };
        
//         const handleDisconnection = ({ clientId, userArray}: { clientId: string, userArray: any[] }) => {
//             console.log(`User disconnect react -> ${clientId} | User disconnect array react -> ${userArray}`)
//             setConnectedUsers(userArray);
//         };
        
//         socket.on('connect', handleConnect);
//         socket.on('user-connected', handleConnection);
//         socket.on('user-disconnected', handleDisconnection);
        
//         return () => {
//             socket.off('connect', handleConnect);
//             socket.off('user-connected', handleConnection);
//             socket.off('user-disconnected', handleDisconnection);
//         };
        
//     }, []);
//     return (
//         <div>
//             <h1> websocket QG</h1>
//             <h2>Utilisateurs connectés :</h2>
//             <ul>
//                 {connectedUsers.map((item) => (
//                     <li key={item.clientId}>{item.clientId}</li>
//                 ))}
//             </ul>
//         </div>
//     )

// }

// const Banner = ({ message }: { message: string }) => (
//     <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
//         {message}
//     </div>
//     );


// export default WebsocketQG;


import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"

const WebsocketQG = () => {

    const socket = useContext(WebsocketContext);
    const [userArray, setUserArray] = useState<string[]>([]);

    useEffect(() => {
        if (socket.connected)
        {
            console.log(`je suis ${socket.id} dans queue gate .tsx`);
        }

        const handleConnect = () => {
            console.log('Connected in QUEUE GAME!');
        }

        socket.on('connect', handleConnect);

        const handleUserCo = ({ clientId, userArray }: { clientId: string; userArray: string[] }) => {
            console.log(`User connected: ${clientId}`);
            console.log(`Updated user array: ${userArray}`);
            setUserArray(userArray);
            console.log("Tab => ", userArray);
        }

        socket.on('user-connected', handleUserCo);
        
        socket.on('updateUA', ({ userArray: updateUA }) => {
            setUserArray(updateUA);
        })

        socket.on('user-disconnected', ({ clientId, userArray}) => {
            console.log(`user array ${userArray}`);
        });

        return () => {
            socket.off('user-connected');
            socket.off('updateUA');
            socket.off('user-disconnect');
        };

    }, [socket]);
    return (
        <div>
            <h2>Connected Users</h2>
            <ul>
                {userArray.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        </div>
    )

}

export default WebsocketQG;