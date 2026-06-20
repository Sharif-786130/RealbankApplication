import { useEffect, useState } from "react";
import {
    useCreateOfficerMutation,
    useUpdateOfficerMutation
} from "../../api/officerApi";

export default function OfficerForm({ selectedOfficer, setSelectedOfficer }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [generateId, setGeneratedId] = useState("");

    const [createOfficer, { isLoading: isCreating }] = useCreateOfficerMutation();
    const [updateOfficer, { isLoading: isUpdating }] = useUpdateOfficerMutation();


    useEffect(() => {
        if (selectedOfficer) {
            setName(selectedOfficer.name);
            setEmail(selectedOfficer.email);
            setPhone(selectedOfficer.phone);
            setRole(selectedOfficer.role);
            setPassword("");
        }
    }, [selectedOfficer]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (selectedOfficer) {
                await updateOfficer({
                    id: selectedOfficer.id,
                    email,
                    name,
                    phone,
                    role: "OFFICER",
                    ...(password && { password })
                }).unwrap();

            } else {

               const res =  await createOfficer({
                    name,
                    email,
                    password,
                    phone,
                    role: "OFFICER"
                }).unwrap();

                setGeneratedId(res.employeeId);
            }

            // Reset form
            setEmail("");
            setPassword("");
            setName("");
            setPhone("");
            setRole("");
            setSelectedOfficer(null);

        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
                {selectedOfficer ? "Update Officer" : "Create Officer"}
            </h2>

{
    generateId && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            Officer Created Successfully <br />
            Officer ID: <strong>{generateId}</strong>
        </div>
    )
}
            <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter officer name"
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
                            {selectedOfficer ? "New Password (Optional)" : "Password"}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter password"
                        />
                    </div>

                    {/* Role */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Role
                        </label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="OFFICER"
                        />
                    </div>

                </div>


                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">

                    {selectedOfficer && (
                        <button
                            type="button"
                            onClick={() => setSelectedOfficer(null)}
                            className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl
                                   font-medium transition disabled:opacity-50"
                    >
                        {isCreating || isUpdating
                            ? "Saving..."
                            : selectedOfficer
                                ? "Update Officer"
                                : "Create Officer"}
                    </button>

                </div>

            </form>
        </div>
    );
}
