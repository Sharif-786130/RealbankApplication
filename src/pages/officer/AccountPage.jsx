import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {

    const [accounts, setAccounts] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const fetchAccounts = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/account", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setAccounts(data);
        setLoaded(true);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Account Management</h1>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">All Accounts</h2>
                    <button onClick={fetchAccounts}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm">
                        Load Accounts
                    </button>
                </div>

                {loaded && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border">
                            <thead className="bg-teal-50">
                                <tr>
                                    <th className="p-2 border">Account ID</th>
                                    <th className="p-2 border">Account Number</th>
                                    <th className="p-2 border">Type</th>
                                    <th className="p-2 border">Balance</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border">Branch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((acc) => (
                                    <tr key={acc.accountId} className="hover:bg-gray-50">
                                        <td className="p-2 border">{acc.accountId}</td>
                                        <td className="p-2 border">{acc.accountNumber}</td>
                                        <td className="p-2 border">{acc.accountType}</td>
                                        <td className="p-2 border">₹{acc.balance}</td>
                                        <td className="p-2 border">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                ${acc.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                                                  acc.status === "FROZEN" ? "bg-blue-100 text-blue-700" :
                                                  "bg-red-100 text-red-700"}`}>
                                                {acc.status}
                                            </span>
                                        </td>
                                        <td className="p-2 border">{acc.branchName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}