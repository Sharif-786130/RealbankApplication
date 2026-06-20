import { useSelector } from "react-redux";
import { AlertTriangle, Wallet, CreditCard, Building2, ArrowLeft } from "lucide-react";
import { useGetAccountByCustomerQuery } from "../../api/accountApi";
import { useNavigate } from "react-router-dom";

// ── reusable status pill matching your app's style ──
function StatusPill({ status }) {
    const map = {
        ACTIVE: "bg-green-100 text-green-700",
        FROZEN: "bg-blue-100 text-blue-700",
        CLOSED: "bg-red-100 text-red-700",
        PENDING: "bg-yellow-100 text-yellow-700",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status ?? "—"}
        </span>
    );
}

// ── summary card same pattern as CustomerDashboard ──
function SummaryCard({ title, value, sub, icon: Icon, color }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gray-50 ${color}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}

export default function CustomerAccounts() {
    const { customerId } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const {
        data: accounts = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAccountByCustomerQuery(customerId, { skip: !customerId });

    // ── no session ──
    if (!customerId) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="mx-auto text-red-500 mb-2" size={28} />
                    <p className="text-red-600 font-medium">Session expired</p>
                    <p className="text-sm text-gray-400 mt-1">Please log in again.</p>
                </div>
            </div>
        );
    }

    // ── loading ──
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                    <p className="text-sm">Loading accounts…</p>
                </div>
            </div>
        );
    }

    // ── error ──
    if (isError) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <AlertTriangle size={16} />
                    <span>{error?.data?.message || "Failed to load accounts."}</span>
                </div>
                <button
                    onClick={refetch}
                    className="text-sm text-teal-600 underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    const safeAccounts = Array.isArray(accounts) ? accounts : [];
    const totalBalance = safeAccounts.reduce(
        (sum, acc) => sum + Number(acc.balance || 0), 0
    );
    const activeCount = safeAccounts.filter((a) => a.status === "ACTIVE").length;

    return (
        <div className="space-y-8">
            <div className="w-full flex justify-end mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 
                   hover:text-gray-700 hover:bg-gray-100 
                   px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                    <ArrowLeft size={15} />
                    Back
                </button>
            </div>

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                    My Accounts
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                    View all your bank accounts and balances
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SummaryCard
                    title="Total Balance"
                    value={`₹${totalBalance.toLocaleString("en-IN")}`}
                    sub={`Across ${safeAccounts.length} account(s)`}
                    icon={Wallet}
                    color="text-teal-600"
                />
                <SummaryCard
                    title="Active Accounts"
                    value={activeCount}
                    sub={`${safeAccounts.length - activeCount} inactive / frozen`}
                    icon={CreditCard}
                    color="text-blue-600"
                />
                <SummaryCard
                    title="Total Accounts"
                    value={safeAccounts.length}
                    sub="All account types"
                    icon={Building2}
                    color="text-amber-600"
                />
            </div>

            {/* Accounts details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Account Details
                </h3>

                {safeAccounts.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard className="mx-auto text-gray-300 mb-3" size={40} />
                        <p className="text-gray-400 text-sm">No accounts found.</p>
                        <p className="text-gray-300 text-xs mt-1">
                            Contact your branch officer to open an account.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile card list */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {safeAccounts.map((acc, index) => (
                                <div key={acc.accountId} className="border border-gray-100 rounded-xl p-4 space-y-2">
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
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{acc.accountType} · {acc.branchName || "—"}</span>
                                        <span className="font-mono text-gray-400">{acc.ifscCode || "—"}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 pt-1 border-t border-gray-50">
                                        Opened: {acc.createdAt
                                            ? new Date(acc.createdAt).toLocaleDateString("en-IN")
                                            : "—"}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                        <th className="pb-3 text-left font-medium">#</th>
                                        <th className="pb-3 text-left font-medium">Account Number</th>
                                        <th className="pb-3 text-left font-medium">Type</th>
                                        <th className="pb-3 text-left font-medium">Balance</th>
                                        <th className="pb-3 text-left font-medium">Status</th>
                                        <th className="pb-3 text-left font-medium">Branch</th>
                                        <th className="pb-3 text-left font-medium">IFSC</th>
                                        <th className="pb-3 text-left font-medium">Opened On</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {safeAccounts.map((acc, index) => (
                                        <tr
                                            key={acc.accountId}
                                            className="hover:bg-gray-50/60 transition-colors"
                                        >
                                            <td className="py-3 text-gray-400 text-xs">{index + 1}</td>
                                            <td className="py-3 font-mono text-xs text-gray-500">
                                                {acc.accountNumber}
                                            </td>
                                            <td className="py-3 text-gray-700">{acc.accountType}</td>
                                            <td className="py-3 font-semibold text-teal-600">
                                                ₹{Number(acc.balance || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td className="py-3">
                                                <StatusPill status={acc.status} />
                                            </td>
                                            <td className="py-3 text-gray-500">{acc.branchName || "—"}</td>
                                            <td className="py-3 font-mono text-xs text-gray-400">
                                                {acc.ifscCode || "—"}
                                            </td>
                                            <td className="py-3 text-xs text-gray-400">
                                                {acc.createdAt
                                                    ? new Date(acc.createdAt).toLocaleDateString("en-IN")
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}