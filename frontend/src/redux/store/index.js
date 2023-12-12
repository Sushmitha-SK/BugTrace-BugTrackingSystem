import { configureStore } from "@reduxjs/toolkit";
import loginReducer, { initialState } from "./slice/userAuthSlice";
import projectReducer from '../store/slice/projectSlice'
import userReducer from '../store/slice/userSlice'
import bugReducer from '../store/slice/bugSlice'

const storedData = localStorage.getItem("userData");
const preloadedState = {
    login: { ...initialState, data: storedData ? JSON.parse(storedData) : [] },
};

// Reducers

export const store = configureStore({
    reducer: {
        login: loginReducer,
        project: projectReducer,
        user: userReducer,
        bug: bugReducer
    },
    preloadedState,
});

