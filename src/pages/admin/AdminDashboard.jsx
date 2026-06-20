import {
    Users, UserCheck, FileText, CheckCircle2,
    XCircle, Clock, AlertCircle, Settings,
    ShieldCheck, UserCog,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRoleTheme } from "../../hooks/useRoleTheme";
import { useGetOfficerQuery } from "../../api/officerApi";
import { useGetAllLoansQuery } from "../../api/loanApi";

// ── Reusable StatCard — same as SuperAdminDashboard ──────────────────────────
function StatCard({ title, value, sub, icon: Icon, gradient, status }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider truncate">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-1 leading-none">
                        {value ?? <span className="text-gray-300 text-lg">—</span>}
                    </p>
                    {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white flex-shrink-0 ml-3`}>
                    <Icon size={20} />
                </div>
            </div>
            {status !== undefined && (
                <div className="mt-4 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                        style={{ width: `${Math.min(status, 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
}

// ── Action Card — same card style as StatCard ─────────────────────────────────
function ActionCard({ to, title, sub, icon: Icon, gradient, badge }) {
    return (
        <Link
            to={to}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5
                       hover:shadow-md transition-all duration-200 block"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Quick Action
                    </p>
                    <p className="text-base font-bold text-gray-800 mt-1">{title}</p>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        {sub}
                        {badge > 0 && (
                            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5
                                             rounded-full text-xs font-medium ml-1">
                                {badge}
                            </span>
                        )}
                    </p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                                 bg-gradient-to-br ${gradient} text-white flex-shrink-0 ml-3`}>
                    <Icon size={20} />
                </div>
            </div>
        </Link>
    );
}

// ── Status pill ───────────────────────────────────────────────────────────────
function LoanStatusPill({ status }) {
    const map = {
        APPROVED: { cls: "text-emerald-700 bg-emerald-50", icon: CheckCircle2 },
        PENDING: { cls: "text-amber-700 bg-amber-50", icon: Clock },
        REJECTED: { cls: "text-red-700 bg-red-50", icon: XCircle },
    };
    const { cls, icon: Icon } = map[status] ?? map.PENDING;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
            <Icon size={11} /> {status}
        </span>
    );
}

function HealthBadge({ ok, label }) {
    return ok ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={11} /> {label ?? "Active"}
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            <AlertCircle size={11} /> {label ?? "Inactive"}
        </span>
    );
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            <div className="p-4 sm:p-6">{children}</div>
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const theme = useRoleTheme();

    const { data: officers = [], isLoading: officersLoading, isError: officersError } = useGetOfficerQuery();
    const { data: loansResponse, isLoading: loansLoading, isError: loansError } = useGetAllLoansQuery();
    const loans = Array.isArray(loansResponse?.data) ? loansResponse.data :
        Array.isArray(loansResponse) ? loansResponse : [];

    const totalOfficers = officers.length;
    const activeOfficers = officers.filter((o) => o.active === true).length;
    const totalLoans = loans.length;
    const pendingLoans = loans.filter((l) => l.status === "PENDING").length;
    const approvedLoans = loans.filter((l) => l.status === "APPROVED").length;
    const rejectedLoans = loans.filter((l) => l.status === "REJECTED").length;

    const officerActivePct = totalOfficers ? Math.round((activeOfficers / totalOfficers) * 100) : 0;
    const loanApprovePct = totalLoans ? Math.round((approvedLoans / totalLoans) * 100) : 0;

    const stats = [
        {
            title: "Total Officers",
            value: officersLoading ? "—" : totalOfficers,
            sub: `${activeOfficers} active`,
            icon: Users,
            gradient: "from-indigo-500 to-indigo-600",
            status: officerActivePct,
        },
        {
            title: "Active Officers",
            value: officersLoading ? "—" : activeOfficers,
            sub: `${totalOfficers - activeOfficers} inactive`,
            icon: UserCheck,
            gradient: "from-emerald-500 to-teal-500",
            status: officerActivePct,
        },
        {
            title: "Total Loans",
            value: loansLoading ? "—" : totalLoans,
            sub: `${pendingLoans} pending review`,
            icon: FileText,
            gradient: "from-blue-500 to-blue-600",
            status: loanApprovePct,
        },
        {
            title: "Pending Loans",
            value: loansLoading ? "—" : pendingLoans,
            sub: "awaiting approval",
            icon: Clock,
            gradient: "from-amber-500 to-orange-500",
        },
        {
            title: "Approved Loans",
            value: loansLoading ? "—" : approvedLoans,
            sub: `${loanApprovePct}% approval rate`,
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-green-600",
            status: loanApprovePct,
        },
        {
            title: "Rejected Loans",
            value: loansLoading ? "—" : rejectedLoans,
            sub: "total rejected",
            icon: XCircle,
            gradient: "from-red-500 to-rose-600",
        },
    ];

    const actions = [
        {
            to: "/admin/accounts",
            title: "Manage Accounts",
            sub: "Freeze / block / activate",
            icon: Settings,
            gradient: "from-indigo-500 to-indigo-600",
        },
        {
            to: "/admin/kyc",
            title: "KYC Verification",
            sub: "Verify customer documents",
            icon: ShieldCheck,
            gradient: "from-sky-500 to-blue-600",
        },
        {
            to: "/admin/loan-approvals",
            title: "Loan Approvals",
            sub: "Review pending loans",
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-green-600",
            badge: pendingLoans,
        },
        {
            to: "/admin/officers",
            title: "Officer Management",
            sub: "View & manage officers",
            icon: UserCog,
            gradient: "from-amber-500 to-orange-500",
        },
    ];

    if (officersLoading && loansLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${theme.textColor}`}>
                        Admin Dashboard
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Real-time overview of officers and loan applications
                    </p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 self-start">
                    {new Date().toLocaleDateString("en-IN", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric",
                    })}
                </span>
            </div>

            {/* Stats Grid */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {stats.map((s, i) => <StatCard key={i} {...s} />)}
                </div>
            </div>

            {/* Quick Actions — same card style */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {actions.map((a, i) => <ActionCard key={i} {...a} />)}
                </div>
            </div>

            {/* Pending loans alert */}
            {!loansLoading && !loansError && pendingLoans > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5
                                flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                            <Clock size={16} />
                            {pendingLoans} loan{pendingLoans > 1 ? "s" : ""} awaiting approval
                        </h3>
                        <p className="text-xs text-amber-600 mt-1">
                            Review and approve pending loan applications.
                        </p>
                    </div>
                    <Link to="/admin/loan-approvals"
                        className="bg-amber-500 hover:bg-amber-600 text-white
                                   px-4 py-2 rounded-lg text-sm font-medium transition text-center">
                        Review now →
                    </Link>
                </div>
            )}

            {/* Two column lower section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Officers table */}
                <SectionCard
                    title="Officers"
                    subtitle={`${totalOfficers} total · ${activeOfficers} active`}
                >
                    {officersError ? (
                        <p className="text-sm text-red-500">Failed to load officers.</p>
                    ) : officers.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No officers found.</p>
                    ) : (
                        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                        <th className="pb-3 text-left font-medium">Name</th>
                                        <th className="pb-3 text-left font-medium">Email</th>
                                        <th className="pb-3 text-left font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {officers.slice(0, 5).map((o, idx) => (
                                        <tr key={o.id ?? idx} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="py-3 font-medium text-gray-700 whitespace-nowrap">{o.name}</td>
                                            <td className="py-3 text-gray-400 text-xs">{o.email}</td>
                                            <td className="py-3">
                                                <HealthBadge
                                                    ok={o.active !== false}
                                                    label={o.active !== false ? "Active" : "Inactive"}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionCard>

                {/* Loans table */}
                <SectionCard
                    title="Loan Overview"
                    subtitle="Status breakdown across all loans"
                >
                    {loansError ? (
                        <p className="text-sm text-red-500">Failed to load loans.</p>
                    ) : loans.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No loans found.</p>
                    ) : (
                        <>
                            {/* Summary pills */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {["APPROVED", "PENDING", "REJECTED"].map((s) => (
                                    <div key={s} className="flex items-center gap-1.5 text-xs text-gray-500
                                                             bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                                        <LoanStatusPill status={s} />
                                        <span className="font-semibold text-gray-700">
                                            {loans.filter((l) => l.status === s).length}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                            <th className="pb-3 text-left font-medium">Loan No</th>
                                            <th className="pb-3 text-left font-medium">Amount</th>
                                            <th className="pb-3 text-left font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loans.slice(0, 5).map((loan, idx) => (
                                            <tr key={loan.loanId ?? idx} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                                                    {loan.loanNumber ?? `#${loan.loanId}`}
                                                </td>
                                                <td className="py-3 font-medium text-gray-700 whitespace-nowrap">
                                                    {loan.loanAmount
                                                        ? `₹${Number(loan.loanAmount).toLocaleString("en-IN")}`
                                                        : "—"}
                                                </td>
                                                <td className="py-3">
                                                    <LoanStatusPill status={loan.status ?? "PENDING"} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </SectionCard>

            </div>
        </div>
    );
}