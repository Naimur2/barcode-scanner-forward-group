import React from "react";

export interface IError {
    message: string;
    type: string;
}

export interface IAuthContext {
    user: any;
    error: Error | null;
    isLoading: boolean;
    login: (user: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    setLoading: (isLoading: boolean) => void;
    setError: (error: IError) => void;
}

const AuthContext = React.createContext<IAuthContext>({
    user: null,
    isAuthenticated: false,
    login: (userData: any) => {},
    logout: () => {},
    error: null,
    isLoading: false,
    setLoading: (isLoading: boolean) => {},
    setError: (error: IError) => {},
});

export default AuthContext;
