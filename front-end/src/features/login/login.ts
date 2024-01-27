import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userOnConnection } from "./IUser";

const initialState: userOnConnection = {
	email: "",
	id: null,
	username: "",
}

export const loginStateSlice = createSlice({
	name: "loginState",
	initialState,
	reducers: {
		addUser: (state, action: PayloadAction<userOnConnection>) => {
			state.email = action.payload.email
			state.id = action.payload.id
			state.username = action.payload.username
		}
	}
})

export const { addUser } = loginStateSlice.actions

export default loginStateSlice.reducer