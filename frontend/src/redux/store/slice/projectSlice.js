import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    isLoading: false,
    data: [],
}

export const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        projectListData: (state, { payload }) => {
            state.isLoading = false;
            state.data = payload.data;
        },
        clearProjectListData(state) {
            state.data = []
        }
    }
});

export const { projectListData, clearProjectListData } = projectSlice.actions;

export default projectSlice.reducer;