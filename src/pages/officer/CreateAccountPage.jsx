import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAccountPage() {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        customerId: "",
        accountType: "SAVINGS",
        initialDeposit: "",
        branchName: "",
        ifscCode: ""
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/account/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    customerId: Number(form.customerId),
                    accountType: form.accountType,
                    initialDeposit: Number(form.initialDeposit),
                    branchName: form.branchName,
                    ifscCode: form.ifscCode
                })
            });
            if (res.ok) {
                setMessage("✅ Account created successfully!");
                setTimeout(() => navigate("/officer/account"), 1500);
            } else {
                setMessage("❌ Error creating account");
            }
        } catch (err) {
            setMessage("❌ Error: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Open New Account</h1>

            <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-lg">

                {message && (
                    <p className="font-medium text-sm">{message}</p>
                )}

                <input type="number" placeholder="Customer ID"
                    value={form.customerId}
                    onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                    className="border p-2 w-full rounded-lg" />

                <select value={form.accountType}
                    onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                    className="border p-2 w-full rounded-lg">
                    <option value="SAVINGS">Savings</option>
                    <option value="CURRENT">Current</option>
                </select>

                <input type="number" placeholder="Initial Deposit"
                    value={form.initialDeposit}
                    onChange={(e) => setForm({ ...form, initialDeposit: e.target.value })}
                    className="border p-2 w-full rounded-lg" />

                <input type="text" placeholder="Branch Name"
                    value={form.branchName}
                    onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                    className="border p-2 w-full rounded-lg" />

                <input type="text" placeholder="IFSC Code"
                    value={form.ifscCode}
                    onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
                    className="border p-2 w-full rounded-lg" />

                <button onClick={handleCreate} disabled={loading}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg w-full">
                    {loading ? "Creating..." : "Open Account"}
                </button>
            </div>
        </div>
    );
}