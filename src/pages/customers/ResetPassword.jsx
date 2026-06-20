// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useResetPasswordMutation } from "../../api/authApi";
// import { logout } from "../../app/authSlice";
// import { useDispatch } from "react-redux";
// import { ArrowLeft } from "lucide-react";

// export default function ResetPassword() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [resetPassword, { isLoading }] = useResetPasswordMutation();

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const validatePassword = (password) => {
//     const strongPasswordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
//     return strongPasswordRegex.test(password);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!validatePassword(newPassword)) {
//       setError(
//         "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
//       );
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       const res = await resetPassword({ newPassword }).unwrap();
//       setSuccess(res?.message || "Password updated successfully!");
//       setTimeout(() => {
//         dispatch(logout());
//         navigate("/login");
//       }, 1500);
//     } catch (err) {
//       console.error("RESET ERROR:", err);
//       setError(
//         err?.data?.error || err?.data || "Failed to reset password."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">

//       {/* Back button */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => navigate(-1)}
//           className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
//         >
//           <ArrowLeft size={15} /> Back
//         </button>
//       </div>

//       {/* Centered card */}
//       <div className="flex justify-center">
//         <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

//           {/* Header */}
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Reset Your Password
//           </h2>
//           <p className="text-gray-500 text-sm mb-6">
//             For security reasons, you must change your temporary password.
//           </p>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm">
//               {success}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* New Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                 placeholder="Enter new password"
//                 required
//               />
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                 placeholder="Confirm new password"
//                 required
//               />
//             </div>

//             {/* Password Rules */}
//             <div className="text-xs text-gray-500">
//               Password must contain:
//               <ul className="list-disc ml-5 mt-1 space-y-1">
//                 <li>At least 8 characters</li>
//                 <li>One uppercase letter</li>
//                 <li>One lowercase letter</li>
//                 <li>One number</li>
//                 <li>One special character</li>
//               </ul>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
//             >
//               {isLoading ? "Updating..." : "Update Password"}
//             </button>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../api/authApi";
import { logout } from "../../app/authSlice";
import { useDispatch } from "react-redux";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await resetPassword({ newPassword }).unwrap();
      setSuccess(res?.message || "Password updated successfully!");
      setTimeout(() => {
        dispatch(logout());
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("RESET ERROR:", err);
      setError(
        err?.data?.error || err?.data || "Failed to reset password."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Back button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      {/* Centered card */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            For security reasons, you must change your temporary password.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Rules */}
            <div className="text-xs text-gray-500">
              Password must contain:
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}