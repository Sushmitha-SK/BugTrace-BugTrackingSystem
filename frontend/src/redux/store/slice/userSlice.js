import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    isLoading: false,
    data: [],
    userdata: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        createUser: (state, { payload }) => {
            state.isLoading = false;
            state.data = payload.data;
        },
        getAllUserDetails: (state, { payload }) => {
            state.isLoading = false;
            state.userdata = payload.data;
        },
        clearAllUserDetails(state) {
            state.userdata = []
        }
    },
});

export const { createUser, getAllUserDetails, clearAllUserDetails } = userSlice.actions;

export default userSlice.reducer;
