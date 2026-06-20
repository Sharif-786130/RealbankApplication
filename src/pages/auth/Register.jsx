import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../../api/authApi";
import Input from "../../components/forms/Input";

export default function Register() {
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        dateofBirth: "",
        mobileNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        aadhaarNumber: "",
        panNumber: "",

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    //   const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setErrorMessage("");
    //     setSuccessMessage("");

    //     if (formData.password !== formData.confirmPassword) {
    //       setErrorMessage("Passwords do not match.");
    //       return;
    //     }

    //     try {
    //       await register(formData).unwrap();
    //       setSuccessMessage("Account created! Redirecting you to verify your email...");

    //       setTimeout(() => {
    //         navigate("/verify-otp", { state: { email: formData.email } });
    //       }, 1200);

    //     } catch (err) {
    //       setErrorMessage(
    //         err?.data?.error || err?.data?.message || "Registration failed. Please try again."
    //       );
    //     }
    //   };
    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await register(formData).unwrap();
      setSuccessMessage("Account created! Redirecting you to verify your email...");

      setTimeout(() => {
        navigate("/verify-otp", { state: { email: formData.email } });
      }, 1200);

    } catch (err) {
      setErrorMessage(
        err?.data?.error || err?.data?.message || "Registration failed. Please try again."
      );
    }
  };

    return (
        <div className="min-h-screen bg-amber-50 flex items-start justify-center p-4 sm:p-6 pt-8 sm:pt-12">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    Create Your Account
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-amber-600 font-medium hover:underline">
                        Log in
                    </Link>
                </p>

                {successMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                            <Input label="Date of Birth" type="date" name="dateofBirth" value={formData.dateofBirth} onChange={handleChange} />
                            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                            <Input label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Address Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Address Details
                        </h3>
                        <div className="space-y-6">
                            <Input label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} />
                            <Input label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} optional />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input label="City" name="city" value={formData.city} onChange={handleChange} />
                                <Input label="State" name="state" value={formData.state} onChange={handleChange} />
                                <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                            </div>
                            <Input label="Country" name="country" value={formData.country} onChange={handleChange} />
                        </div>
                    </div>

                    {/* KYC Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            KYC Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} />
                            <Input label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} optional />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Your KYC details will be reviewed and verified by our team after signup.
                            A temporary password will be emailed to you — you'll be asked to set a new one on first login.
                        </p>
                    </div>

                    {/* Security */}
                    {/* <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Set a Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
              <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div> */}

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-amber-600 text-white px-8 py-3 rounded-xl hover:bg-amber-700 transition font-medium disabled:opacity-50"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}