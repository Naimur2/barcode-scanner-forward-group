// app.config.ts

// `@expo/config` is installed with the `expo` package
// ensuring the versioning is correct.
import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Forward Group Scanner",
    slug: "ForwardGroupScanner",
    icon: "./assets/icon.png",
    extra: {
        baseUrl: "https://qrcode.bizblanca.com/api",
    },
});
