import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../features/user/user.store";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk"; 
import { persistReducer, persistStore } from "redux-persist";
import { Tuple } from "@reduxjs/toolkit";
import logger from 'redux-logger';

const persistConfig = {
	key:'root',
	storage,
}

const persistedReducer = persistReducer(persistConfig, UserReducer)

export const store = configureStore({
	reducer: {
		user: persistedReducer
	},
	devTools: true,
	middleware: () => new Tuple(thunk, logger),
})

export const persistor = persistStore(store);

export type Rootstate = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>