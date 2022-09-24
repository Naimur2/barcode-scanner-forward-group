import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AuthContext from "../context/AuthContext/AuthContext";
import AuthRoutes from "../routes/auth-routes/auth-routes";
import UserRoutes from "../routes/user-routes/user-routes";

export default function Home() {
    const authCtx = React.useContext(AuthContext);
    React.useEffect(() => {
        authCtx?.checkAuthentication();
    }, []);

    if (authCtx.isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }

    return authCtx?.isAuthenticated ? <UserRoutes /> : <AuthRoutes />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
