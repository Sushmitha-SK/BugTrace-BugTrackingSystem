import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    isLoading: false,
    data: [],
};

export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        loginSuccess: (state, { payload }) => {
            state.isLoading = false;
            state.data = payload.data;
            console.log('Payload Data', payload.data)
            localStorage.setItem("userData", JSON.stringify(payload.data));
        },
        clearLoginDetails(state) {
            state.data = []
        }
    },
});

export const { loginSuccess, clearLoginDetails } = loginSlice.actions;

export default loginSlice.reducer;
