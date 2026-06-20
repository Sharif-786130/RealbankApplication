// import { useSelector, useDispatch } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";
// import { logout } from "../app/authSlice";

// export default function ProtectedRoute({ roles, children }) {
//     const { accessToken, role, passwordResetRequired } = useSelector((state) => state.auth);
//     const location = useLocation();
//     const dispatch = useDispatch();

//     if (!accessToken) {
//         return <Navigate to="/login" replace />;
//     }

//     // ← add this: check if token is expired
//     try {
//         const payload = JSON.parse(atob(accessToken.split(".")[1]));
//         const isExpired = payload.exp * 1000 < Date.now();
//         if (isExpired) {
//             dispatch(logout());
//             return <Navigate to="/login" replace />;
//         }
//     } catch (e) {
//         dispatch(logout());
//         return <Navigate to="/login" replace />;
//     }

//     if (roles && !roles.includes(role)) {
//         return <Navigate to="/login" replace />;
//     }

//     if (
//         role === "CUSTOMER" &&
//         passwordResetRequired &&
//         location.pathname !== "/customer/reset-password"
//     ) {
//         return <Navigate to="/customer/reset-password" replace />;
//     }

//     return children;
// }

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