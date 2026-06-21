import { useState } from "react";

export default function LoanPage() {

    const [form, setForm] = useState({
        customerId: "",
        loanType: "HOME_LOAN",
        loanAmount: "",
        tenureMonths: "",
        intrestRate: ""
    });
    const [message, setMessage] = useState("");

    const handleCreate = async () => {
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
                setMessage("Loan created successfully!");
                setForm({
                    customerId: "", loanType: "HOME_LOAN",
                    loanAmount: "", tenureMonths: "", intrestRate: ""
                });
            } else {
                setMessage("Error creating loan");
            }
        } catch (err) {
            setMessage("Error: " + err.message);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Loan Management</h1>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="text-lg font-semibold">All Loans</h2>
                <LoanList />
            </div>
        </div>
    );
}

function LoanList() {
    const [loans, setLoans] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const fetchLoans = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/loans`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setLoans(data);
        setLoaded(true);
    };

    if (!loaded) {
        return (
            <button onClick={fetchLoans}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg">
                Load Loans
            </button>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border">
                <thead className="bg-teal-50">
                    <tr>
                        <th className="p-2 border">Loan ID</th>
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Tenure</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map((loan) => (
                        <tr key={loan.loanId} className="hover:bg-gray-50">
                            <td className="p-2 border">{loan.loanId}</td>
                            <td className="p-2 border">{loan.loanType}</td>
                            <td className="p-2 border">{loan.loanAmount}</td>
                            <td className="p-2 border">{loan.loanStatus}</td>
                            <td className="p-2 border">{loan.tenureMonths} months</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}