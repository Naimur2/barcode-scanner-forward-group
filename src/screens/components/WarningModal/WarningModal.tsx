import LottieView from "lottie-react-native";
import React from "react";
import Modal from "react-native-modal";
import { scale } from "react-native-size-matters";
import styled from "styled-components/native";
import { IAlert } from "../../BarcodeScreen";
import { Audio } from "expo-av";

interface IWarningModal extends IAlert {
    isVisible: boolean;
    onClose: () => void;
    playSoundOnError: boolean;
}

export default function WarningModal({
    title,
    type,
    message,
    isVisible,
    onClose,
    playSoundOnError,
}: IWarningModal) {
    const error = React.useRef(null);
    const success = React.useRef(null);
    const [sound, setSound] = React.useState(null);

    async function playSound() {
        console.log("Loading Sound");
        const { sound } = await Audio.Sound.createAsync(
            require("../../../../assets/sounds/error-alarm.wav")
        );
        sound.setIsLoopingAsync(true);
        setSound(sound);

        console.log("Playing Sound");
        await sound.playAsync();
    }

    React.useEffect(() => {
        return sound
            ? () => {
                  console.log("Unloading Sound");
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    React.useEffect(() => {
        if (type === "error" && playSoundOnError && isVisible) {
            playSound();
        }
        if (!isVisible) {
            sound?.stopAsync();
        }
    }, [type, playSoundOnError, isVisible]);

    return (
        <Modal isVisible={isVisible}>
            <ModalContainer>
                <ModalTitle color={type === "success" ? "green" : "red"}>
                    {message}
                </ModalTitle>
                {type === "error" ? (
                    <LottieView
                        autoPlay
                        ref={error}
                        style={{
                            width: scale(250),
                            height: scale(250),
                        }}
                        source={require("../../../../assets/animations/error.json")}
                    />
                ) : null}
                {type === "success" ? (
                    <LottieView
                        autoPlay
                        ref={success}
                        style={{
                            width: scale(210),
                            height: scale(210),
                        }}
                        source={require("../../../../assets/animations/success.json")}
                    />
                ) : null}

                <ModalButton
                    onPress={onClose}
                    bg={type === "success" ? "#2bc180" : "#C12B2B"}
                >
                    <ModalButtonText>Close</ModalButtonText>
                </ModalButton>
            </ModalContainer>
        </Modal>
    );
}

const ModalContainer = styled.View`
    background-color: #fff;
    padding: 22px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props?.color || "#000"};
`;

const ModalButton = styled.TouchableOpacity`
    background-color: ${(props) => props?.bg || "#2bc180"};
    padding: 12px 30px;
    border-radius: 16px;
    margin-top: 22px;
    width: 100%;
`;

const ModalButtonText = styled.Text`
    color: #fff;
    font-size: 16px;
    text-align: center;
`;
