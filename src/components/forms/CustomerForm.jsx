
import React from "react";

const CustomerForm = ({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  buttonText = "Submit",
}) => {
  return (
    <div className="card shadow-lg p-4">
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <h5 className="mb-3">Personal Details</h5>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              className="form-control"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Address Section */}
        <h5 className="mt-4 mb-3">Address Details</h5>

        <div className="mb-3">
          <label className="form-label">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            className="form-control"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            className="form-control"
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              className="form-control"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              className="form-control"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              name="pincode"
              className="form-control"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            name="country"
            className="form-control"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        {/* KYC Section */}
        <h5 className="mt-4 mb-3">KYC Details</h5>

        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label">Aadhaar Number</label>
            <input
              type="text"
              name="aadhaarNumber"
              className="form-control"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">PAN Number</label>
            <input
              type="text"
              name="panNumber"
              className="form-control"
              value={formData.panNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary px-5"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;