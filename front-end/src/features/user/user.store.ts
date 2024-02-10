import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userOnConnection } from "../login/IUser";

const initialState: userOnConnection = {
	email: "",
	id: null,
	username: "",
	tfa_status: false,
	connected: false,
}

export const UserSlice = createSlice({
	name: "loginState",
	initialState,
	reducers: {
		addUser: (state, action: PayloadAction<userOnConnection>) => {
			state.email = action.payload.email
			state.id = action.payload.id
			state.username = action.payload.username
			state.tfa_status = action.payload.tfa_status
			state.connected = true;
		},
		changeTfa: (state, action: PayloadAction<boolean>) => {
			state.tfa_status = action.payload
		},
		changeCo: (state, action: PayloadAction<boolean>) => {
			state.tfa_status = action.payload
		},
		logout: (state) => {
			state.email = "";
			state.id = null;
			state.username = "";
			state.tfa_status = false;
			state.connected = false;
			localStorage.removeItem('persist:root');
		}
	}
})


 
export const { addUser, changeTfa, changeCo, logout, } = UserSlice.actions

export default UserSlice.reducer