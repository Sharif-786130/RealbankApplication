import { useState } from "react";
import { useCreateAdminMutation } from "../../api/adminApi";

export default function AdminForm({ selectedAdmin, setSelectedAdmin }) {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [createAdmin, { isLoading }] = useCreateAdminMutation();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");

        try {

            await createAdmin({
                name,
                email,
                phone,
                password
            }).unwrap();

            // Reset
            setEmail("");
            setName("");
            setPassword("");
            setPhone("");

        } catch (err) {
            setErrorMessage(
                err?.data?.message || "Limited Admins are Accepted"
            );
        }
    };


    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

            <h3 className="text-xl font-bold text-gray-800 mb-6">
                Create Admin
            </h3>

            {errorMessage && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Admin Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter admin name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter email"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Phone
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter mobile number"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter password"
                        />
                    </div>

                </div>


                {/* Button */}
                <div className="flex justify-end pt-4">

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600
                                   hover:from-indigo-700 hover:to-purple-700
                                   text-white px-6 py-2 rounded-xl font-medium
                                   shadow-md transition disabled:opacity-50"
                    >
                        {isLoading ? "Creating..." : "Create Admin"}
                    </button>

                </div>

            </form>
        </div>
    );
}