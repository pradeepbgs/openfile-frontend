import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "~/zustand/store";


export function useGoogleLoginHandler() {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = useCallback(async (token: string | undefined) => {
        if (!token) {
            console.log("Google token not found.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
                credentials: 'include'
            });

            if (!res.ok) {
                const error = await res.json();
                console.log(error?.message || "Google login failed.")
                return;
            }

            const data = await res.json();
            useAuth.getState().setUser(data.user);
            navigate(from, { replace: true });

        } catch (err) {
            console.error("Login error:", err);
        }

    }, [navigate, from]);

    return handleGoogleLogin;
}


export const authCheck = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/auth/check`, {
            method: "GET",
            credentials: 'include'
        });

        if (!res.ok) {
            useAuth.getState().logout()
        }

        const data = await res.json();
        useAuth.getState().setUser(data.user);
    } catch (err) {
        console.error("Login error:", err);
    }
}