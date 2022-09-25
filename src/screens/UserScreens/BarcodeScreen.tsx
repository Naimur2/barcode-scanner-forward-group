import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import Constants from "expo-constants";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
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

const width = Dimensions.get("window").width;
const SCANNER_WIDTH = Math.round(width * 0.8);
const SCANNER_HEIGHT = Math.round(SCANNER_WIDTH * 1.1);

export default function BarcodeScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const authCtx = React.useContext(AuthContext);
    const [alertState, setAlertState] = useState<IAlert | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const loadingAnimation = React.useRef(null);
    const scanningAnimation = React.useRef(null);
    const [isScannning, setIsScanning] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            setLoading(true);
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
            setLoading(false);
        };

        getBarCodeScannerPermissions();
    }, []);

    const scanner = async (data: string) => {
        // initially set the scanning to false
        setScanned(true);

        // get the event id from the data
        const eventId = data.split("/").pop();
        const baseURL = Constants.manifest.extra.baseUrl;

        try {
            // send a request to the server to check if the user is registered for the event
            const response = await axios.get(`${baseURL}/scan-qr/${eventId}`);
            // if the user is registered for the event
            if (response.data.success) {
                // set the alert state to success
                setAlertState({
                    type: "success",
                    title: "Success",
                    message: "Access granted",
                });
            } else {
                // set the alert state to error
                setAlertState({
                    type: "error",
                    title: "Error",
                    message: "Access declined",
                });
            }

            setError(null);
            // setIsScanning(false);
        } catch (error) {
            setError("Error fetching data");
            // setIsScanning(false);
        }
    };

    const handleBarCodeScanned = async ({ type, data }) => {
        setIsScanning(true);
        const urlRegx = new RegExp(
            /https:\/\/eventregs\.forwardgroup\.qa\/scan\/\d+/gm
        );

        if (data && urlRegx.test(data)) {
            // if the link in the data is valid
            await scanner(data);
        } else {
            // if the link in the data is invalid
            // stop scanning
            setScanned(true);
            // remove errors
            setError(null);

            // set the alert state to error
            setAlertState({
                type: "error",
                title: "Error",
                message: "Access expired",
            });
            // set scanning to false
            // setIsScanning(false);
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
            {isScannning ? (
                <Text style={styles.scanningText}>Scanning...</Text>
            ) : null}
            <View style={styles.scanner}>
                <BarCodeScanner
                    onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                    }
                    style={[
                        StyleSheet.absoluteFillObject,
                        styles.scannerCamera,
                    ]}
                ></BarCodeScanner>
            </View>
            {!isScannning && scanned && (
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
                    setIsScanning(false);
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
        width: SCANNER_WIDTH,
        height: SCANNER_HEIGHT,
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

    scannerCamera: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    loaderContainer: {
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
    },
    scannerText: {
        color: "#fff",
    },
    scanningText: {
        color: "#000",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: fonts.inter[700],
        marginVertical: 20,
    },
});
