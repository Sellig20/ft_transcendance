// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/index'
import Survey from './pages/Survey/index'
import Error from './components/Error/index'
import LoginPage from './pages/LoginPage/index'
import PongGame from './pages/PongGame/index'
import { socket, WebsocketProvider } from './contexts/WebsocketContext';
import { WebSocketPG } from './components/PGame/webSocketPG';

  const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/PongGame" 
            element={
              <WebsocketProvider value={socket}>
                <WebSocketPG />
                <PongGame />
                </WebsocketProvider>
            }
          />
          <Route path="*" element={<Error />} />
          {/*toutes celles qui ne sont pas declarees juste au dessus sont en error  */}
        </Routes>
      </Router>
  );
};

export default App