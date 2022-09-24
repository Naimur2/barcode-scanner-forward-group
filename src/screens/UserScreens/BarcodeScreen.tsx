import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import logo from "../../../assets/icon.png";
import AuthContext from "../../context/AuthContext/AuthContext";
import fonts from "../../theme/fonts";
import Constants from "expo-constants";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";

export default function BarcodeScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const authCtx = React.useContext(AuthContext);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        // setScanned(true);

        const urlRegx = new RegExp(
            /https:\/\/eventregs\.forwardgroup\.qa\/scan\/\d+/gm
        );
        if (urlRegx.test(data)) {
            setLoading(true);
            const eventId = data.split("/").pop();
            const baseURL = Constants.manifest.extra.baseUrl;

            try {
                const response = await axios.get(
                    `${baseURL}/scan-qr/${eventId}`
                );
                setLoading(false);
                if (response.data.success) {
                    setShowAlert(true);
                    setAlertMessage(
                        "You have successfully scanned the QR code"
                    );
                    setAlertTitle("Success");
                } else {
                    setShowAlert(true);
                    setAlertMessage("Invalid User");
                    setAlertTitle("Error");
                }

                setError("");
                setScanned(true);
            } catch (error) {
                setError("Error fetching data");
            }
        }
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text
                    style={{
                        fontFamily: fonts.inter[400],
                    }}
                >
                    Requesting for camera permission
                </Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text
                    style={{
                        fontFamily: fonts.inter[400],
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
                    style={StyleSheet.absoluteFillObject}
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
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertTitle}
                message={alertMessage}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowAlert(false);
                    setAlertMessage("");
                    // setScanned(false);
                }}
                onDismiss={() => {
                    setShowAlert(false);
                    setAlertMessage("");
                }}
                confirmButtonStyle={{
                    fontFamily: fonts.inter[400],
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                }}
                messageStyle={{
                    fontFamily: fonts.inter[400],
                    fontSize: 16,
                    textAlign: "center",
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
    },
    scanner: {
        height: 300,
        width: 300,
        marginBottom: 30,
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
});
