import axios from "axios";
import Constants from "expo-constants";
import React from "react";
import AuthContext from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const SETLOADING = "SETLOADING";
const SETERROR = "SETERROR";

const defaultState = {
    user: null,
    error: null,
    isLoading: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, user: action.payload, isAuthenticated: true };
        case LOGOUT:
            return { ...state, user: null, isAuthenticated: false };
        case SETLOADING:
            return { ...state, isLoading: action.payload };
        case SETERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default function AuthProvider({ children }) {
    const [state, dispatch] = React.useReducer(reducer, defaultState);

    const login = async (user) => {
        try {
            const data = {
                email: user.email,
                password: user.password,
            };
            const baseURL = Constants.manifest.extra.baseUrl;
            const response = await axios.post(`${baseURL}/auth/login`, data);
            dispatch({ type: LOGIN, payload: response?.data?.user });
            AsyncStorage.setItem(
                "auth",
                JSON.stringify({
                    user: response?.data?.user,
                    token: response?.data?.token,
                })
            );
        } catch (error) {
            dispatch({
                type: SETERROR,
                payload: error?.response?.data?.message,
            });
        }
    };

    const logout = () => {
        dispatch({ type: LOGOUT });
        AsyncStorage.removeItem("auth");
    };

    const values = {
        user: state.user,
        error: state.error,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        login,
        logout,
        setLoading: (value) => dispatch({ type: SETLOADING, payload: value }),
        setError: (value) => dispatch({ type: SETERROR, payload: value }),
    };

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
}
