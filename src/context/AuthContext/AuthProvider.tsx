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

    const login = async (user: { email: string; password: string }) => {
        dispatch({ type: SETLOADING, payload: true });
        try {
            const data = {
                email: user.email.toLowerCase(),
                password: user.password,
            };
            const baseURL = Constants.manifest.extra.baseUrl;
            const response = await axios.post(`${baseURL}/login`, data);

            if (response.data.success) {
                dispatch({ type: LOGIN, payload: response?.data?.user });
                await AsyncStorage.setItem("auth", JSON.stringify(data));
            } else {
                dispatch({
                    type: SETERROR,
                    payload: {
                        type: "login",
                        message: "Invalid email or password",
                    },
                });
            }
            dispatch({ type: SETLOADING, payload: false });
        } catch (error) {
            dispatch({
                type: SETERROR,
                payload: {
                    type: "login",
                    message: error.message,
                },
            });
            dispatch({ type: SETLOADING, payload: false });
        }
    };

    const logout = () => {
        dispatch({ type: LOGOUT });
        AsyncStorage.removeItem("auth");
    };

    const checkAuthentication = async () => {
        dispatch({ type: SETLOADING, payload: true });
        const auth = await AsyncStorage.getItem("auth");
        if (auth) {
            const { user } = JSON.parse(auth);
            dispatch({ type: LOGIN, payload: user });
        }
        dispatch({ type: SETLOADING, payload: false });
    };

    const scan = async (code) => {
        try {
            const baseURL = Constants.manifest.extra.baseUrl;
            const response = await axios.post(`${baseURL}/scan`, {
                code,
            });

            return response.data;
        } catch (error) {
            dispatch({
                type: SETERROR,
                payload: {
                    type: "scan",
                    message: error.message,
                },
            });
        }
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
        checkAuthentication,
    };

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
}
