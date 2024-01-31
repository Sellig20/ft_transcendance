import {configureStore } from "@reduxjs/toolkit"
import loginReducer from "../features/login/login"

export const store = configureStore({
	reducer: {
		logedin: loginReducer

	},
})

export type Rootstate = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>