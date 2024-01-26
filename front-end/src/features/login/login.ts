import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	value: false
}

export const loginStateSlice = createSlice({
	name: "loginState",
	initialState,
	reducers: {
		changeStateLogin: (state) => {
			state.value = !state.value
		}
	}
})

export const { changeStateLogin } = loginStateSlice.actions

export default loginStateSlice.reducer