import Checkbox from "expo-checkbox";
import { useFormik } from "formik";
import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
} from "react-native";
import AuthContext from "../../context/AuthContext/AuthContext";
import * as Yup from "yup";
import logo from "../../../assets/icon.png";

export default function Login() {
    const [isChecked, setChecked] = React.useState(false);
    const authCtx = React.useContext(AuthContext);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: (values) => {
            authCtx?.login?.(values);
        },
        validationSchema,
    });

    const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
        formik;

    return (
        <View style={[styles.container]}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.loginHeader}>Login</Text>
            <View style={styles.loginForm}>
                <View style={styles.inputGroup}>
                    <Text style={styles.loginFormLabel}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                    />
                    {touched?.email && errors.email ? (
                        <Text style={styles.errorMessage}>{errors.email}</Text>
                    ) : null}
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.loginFormLabel}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={isChecked ? false : true}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        passwordRules="required: lower; required: upper; required: digit; required: [-]; minlength: 8;"
                    />
                    {touched?.password && errors.password ? (
                        <Text style={styles.errorMessage}>
                            {errors.password}
                        </Text>
                    ) : null}
                </View>
                <View style={styles.hstack}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? "#4630EB" : undefined}
                    />
                    <Text style={styles.checkboxText}>
                        {isChecked ? "Hide Password" : "Show Password"}
                    </Text>
                </View>

                <Pressable style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loginHeader: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },
    loginForm: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,

        paddingHorizontal: 10,
        borderRadius: 5,
    },
    loginFormLabel: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 50,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    checkbox: {
        marginRight: 10,
    },
    hstack: {
        flexDirection: "row",
        alignItems: "center",
    },
    errorMessage: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
    },
    logo: {
        width: 250,
        height: 150,
    },
});
