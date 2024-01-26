// // import React from 'react'
// // import ReactDOM from 'react-dom/client'
// // import App from './App.jsx'
// // import './index.css'

// // ReactDOM.createRoot(document.getElementById('root')).render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>,
// // )

// // import ReactDOM from 'react-dom'

// // ReactDOM.render(<App />, document.getElementById('root'));

// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App'

// // Créez un élément racine à l'aide de createRoot
// const root = createRoot(document.getElementById('root') as HTMLElement);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );











import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
)




// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App'

// // Créez un élément racine à l'aide de createRoot
// const root = createRoot(document.getElementById('root') as HTMLElement);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );