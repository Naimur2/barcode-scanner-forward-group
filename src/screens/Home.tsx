import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AuthContext from "../context/AuthContext/AuthContext";
import AuthRoutes from "../routes/auth-routes/auth-routes";
import UserRoutes from "../routes/user-routes/user-routes";
import LottieView from "lottie-react-native";
import { scale } from "react-native-size-matters";

export default function Home() {
    const authCtx = React.useContext(AuthContext);
    const loading = React.useRef();

    React.useEffect(() => {
        authCtx?.checkAuthentication();
    }, []);

    if (authCtx.isLoading) {
        return (
            <View style={styles.container}>
                <LottieView
                    autoPlay
                    ref={loading}
                    style={{
                        width: scale(100),
                        height: scale(100),
                    }}
                    source={require("../../assets/animations/loading.json")}
                />
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
