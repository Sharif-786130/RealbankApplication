import { useEffect, useState } from "react";
import { useCreateOfficerMutation } from "../../api/officerApi"; // ✅ fixed path
import { Eye, EyeOff } from "lucide-react";

export default function CreateOfficer() {
    const [createdOfficerId, setCreatedOfficerId] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [createOfficer, { isLoading }] = useCreateOfficerMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createOfficer(form).unwrap();
            setCreatedOfficerId(res.employeeId);
            setSuccessMessage(res.message || "Officer Created Successfully");
            setForm({ name: "", email: "", phone: "", password: "", role: "" });

            setTimeout(() => {  // ✅ fixed typo (was setTomeout)
                setCreatedOfficerId("");
                setSuccessMessage("");
            }, 5000);

        } catch (err) {
            console.error(err);
            alert(err?.data?.message || "Error creating Officer");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 sm:p-6 pt-8 sm:pt-12">

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Create New Officer
                </h2>

                {createdOfficerId && (
                    <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700 border border-green-300">
                        <p className="font-semibold">{successMessage}</p>
                        <p>Officer ID: <span className="font-bold">{createdOfficerId}</span></p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                            <input name="name" value={form.name} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                            <input name="phone" value={form.phone} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Temporary Password</label>
                            <div className="relative">
                                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                            <input name="role" value={form.role} onChange={handleChange} placeholder="OFFICER" required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                    </div>

                    <div className="text-center pt-4">
                        <button type="submit" disabled={isLoading}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition font-medium disabled:opacity-50">
                            {isLoading ? "Creating..." : "Create Officer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}