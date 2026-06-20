// import { useState } from "react";
// import { useLoginMutation } from "../../api/authApi";
// import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { setCredentials } from "../../app/authSlice";

// export default function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     const [login, { isLoading }] = useLoginMutation();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleLogin = async () => {
//         setError("");

//         try {
//             const res = await login({ email, password }).unwrap();

//             // clean role — remove ROLE_ prefix
//             const role = res.role.replace("ROLE_", "");

//             // ✅ dispatch only once — pass only what is needed
//             dispatch(setCredentials({
//                 accessToken: res.accessToken,
//                 role: role,
//                 passwordResetRequired: res.passwordResetRequired,
//                 customerId: res.customerId,
//             }));

//             // force password reset for customer
//             if (res.passwordResetRequired && role === "CUSTOMER") {
//                 navigate("/customer/reset-password");
//                 return;
//             }

//             // ✅ navigate using cleaned role variable
//             if (role === "SUPER_ADMIN") {
//                 navigate("/superadmin/dashboard");
//             } else if (role === "ADMIN") {
//                 navigate("/admin/dashboard");
//             } else if (role === "OFFICER") {
//                 navigate("/officer/dashboard");
//             } else if (role === "CUSTOMER") {
//                 navigate("/customer/dashboard");
//             } else {
//                 navigate("/");
//             }

//         } catch (err) {
//             console.error(err);
//             setError("Invalid email or password");
//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4 py-8">
//             <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg">

//                 <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
//                     Bank Management Login
//                 </h2>

//                 {error && (
//                     <p className="text-red-500 text-sm mb-3 text-center">
//                         {error}
//                     </p>
//                 )}

//                 <input
//                     type="text"
//                     placeholder="Enter the Email"
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="border p-2 w-full mb-3 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />

//                 <input
//                     type="password"
//                     placeholder="Enter the Password"
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="border p-2 w-full mb-3 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />

//                 <button
//                     onClick={handleLogin}
//                     disabled={!email || !password || isLoading}
//                     className="bg-amber-600 hover:bg-amber-700 transition text-white p-3 w-full rounded-lg font-semibold disabled:opacity-50"
//                 >
//                     {isLoading ? "Logging in..." : "Login"}
//                 </button>

//                 <p className="text-center text-sm text-gray-500 mt-4">
//                     New customer?{" "}
//                     <Link to="/register" className="text-amber-600 font-medium hover:underline">
//                         Create an account
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }


import { useState } from "react";
import { useLoginMutation } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../app/authSlice";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");

        try {
            const res = await login({ email, password }).unwrap();

            // clean role — remove ROLE_ prefix
            const role = res.role.replace("ROLE_", "");

            // ✅ dispatch only once — pass only what is needed
            dispatch(setCredentials({
                accessToken: res.accessToken,
                role: role,
                passwordResetRequired: res.passwordResetRequired,
                customerId: res.customerId,
            }));

            // force password reset for customer
            if (res.passwordResetRequired && role === "CUSTOMER") {
                navigate("/customer/reset-password");
                return;
            }

            // ✅ navigate using cleaned role variable
            if (role === "SUPER_ADMIN") {
                navigate("/superadmin/dashboard");
            } else if (role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (role === "OFFICER") {
                navigate("/officer/dashboard");
            } else if (role === "CUSTOMER") {
                navigate("/customer/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.error(err);
            setError("Invalid email or password");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4 py-8">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
                    Bank Management Login
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-3 text-center">
                        {error}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Enter the Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-3 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="relative mb-3">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter the Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full pr-10 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={!email || !password || isLoading}
                    className="bg-amber-600 hover:bg-amber-700 transition text-white p-3 w-full rounded-lg font-semibold disabled:opacity-50"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    New customer?{" "}
                    <Link to="/register" className="text-amber-600 font-medium hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}