import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, FileText, ArrowRightLeft, Send, KeyRound, AlertTriangle, PlusCircle, CreditCard, Ticket } from "lucide-react";
import { useGetAccountByCustomerQuery } from "../../api/accountApi";
import { useGetLoanByCustomerQuery } from "../../api/loanApi";
import { useGetTransactionsByCustomerQuery } from "../../api/transactionApi";


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

function ErrorBanner({ message }) {
    return (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertTriangle size={16} />
            <span>{message}</span>
        </div>
    );
}

function StatusPill({ status }) {
    const map = {
        ACTIVE: "bg-green-100 text-green-700",
        APPROVED: "bg-green-100 text-green-700",
        SUCCESS: "bg-green-100 text-green-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        REJECTED: "bg-red-100 text-red-700",
        FAILED: "bg-red-100 text-red-700",
        INACTIVE: "bg-red-100 text-red-700",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status ?? "—"}
        </span>
    );
}

export default function CustomerDashboard() {
    const { customerId } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const {
        data: accounts = [],
        isLoading: accountsLoading,
        isError: accountsError,
    } = useGetAccountByCustomerQuery(customerId, { skip: !customerId });

    const {
        data: loanResponse,
        isLoading: loansLoading,
        isError: loansError,
    } = useGetLoanByCustomerQuery(customerId, { skip: !customerId });

    const {
        data: transactionResponse,
        isLoading: txnLoading,
        isError: txnError,
    } = useGetTransactionsByCustomerQuery(customerId, { skip: !customerId });

    if (!customerId) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="mx-auto text-red-500 mb-2" size={28} />
                    <p className="text-red-600 font-medium">Session expired</p>
                    <p className="text-sm text-gray-400 mt-1">Please log in again to continue.</p>
                </div>
            </div>
        );
    }

    if (accountsLoading || loansLoading || txnLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                    <p className="text-sm">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    const safeAccounts = Array.isArray(accounts) ? accounts : [];
    const safeLoans = Array.isArray(loanResponse?.data) ? loanResponse.data : [];
    const safeTransactions = Array.isArray(transactionResponse?.data) ? transactionResponse.data : [];

    const totalBalance = safeAccounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
    const activeLoans = safeLoans.filter((l) => l.status === "PENDING" || l.status === "APPROVED");
    const recentTransactions = safeTransactions.slice(0, 5);

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-800">My Dashboard</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                    Overview of your accounts, loans and recent activity
                </p>
            </div>

            {/* Error banners */}
            {accountsError && <ErrorBanner message="Couldn't load account data. Please try again later." />}
            {loansError && <ErrorBanner message="Couldn't load loan data. Please try again later." />}
            {txnError && <ErrorBanner message="Couldn't load transaction data. Please try again later." />}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SummaryCard
                    title="Total Balance"
                    value={accountsError ? "—" : `₹${totalBalance.toLocaleString("en-IN")}`}
                    sub={accountsError ? undefined : `Across ${safeAccounts.length} account(s)`}
                    icon={Wallet}
                    color="text-teal-600"
                />
                <SummaryCard
                    title="Active Loans"
                    value={loansError ? "—" : activeLoans.length}
                    sub={loansError ? undefined : `${safeLoans.length} total loan(s)`}
                    icon={FileText}
                    color="text-blue-600"
                />
                <SummaryCard
                    title="Transactions"
                    value={txnError ? "—" : safeTransactions.length}
                    sub={txnError ? undefined : "Total transactions"}
                    icon={ArrowRightLeft}
                    color="text-amber-600"
                />
            </div>

            {/* Quick Actions — 2-col grid on mobile, 3-col on md+ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { to: "/customer/transfer",       icon: Send,        label: "Transfer Money",  bg: "bg-teal-600   hover:bg-teal-700"   },
                        { to: "/customer/reset-password", icon: KeyRound,    label: "Reset Password",  bg: "bg-amber-600  hover:bg-amber-700"  },
                        { to: "/customer/accounts",       icon: Wallet,      label: "My Accounts",     bg: "bg-blue-600   hover:bg-blue-700"   },
                        { to: "/customer/loans",          icon: FileText,    label: "My Loans",        bg: "bg-indigo-600 hover:bg-indigo-700" },
                        { to: "/customer/cards",          icon: CreditCard,  label: "My Cards",        bg: "bg-violet-600 hover:bg-violet-700" },
                        { to: "/customer/support",        icon: Ticket,      label: "Support",         bg: "bg-rose-600   hover:bg-rose-700"   },
                    ].map(({ to, icon: Icon, label, bg }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`inline-flex items-center justify-center gap-2 ${bg} text-white px-3 py-3 rounded-xl transition text-sm font-medium`}
                        >
                            <Icon size={16} className="shrink-0" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Accounts — card list on mobile, table on md+ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">My Accounts</h3>
                {accountsError ? (
                    <p className="text-sm text-red-500">Unable to load accounts.</p>
                ) : safeAccounts.length === 0 ? (
                    <p className="text-sm text-gray-400">No accounts found.</p>
                ) : (
                    <>
                        {/* Mobile card list */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {safeAccounts.map((acc) => (
                                <div key={acc.accountId} className="border border-gray-100 rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-xs text-gray-500">{acc.accountNumber}</span>
                                        <StatusPill status={acc.status} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">{acc.accountType} · {acc.branchName}</span>
                                        <span className="font-semibold text-teal-600 text-sm">
                                            ₹{Number(acc.balance || 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                        <th className="pb-3 text-left font-medium">Account Number</th>
                                        <th className="pb-3 text-left font-medium">Type</th>
                                        <th className="pb-3 text-left font-medium">Balance</th>
                                        <th className="pb-3 text-left font-medium">Status</th>
                                        <th className="pb-3 text-left font-medium">Branch</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {safeAccounts.map((acc) => (
                                        <tr key={acc.accountId} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="py-3 font-mono text-xs text-gray-500">{acc.accountNumber}</td>
                                            <td className="py-3 text-gray-700">{acc.accountType}</td>
                                            <td className="py-3 font-semibold text-teal-600">
                                                ₹{Number(acc.balance || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td className="py-3"><StatusPill status={acc.status} /></td>
                                            <td className="py-3 text-gray-500">{acc.branchName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Loans — card list on mobile, table on md+ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">My Loans</h3>
                    <Link
                        to="/customer/apply-loan"
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition text-sm font-medium"
                    >
                        <PlusCircle size={16} /> Apply Loan
                    </Link>
                </div>

                {loansError ? (
                    <p className="text-sm text-red-500">Unable to load loans.</p>
                ) : safeLoans.length === 0 ? (
                    <p className="text-sm text-gray-400">No loans found.</p>
                ) : (
                    <>
                        {/* Mobile card list */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {safeLoans.map((loan) => (
                                <div
                                    key={loan.loanId}
                                    className="border border-gray-100 rounded-xl p-4 space-y-2 cursor-pointer hover:bg-gray-50/60"
                                    onClick={() => navigate(`/customer/loans/${loan.loanId}`)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-xs text-gray-500">{loan.loanNumber}</span>
                                        <StatusPill status={loan.status} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">{loan.loanType} · {loan.tenureMonths}m</span>
                                        <span className="font-semibold text-gray-800 text-sm">
                                            ₹{Number(loan.loanAmount || 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                        <th className="pb-3 text-left font-medium">Loan Number</th>
                                        <th className="pb-3 text-left font-medium">Type</th>
                                        <th className="pb-3 text-left font-medium">Amount</th>
                                        <th className="pb-3 text-left font-medium">Status</th>
                                        <th className="pb-3 text-left font-medium">Tenure</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {safeLoans.map((loan) => (
                                        <tr
                                            key={loan.loanId}
                                            className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/customer/loans/${loan.loanId}`)}
                                        >
                                            <td className="py-3 font-mono text-xs text-gray-500">{loan.loanNumber}</td>
                                            <td className="py-3 text-gray-700">{loan.loanType}</td>
                                            <td className="py-3 font-semibold text-gray-800">
                                                ₹{Number(loan.loanAmount || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td className="py-3"><StatusPill status={loan.status} /></td>
                                            <td className="py-3 text-gray-500">{loan.tenureMonths} months</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Recent Transactions — card list on mobile, table on md+ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Transactions</h3>
                {txnError ? (
                    <p className="text-sm text-red-500">Unable to load transactions.</p>
                ) : recentTransactions.length === 0 ? (
                    <p className="text-sm text-gray-400">No transactions found.</p>
                ) : (
                    <>
                        {/* Mobile card list */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {recentTransactions.map((txn) => (
                                <div key={txn.transactionId} className="border border-gray-100 rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-xs text-gray-500">{txn.transactionNumber}</span>
                                        <StatusPill status={txn.status} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            txn.type === "DEPOSIT" || txn.type === "TRANSFER_CREDIT"
                                                ? "bg-green-100 text-green-700"
                                                : txn.type === "WITHDRAW" || txn.type === "TRANSFER_DEBIT"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-blue-100 text-blue-700"
                                        }`}>{txn.type}</span>
                                        <span className="font-semibold text-gray-800 text-sm">
                                            ₹{Number(txn.amount || 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>After: ₹{Number(txn.balanceAfter || 0).toLocaleString("en-IN")}</span>
                                        <span>{txn.createdAt ? new Date(txn.createdAt).toLocaleDateString("en-IN") : "—"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                        <th className="pb-3 text-left font-medium">Txn Number</th>
                                        <th className="pb-3 text-left font-medium">Type</th>
                                        <th className="pb-3 text-left font-medium">Amount</th>
                                        <th className="pb-3 text-left font-medium">Balance After</th>
                                        <th className="pb-3 text-left font-medium">Status</th>
                                        <th className="pb-3 text-left font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentTransactions.map((txn) => (
                                        <tr key={txn.transactionId} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="py-3 font-mono text-xs text-gray-500">{txn.transactionNumber}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    txn.type === "DEPOSIT" || txn.type === "TRANSFER_CREDIT"
                                                        ? "bg-green-100 text-green-700"
                                                        : txn.type === "WITHDRAW" || txn.type === "TRANSFER_DEBIT"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-blue-100 text-blue-700"
                                                }`}>{txn.type}</span>
                                            </td>
                                            <td className="py-3 font-semibold text-gray-800">
                                                ₹{Number(txn.amount || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td className="py-3 text-gray-500">
                                                ₹{Number(txn.balanceAfter || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td className="py-3"><StatusPill status={txn.status} /></td>
                                            <td className="py-3 text-xs text-gray-400">
                                                {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString("en-IN") : "—"}
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