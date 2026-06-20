import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useGetAllAccountsQuery } from "../../api/accountApi";

function StatusPill({ status }) {
    const map = {
        ACTIVE:  "bg-green-100 text-green-700",
        FROZEN:  "bg-blue-100 text-blue-700",
        BLOCKED: "bg-red-100 text-red-700",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status}
        </span>
    );
}

export default function AccountList() {
    const navigate = useNavigate();

    const {
        data: accounts = [],
        isLoading,
        isError,
        refetch,
    } = useGetAllAccountsQuery();

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">All Accounts</h1>
                    <p className="text-sm text-gray-400 mt-0.5">View all customer bank accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={refetch}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                        <ArrowLeft size={14} /> Back
                    </button>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center h-40">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3 text-sm">
                    Failed to load accounts. <button onClick={refetch} className="underline ml-1">Try again</button>
                </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && accounts.length === 0 && (
                <p className="text-gray-400 text-sm">No accounts found.</p>
            )}

            {/* Mobile card list */}
            {!isLoading && accounts.length > 0 && (
                <div className="flex flex-col gap-3 md:hidden">
                    {accounts.map((acc, index) => (
                        <div key={acc.accountId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">#{index + 1}</span>
                                <StatusPill status={acc.status} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs text-gray-500">{acc.accountNumber}</span>
                                <span className="font-semibold text-teal-600 text-sm">
                                    ₹{Number(acc.balance || 0).toLocaleString("en-IN")}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
                                <span>{acc.accountType} · {acc.branchName}</span>
                                <span className="font-mono text-gray-400">{acc.ifscCode}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Desktop table */}
            {!isLoading && accounts.length > 0 && (
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Account Number</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Balance</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Branch</th>
                                <th className="px-4 py-3 text-left">IFSC</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {accounts.map((acc, index) => (
                                <tr key={acc.accountId} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-4 py-3 text-gray-400 text-xs">{index + 1}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{acc.accountNumber}</td>
                                    <td className="px-4 py-3 text-gray-700">{acc.accountType}</td>
                                    <td className="px-4 py-3 font-semibold text-teal-600">
                                        ₹{Number(acc.balance || 0).toLocaleString("en-IN")}
                                    </td>
                                    <td className="px-4 py-3"><StatusPill status={acc.status} /></td>
                                    <td className="px-4 py-3 text-gray-500">{acc.branchName}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{acc.ifscCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}