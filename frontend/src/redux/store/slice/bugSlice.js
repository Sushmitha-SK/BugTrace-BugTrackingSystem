import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    isLoading: false,
    data: []
}

export const bugSlice = createSlice({
    name: "bug",
    initialState,
    reducers: {
        bugticketList: (state, { payload }) => {
            state.isLoading = false;
            state.data = payload.data;
        },
        clearBugticketlist(state) {
            state.data = []
        }
    }
});

export const { bugticketList, clearBugticketlist } = bugSlice.actions;

export default bugSlice.reducer;