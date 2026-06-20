import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateLoanPage() {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        customerId: "",
        loanType: "HOME_LOAN",
        loanAmount: "",
        tenureMonths: "",
        intrestRate: ""
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/loans", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    customerId: Number(form.customerId),
                    loanType: form.loanType,
                    loanAmount: Number(form.loanAmount),
                    tenureMonths: Number(form.tenureMonths),
                    intrestRate: Number(form.intrestRate)
                })
            });
            if (res.ok) {
                setMessage("✅ Loan created successfully!");
                setTimeout(() => navigate("/officer/loans"), 1500);
            } else {
                setMessage("❌ Error creating loan");
            }
        } catch (err) {
            setMessage("❌ Error: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            
            <h1 className="text-2xl font-bold">Create New Loan</h1>

            <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-lg">

                {message && (
                    <p className="font-medium text-sm">{message}</p>
                )}

                <input type="number" placeholder="Customer ID"
                    value={form.customerId}
                    onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                    className="border p-2 w-full rounded-lg" />

                <select value={form.loanType}
                    onChange={(e) => setForm({ ...form, loanType: e.target.value })}
                    className="border p-2 w-full rounded-lg">
                    <option value="HOME_LOAN">Home Loan</option>
                    <option value="PERSONAL_LOAN">Personal Loan</option>
                    <option value="AUTO_LOAN">Auto Loan</option>
                    <option value="BUSINESS_LOAN">Business Loan</option>
                </select>

                <input type="number" placeholder="Loan Amount"
                    value={form.loanAmount}
                    onChange={(e) => setForm({ ...form, loanAmount: e.target.value })}
                    className="border p-2 w-full rounded-lg" />

                <input type="number" placeholder="Tenure in Months"
                    value={form.tenureMonths}
                    onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })}
                    className="border p-2 w-full rounded-lg" />

                <input type="number" placeholder="Interest Rate (e.g. 8.5)"
                    value={form.intrestRate}
                    onChange={(e) => setForm({ ...form, intrestRate: e.target.value })}
                    className="border p-2 w-full rounded-lg" />

                <button onClick={handleCreate} disabled={loading}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg w-full">
                    {loading ? "Creating..." : "Create Loan"}
                </button>
            </div>
        </div>
    );
}