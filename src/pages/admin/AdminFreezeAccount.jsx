import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";
import { useGetAllAccountsAdminQuery, useUpdateAccountStatusMutation } from "../../api/adminApi";

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

function ActionButtons({ acc, loadingId, handleStatusChange }) {
    return (
        <div className="flex flex-wrap gap-2">
            {acc.status !== "ACTIVE" && (
                <button
                    disabled={loadingId === acc.accountId}
                    onClick={() => handleStatusChange(acc.accountId, "ACTIVE")}
                    className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50">
                    Activate
                </button>
            )}
            {acc.status !== "FROZEN" && (
                <button
                    disabled={loadingId === acc.accountId}
                    onClick={() => handleStatusChange(acc.accountId, "FROZEN")}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50">
                    Freeze
                </button>
            )}
            {acc.status !== "BLOCKED" && (
                <button
                    disabled={loadingId === acc.accountId}
                    onClick={() => handleStatusChange(acc.accountId, "BLOCKED")}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50">
                    Block
                </button>
            )}
        </div>
    );
}

export default function AdminFreezeAccount() {
    const navigate = useNavigate();
    const { data: accounts = [], isLoading, isError, refetch } = useGetAllAccountsAdminQuery();
    const [updateStatus] = useUpdateAccountStatusMutation();
    const [loadingId, setLoadingId] = useState(null); // tracks which row is updating

    const handleStatusChange = async (accountId, newStatus) => {
        setLoadingId(accountId);
        try {
            await updateStatus({ accountId, status: newStatus }).unwrap();
        } catch (err) {
            alert(err?.data?.message || "Failed to update status");
        }
        setLoadingId(null);
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Accounts</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Freeze, activate or block customer accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={refetch}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                        <ArrowLeft size={14} /> Back
                    </button>
                </div>
            </div>

            {/* Warning banner */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl px-4 py-3 text-sm">
                <ShieldAlert size={16} className="flex-shrink-0" />
                <span>Freezing an account blocks all transactions. Only activate when verified.</span>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center h-40 items-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3 text-sm">
                    Failed to load accounts. <button onClick={refetch} className="underline ml-1">Try again</button>
                </div>
            )}

            {/* Mobile card list */}
            {!isLoading && accounts.length > 0 && (
                <div className="flex flex-col gap-3 md:hidden">
                    {accounts.map((acc, index) => (
                        <div key={acc.accountId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
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
                            <div className="text-xs text-gray-500">
                                {acc.accountType} · {acc.branchName}
                            </div>
                            <div className="pt-2 border-t border-gray-50">
                                <ActionButtons acc={acc} loadingId={loadingId} handleStatusChange={handleStatusChange} />
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
                                <th className="px-4 py-3 text-left">Branch</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
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
                                    <td className="px-4 py-3 text-gray-500">{acc.branchName}</td>
                                    <td className="px-4 py-3"><StatusPill status={acc.status} /></td>
                                    <td className="px-4 py-3">
                                        <ActionButtons acc={acc} loadingId={loadingId} handleStatusChange={handleStatusChange} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}