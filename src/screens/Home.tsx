import React from "react";
import AuthContext from "../context/AuthContext/AuthContext";
import AuthRoutes from "../routes/auth-routes/auth-routes";
import UserRoutes from "../routes/user-routes/user-routes";

export default function Home() {
    const authCtx = React.useContext(AuthContext);
    return authCtx?.isAuthenticated ? <UserRoutes /> : <AuthRoutes />;
}
