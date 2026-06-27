import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ roles, children }) {
    const { accessToken, role, passwordResetRequired } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    if (
        role === "CUSTOMER" &&
        passwordResetRequired &&
        location.pathname !== "/customer/reset-password"
    ) {
        return <Navigate to="/customer/reset-password" replace />;
    }

    return children;
}