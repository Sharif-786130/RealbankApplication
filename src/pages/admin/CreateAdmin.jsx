import { useState } from "react";
import { useCreateAdminMutation } from "../../api/adminApi"; // ✅ correct import

export default function CreateAdmin() {
    const [createAdmin, { isLoading }] = useCreateAdminMutation(); // ✅ correct hook usage

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => { // ✅ was completely missing
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => { // ✅ was completely missing
        setSuccessMessage("");
        setErrorMessage("");
        try {
            await createAdmin(form).unwrap();
            setSuccessMessage("Admin created successfully!");
            setForm({ name: "", email: "", phone: "", password: "" });
        } catch (err) {
            setErrorMessage(err?.data?.message || "Error creating Admin");
        }
    };

    return (
<div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 sm:p-6 pt-8 sm:pt-12">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Create New Admin
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

                <div className="space-y-4">
                    {["name", "email", "phone", "password"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                                {field}
                            </label>
                            <input
                                name={field}
                                placeholder={`Enter ${field}`}
                                type={field === "password" ? "password" : "text"}
                                value={form[field]}
                                onChange={handleChange} // ✅ now exists
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit} // ✅ now exists
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium disabled:opacity-50">
                        {isLoading ? "Creating..." : "Create Admin"}
                    </button>
                </div>
            </div>
        </div>
    );
}