import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AuthProvider from "./src/context/AuthContext/AuthProvider";
import Home from "./src/screens/Home";
import {
    useFonts,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
} from "@expo-google-fonts/inter";

export default function App() {
    let [fontsLoaded] = useFonts({
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <AuthProvider>
                <Home />
            </AuthProvider>
        </NavigationContainer>
    );
}
