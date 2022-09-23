import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthProvider from "./src/context/AuthContext/AuthProvider";
import Home from "./src/screens/Home";

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <Home />
            </AuthProvider>
        </NavigationContainer>
    );
}
