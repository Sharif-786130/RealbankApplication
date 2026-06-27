import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "./authSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function useAuthInit() {
    const [isReady, setIsReady] = useState(false);
    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.auth.accessToken);

    useEffect(() => {
        const init = async () => {
            // No token saved → nothing to restore, go to login
            if (!accessToken) {
                setIsReady(true);
                return;
            }

            // Check if saved access token is still valid
            let isExpired = false;
            try {
                const payload = JSON.parse(atob(accessToken.split(".")[1]));
                isExpired = payload.exp * 1000 < Date.now();
            } catch {
                dispatch(logout());
                setIsReady(true);
                return;
            }

            // Token still valid → no refresh needed, render immediately
            if (!isExpired) {
                setIsReady(true);
                return;
            }

            // Token expired → silent refresh using HttpOnly cookie
            try {
                const res = await fetch(`${BASE_URL}/auth/refresh`, {
                    method: "POST",
                    credentials: "include", // sends the HttpOnly cookie automatically
                });

                if (res.ok) {
                    const data = await res.json();
                    dispatch(setCredentials({
                        accessToken: data.accessToken,
                        role: data.role,
                        customerId: data.customerId,
                        passwordResetRequired: data.passwordResetRequired,
                    }));
                } else {
                    // Refresh token expired too → force logout
                    dispatch(logout());
                }
            } catch {
                dispatch(logout());
            }

            setIsReady(true);
        };

        init();
    }, []);

    return isReady;
}