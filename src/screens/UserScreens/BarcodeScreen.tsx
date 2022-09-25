import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import Constants from "expo-constants";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";
import logo from "../../../assets/logo.png";
import AuthContext from "../../context/AuthContext/AuthContext";
import fonts from "../../theme/fonts";
import WarningModal from "../components/WarningModal/WarningModal";
export interface IAlert {
    type: "success" | "error";
    title: string;
    message: string;
}

export default function BarcodeScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const authCtx = React.useContext(AuthContext);
    const [alertState, setAlertState] = useState<IAlert | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const loadingAnimation = React.useRef(null);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            setLoading(true);
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
            setLoading(false);
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);

        const urlRegx = new RegExp(
            /https:\/\/eventregs\.forwardgroup\.qa\/scan\/\d+/gm
        );

        if (data && urlRegx.test(data)) {
            const eventId = data.split("/").pop();
            const baseURL = Constants.manifest.extra.baseUrl;

            try {
                const response = await axios.get(
                    `${baseURL}/scan-qr/${eventId}`
                );

                if (response.data.success) {
                    setAlertState({
                        type: "success",
                        title: "Success",
                        message: "Access granted",
                    });
                    setError(null);
                } else {
                    setAlertState({
                        type: "error",
                        title: "Error",
                        message: "Access declined",
                    });
                }

                setError(null);
            } catch (error) {
                setError("Error fetching data");
                console.log(error);
            }
        } else {
            setAlertState({
                type: "error",
                title: "Error",
                message: "Access expired",
            });

            setError(null);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <LottieView
                    autoPlay
                    ref={loadingAnimation}
                    style={{
                        width: scale(100),
                        height: scale(100),
                    }}
                    source={require("../../../assets/animations/loading.json")}
                />
            </View>
        );
    }
    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text
                    style={{
                        fontFamily: fonts.inter[700],
                        fontSize: 20,
                    }}
                >
                    No access to camera
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.suggestions}>
                Put the code inside the camera
            </Text>
            <View style={styles.scanner}>
                <BarCodeScanner
                    onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                    }
                    style={[
                        StyleSheet.absoluteFillObject,
                        styles.scannerCamera,
                    ]}
                />
            </View>
            {scanned && (
                <View style={styles.btnCont}>
                    <Pressable
                        style={[styles.button, styles.greenBtn]}
                        onPress={() => setScanned(false)}
                    >
                        <Text style={styles.buttonText}>Tap to Scan Again</Text>
                    </Pressable>
                </View>
            )}
            {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
            <View style={styles.btnCont}>
                <Pressable style={styles.button} onPress={authCtx.logout}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </Pressable>
            </View>
            <WarningModal
                title={alertState?.title}
                message={alertState?.message}
                type={alertState?.type}
                isVisible={!!alertState}
                withSound={true}
                onClose={() => {
                    setAlertState(null);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    scanner: {
        height: 300,
        width: 300,
        marginBottom: 30,
        position: "relative",
        zIndex: 1,
    },
    suggestions: {
        textAlign: "center",
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: fonts.inter[700],
    },
    button: {
        backgroundColor: "red",
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 20,
        maxWidth: 280,
        minWidth: 260,
    },
    greenBtn: {
        backgroundColor: "green",
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontFamily: fonts.inter[700],
    },
    logo: {
        width: 250,
        height: 150,
    },
    btnCont: {
        width: "100%",
        paddingHorizontal: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 15,
    },
    errorMessage: {
        color: "red",
        fontSize: 15,
        fontFamily: fonts.inter[400],
        marginTop: 20,
    },

    scannerCamera: {},
    loaderContainer: {
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
    },
});
