import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateAccountMutation } from "../../api/accountApi"; // ✅ RTK Query
import { ArrowLeft } from "lucide-react";

export default function CreateAccount() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [createAccount, { isLoading }] = useCreateAccountMutation(); // ✅ replaces fetch()

    const [form, setForm] = useState({
        customerId: id || "",
        accountType: "SAVINGS",
        initialDeposit: "",
        branchName: "",
        ifscCode: "",
    });

    const [message, setMessage]   = useState("");
    const [success, setSuccess]   = useState(false);

    const handleCreate = async () => {
        if (!form.customerId || !form.initialDeposit || !form.branchName || !form.ifscCode) {
            setMessage("Please fill all fields");
            setSuccess(false);
            return;
        }

        try {
            const data = await createAccount({  // ✅ no token needed — RTK handles it
                customerId:     Number(form.customerId),
                accountType:    form.accountType,
                initialDeposit: Number(form.initialDeposit),
                branchName:     form.branchName,
                ifscCode:       form.ifscCode,
            }).unwrap();

            setSuccess(true);
            setMessage(`✅ Account created! Number: ${data.accountNumber}`);
            setTimeout(() => navigate(-1), 2000);

        } catch (err) {
            setSuccess(false);
            setMessage("❌ " + (err?.data?.message || "Error creating account"));
        }
    };

    return (
        <div className="space-y-6">

            {/* Back button */}
            <div className="w-full flex justify-end">
                <button onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                    <ArrowLeft size={15} /> Back
                </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 flex justify-center">Open New Account</h1>

            <div className="flex justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 w-full max-w-lg">

                    {message && (
                        <p className={`text-sm font-medium p-3 rounded-lg ${success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {message}
                        </p>
                    )}

                    {/* Customer ID — readonly from URL */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Customer ID</label>
                        <input type="number" value={form.customerId} readOnly
                            className="border p-2 w-full rounded-lg bg-gray-100 text-gray-500 text-sm" />
                    </div>

                    {/* Account Type */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Account Type</label>
                        <select value={form.accountType}
                            onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400">
                            <option value="SAVINGS">Savings</option>
                            <option value="CURRENT">Current</option>
                        </select>
                    </div>

                    {/* Initial Deposit */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Initial Deposit (₹)</label>
                        <input type="number" placeholder="Minimum 500"
                            value={form.initialDeposit}
                            onChange={(e) => setForm({ ...form, initialDeposit: e.target.value })}
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>

                    {/* Branch Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Branch Name</label>
                        <input type="text" placeholder="e.g. Hyderabad Main Branch"
                            value={form.branchName}
                            onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>

                    {/* IFSC Code */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                        <input type="text" placeholder="e.g. BNK0001234"
                            value={form.ifscCode}
                            onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
                            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>

                    <button onClick={handleCreate} disabled={isLoading}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl w-full font-semibold disabled:opacity-50 transition">
                        {isLoading ? "Creating..." : "Open Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}