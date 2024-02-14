import GameGate from './GameGate/index'
import StartGame from './StartGame/index'
import { socket, WebsocketProvider } from './contexts/WebsocketContext';
import { WebSocketPG } from './GameGate/webSocketPG';
import { WebsocketSG } from './StartGame/websocketSG';
import QueueGate from './QueueGate/index'

export function Game() {
	
    return (
        <div>
        <WebsocketProvider value ={socket}>
            <div>
                <StartGame />
                <WebsocketSG />
            </div>
        </WebsocketProvider>
        <WebsocketProvider value={socket}>
            <div>
                <GameGate />
                <WebSocketPG />
            </div>
        </WebsocketProvider>
        <WebsocketProvider value={socket}>
            <div>
                <QueueGate />
            </div>
        </WebsocketProvider>
        </div>
    )
    // return (
    //     <Router>
    //       <Routes>
    //         <Route path="/" element={<Home />} />
    //         <Route path="/survey" element={<Survey />} />
    //         <Route path="/GameGate" 
    //           element={
    //             <WebsocketProvider value={socket}>
    //               <div>
    //                 <GameGate />
    //                 <WebSocketPG />
    //               </div>
    //             </WebsocketProvider>
    //           }
    //         />
    //         <Route path="/StartGame" 
    //           element={
    //             <WebsocketProvider value ={socket}>
    //               <div>
    //                 <StartGame size={10} />
    //                 <WebsocketSG />
    //               </div>
    //             </WebsocketProvider>
    //           } />
    //         <Route path="/QueueGate" 
    //           element={
    //             <WebsocketProvider value={socket}>
    //               <div>
    //                 <QueueGate />
    //               </div>
    //             </WebsocketProvider>
    //           }
    //         />
    //         <Route path="*" element={<Error />} />
    //         {/*toutes celles qui ne sont pas declarees juste au dessus sont en error  */}
    //       </Routes>
    //     </Router>
    //   );
}

export default Game;