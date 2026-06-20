import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useVerifyOtpMutation, useResendOtpMutation } from "../../api/authApi";
import { setCredentials } from "../../app/authSlice";

export default function VerifyOtp() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [resendMessage, setResendMessage] = useState("");

    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setResendMessage("");

        try {
            //   const res = await verifyOtp({ email, otp }).unwrap();

            //   const role = res.role.replace("ROLE_", "");

            //   dispatch(setCredentials({
            //     accessToken: res.accessToken,
            //     role: role,
            //     passwordResetRequired: res.passwordResetRequired,
            //     customerId: res.customerId,
            //   }));

            //   navigate("/customer/dashboard");

            const res = await verifyOtp({ email, otp }).unwrap();

            const role = res.role.replace("ROLE_", "");

            dispatch(setCredentials({
                accessToken: res.accessToken,
                role: role,
                passwordResetRequired: res.passwordResetRequired,
                customerId: res.customerId,
            }));

            if (res.passwordResetRequired) {
                navigate("/customer/reset-password");
            } else {
                navigate("/customer/dashboard");
            }

        } catch (err) {
            setError(err?.data?.message || err?.data || "Invalid or expired OTP. Please try again.");
        }
    };

    const handleResend = async () => {
        setError("");
        setResendMessage("");
        try {
            await resendOtp({ email, otp: "" }).unwrap();
            setResendMessage("A new OTP has been sent to your email.");
        } catch (err) {
            setError(err?.data?.message || err?.data || "Failed to resend OTP.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4 py-8">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold text-center mb-2 text-gray-700">
                    Verify Your Email
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    We sent a 6-digit code to your email. Enter it below to activate your account.
                </p>

                {error && (
                    <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
                )}
                {resendMessage && (
                    <p className="text-green-600 text-sm mb-3 text-center">{resendMessage}</p>
                )}

                <form onSubmit={handleVerify}>
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border p-2 w-full mb-3 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                        className="border p-2 w-full mb-3 border-gray-300 rounded-lg tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />

                    <button
                        type="submit"
                        disabled={!email || otp.length !== 6 || isLoading}
                        className="bg-amber-600 hover:bg-amber-700 transition text-white p-3 w-full rounded-lg font-semibold disabled:opacity-50"
                    >
                        {isLoading ? "Verifying..." : "Verify & Continue"}
                    </button>
                </form>

                <button
                    onClick={handleResend}
                    disabled={!email || isResending}
                    className="w-full text-sm text-amber-700 hover:underline mt-4 disabled:opacity-50"
                >
                    {isResending ? "Resending..." : "Didn't get a code? Resend OTP"}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                    Wrong email?{" "}
                    <Link to="/register" className="text-amber-600 hover:underline">
                        Go back to signup
                    </Link>
                </p>
            </div>
        </div>
    );
}