
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOfficerCustomerMutation } from "../../api/officerCustomerApi";
import Input from "../../components/forms/Input";
// import { Input } from "../../components/forms/Input";
// import React, { useState }  from "react";

export default function CreateCustomer() {
  const navigate = useNavigate();
  const [createCustomer, { isLoading }] =
    useCreateOfficerCustomerMutation();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dateofBirth:"",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    aadhaarNumber: "",
    panNumber: "",
    active: true
  });

const handleChange = (e) => {
    const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
};

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      gender:"",
      dateofBirth:"",
      email: "",
      mobileNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      aadhaarNumber: "",
      panNumber: "",
      active: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createCustomer(formData).unwrap();
      setSuccessMessage(
        "Customer created successfully. Temporary password sent to email."
      );
      resetForm();

      setTimeout(() => {
        navigate("/officer/customers");
      }, 2000);

    } catch (err) {
      
      setErrorMessage(
        err?.data?.message ||
          "Failed to create customer. Please try again."
      );
    }
  };



  return (
<div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 sm:p-6 pt-8 sm:pt-12">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create New Customer
        </h2>

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
              <select name="gender" value={formData.gender} onChange={handleChange} className="input" >
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
              <Input label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />

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
              <Input label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} />
            </div>

            <div>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={(e) => 
                  setFormData((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }
                />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Customer"}
            </button>
          </div>

        </form>
      </div>
      </div>
      );
    }