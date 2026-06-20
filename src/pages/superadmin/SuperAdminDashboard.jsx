import { useGetAdminsQuery } from "../../api/adminApi";
import { useGetAllAccountsQuery } from "../../api/accountApi";
import { useGetAllLoansQuery } from "../../api/loanApi";
import { useGetAllOfficersSuperAdminQuery } from "../../api/officerApi";
import { useGetAllCustomersSuperAdminQuery } from "../../api/officerCustomerApi";
import { useRoleTheme } from "../../hooks/useRoleTheme";
import {
    Users,
    UserCheck,
    ShieldCheck,
    Landmark,
    CreditCard,
    ArrowRightLeft,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
} from "lucide-react";

// ─── Small helpers ────────────────────────────────────────────────────────────

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
                    {sub && (
                        <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
                    )}
                </div>
                <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white flex-shrink-0 ml-3`}
                >
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

function HealthBadge({ ok, label }) {
    return ok ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={11} /> {label ?? "Healthy"}
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            <AlertCircle size={11} /> {label ?? "Check"}
        </span>
    );
}

function LoanStatusPill({ status }) {
    const map = {
        APPROVED: { cls: "text-emerald-700 bg-emerald-50", icon: CheckCircle2 },
        VERIFIED: { cls: "text-blue-700 bg-blue-50", icon: CheckCircle2 },
        PENDING: { cls: "text-amber-700 bg-amber-50", icon: Clock },
        REJECTED: { cls: "text-red-700 bg-red-50", icon: XCircle },
        CLOSED: { cls: "text-gray-700 bg-gray-100", icon: CheckCircle2 },
    };
    const { cls, icon: Icon } = map[status] ?? map.PENDING;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
            <Icon size={11} /> {status}
        </span>
    );
}

function SectionCard({ title, subtitle, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
        </div>
    );
}

// ─── System Health Row ────────────────────────────────────────────────────────

function SystemHealthPanel({ admins, accounts, loans, officers, customers }) {
    const services = [
        {
            name: "Admin Service",
            ok: !admins.isError,
            loading: admins.isLoading,
            detail: admins.isError ? "Unreachable" : `${admins.data?.length ?? 0} admins loaded`,
        },
        {
            name: "Account Service",
            ok: !accounts.isError,
            loading: accounts.isLoading,
            detail: accounts.isError ? "Unreachable" : `${accounts.data?.length ?? 0} accounts loaded`,
        },
        {
            name: "Loan Service",
            ok: !loans.isError,
            loading: loans.isLoading,
            detail: loans.isError ? "Unreachable" : `${loans.data?.length ?? 0} loans loaded`,
        },
        {
            name: "Officer Service",
            ok: !officers.isError,
            loading: officers.isLoading,
            detail: officers.isError ? "Unreachable" : `${officers.data?.length ?? 0} officers loaded`,
        },
        {
            name: "Customer Service",
            ok: !customers.isError,
            loading: customers.isLoading,
            detail: customers.isError ? "Unreachable" : `${customers.data?.length ?? 0} customers loaded`,
        },
    ];

    const healthyCount = services.filter((s) => s.ok).length;

    return (
        <SectionCard
            title="System Health"
            subtitle={`${healthyCount} / ${services.length} services operational`}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {services.map((svc) => (
                    <div
                        key={svc.name}
                        className={`rounded-xl border p-4 flex flex-col gap-2 transition-colors
                            ${svc.ok ? "border-emerald-100 bg-emerald-50/40" : "border-red-100 bg-red-50/40"}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">{svc.name}</span>
                            {svc.loading ? (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                    <Clock size={11} className="animate-spin" /> …
                                </span>
                            ) : (
                                <HealthBadge ok={svc.ok} label={svc.ok ? "OK" : "Error"} />
                            )}
                        </div>
                        <p className="text-xs text-gray-400 leading-tight">{svc.detail}</p>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}

// ─── Mobile row card helper (generic, used by 4 sections below) ──────────────

function MobileRow({ children }) {
    return (
        <div className="border border-gray-100 rounded-xl p-4 space-y-1.5">
            {children}
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function SuperAdminDashboard() {
    const theme = useRoleTheme();

    const adminsQ = useGetAdminsQuery();
    const accountsQ = useGetAllAccountsQuery();
    const loansQ = useGetAllLoansQuery();
    const officersQ = useGetAllOfficersSuperAdminQuery();
    const customersQ = useGetAllCustomersSuperAdminQuery();

    const admins = Array.isArray(adminsQ.data) ? adminsQ.data : [];
    const accounts = Array.isArray(accountsQ.data) ? accountsQ.data : [];
    const loans = Array.isArray(loansQ.data?.data) ? loansQ.data.data :
        Array.isArray(loansQ.data) ? loansQ.data : [];
    const officers = Array.isArray(officersQ.data) ? officersQ.data : [];
    const customers = Array.isArray(customersQ.data) ? customersQ.data : [];

    const activeAdmins = admins.filter((a) => a.active === true).length;
    const activeAccounts = accounts.filter((a) => a.status === "ACTIVE" || a.active === true).length;
    const pendingLoans = loans.filter((l) => l.status === "PENDING").length;
    const approvedLoans = loans.filter((l) => l.status === "APPROVED").length;
    const activeOfficers = officers.filter((o) => o.active !== false).length;

    // Derived health %
    const adminActivePct = admins.length ? Math.round((activeAdmins / admins.length) * 100) : 0;
    const accountActivePct = accounts.length ? Math.round((activeAccounts / accounts.length) * 100) : 0;
    const loanApprovePct = loans.length ? Math.round((approvedLoans / loans.length) * 100) : 0;

    const stats = [
        {
            title: "Total Admins",
            value: admins.length,
            sub: `${activeAdmins} active`,
            icon: ShieldCheck,
            gradient: "from-violet-500 to-violet-600",
            status: adminActivePct,
        },
        {
            title: "Bank Accounts",
            value: accounts.length,
            sub: `${activeAccounts} active`,
            icon: Landmark,
            gradient: "from-blue-500 to-blue-600",
            status: accountActivePct,
        },
        {
            title: "Total Loans",
            value: loans.length,
            sub: `${pendingLoans} pending review`,
            icon: CreditCard,
            gradient: "from-amber-500 to-orange-500",
            status: loanApprovePct,
        },
        {
            title: "Officers",
            value: officers.length,
            sub: `${activeOfficers} active`,
            icon: UserCheck,
            gradient: "from-emerald-500 to-teal-500",
            status: officers.length ? Math.round((activeOfficers / officers.length) * 100) : 0,
        },
        {
            title: "Customers",
            value: customers.length,
            sub: "registered users",
            icon: Users,
            gradient: "from-pink-500 to-rose-500",
        },
        {
            title: "Loan Approval Rate",
            value: loans.length ? `${loanApprovePct}%` : "—",
            sub: `${approvedLoans} approved of ${loans.length}`,
            icon: TrendingUp,
            gradient: "from-cyan-500 to-sky-500",
            status: loanApprovePct,
        },
    ];

    const isLoading =
        adminsQ.isLoading &&
        accountsQ.isLoading &&
        loansQ.isLoading &&
        officersQ.isLoading &&
        customersQ.isLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
                    <p className="text-sm">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${theme.textColor}`}>
                        Super Admin Dashboard
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Full system overview — admins, accounts, loans & customers
                    </p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 self-start">
                    {new Date().toLocaleDateString("en-IN", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric",
                    })}
                </span>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stats.map((s, i) => (
                    <StatCard key={i} {...s} />
                ))}
            </div>

            {/* ── System Health ── */}
            <SystemHealthPanel
                admins={adminsQ}
                accounts={accountsQ}
                loans={loansQ}
                officers={officersQ}
                customers={customersQ}
            />

            {/* ── Two-column lower section ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Admins */}
                <SectionCard
                    title="Recent Admins"
                    subtitle={`Showing latest ${Math.min(admins.length, 5)} of ${admins.length}`}
                >
                    {admins.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No admins found.</p>
                    ) : (
                        <>
                            {/* Mobile card list */}
                            <div className="flex flex-col gap-3 md:hidden">
                                {admins.slice(0, 5).map((admin, idx) => (
                                    <MobileRow key={admin.id ?? admin.userId ?? idx}>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700">{admin.name}</span>
                                            <HealthBadge
                                                ok={admin.active !== false}
                                                label={admin.active !== false ? "Active" : "Inactive"}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 break-all">{admin.email}</p>
                                    </MobileRow>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                            <th className="pb-3 text-left font-medium">Name</th>
                                            <th className="pb-3 text-left font-medium">Email</th>
                                            <th className="pb-3 text-left font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {admins.slice(0, 5).map((admin, idx) => (
                                            <tr key={admin.id ?? admin.userId ?? idx} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="py-3 font-medium text-gray-700">{admin.name}</td>
                                                <td className="py-3 text-gray-400 text-xs">{admin.email}</td>
                                                <td className="py-3">
                                                    <HealthBadge
                                                        ok={admin.active !== false}
                                                        label={admin.active !== false ? "Active" : "Inactive"}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </SectionCard>

                {/* Loan Overview */}
                <SectionCard
                    title="Loan Overview"
                    subtitle="Status breakdown across all loans"
                >
                    {loans.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No loans found.</p>
                    ) : (
                        <>
                            {/* Summary pills */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {["APPROVED", "PENDING", "REJECTED"].map((s) => {
                                    const count = loans.filter((l) => l.status === s).length;
                                    return (
                                        <div key={s} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                                            <LoanStatusPill status={s} />
                                            <span className="font-semibold text-gray-700">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile card list */}
                            <div className="flex flex-col gap-3 md:hidden">
                                {loans.slice(0, 5).map((loan, idx) => {
                                    const loanIdValue = loan.loanId ?? loan.id;
                                    const amountValue = loan.loanAmount ?? loan.amount;
                                    return (
                                        <MobileRow key={loanIdValue ?? idx}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-mono text-xs text-gray-500">
                                                    {loanIdValue != null ? `#${String(loanIdValue).slice(0, 8)}` : "—"}
                                                </span>
                                                <LoanStatusPill status={loan.status ?? "PENDING"} />
                                            </div>
                                            <p className="font-medium text-gray-700 text-sm">
                                                {amountValue != null
                                                    ? `₹${Number(amountValue).toLocaleString("en-IN")}`
                                                    : "—"}
                                            </p>
                                        </MobileRow>
                                    );
                                })}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                            <th className="pb-3 text-left font-medium">Loan ID</th>
                                            <th className="pb-3 text-left font-medium">Amount</th>
                                            <th className="pb-3 text-left font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loans.slice(0, 5).map((loan, idx) => {
                                            const loanIdValue = loan.loanId ?? loan.id;
                                            const amountValue = loan.loanAmount ?? loan.amount;
                                            return (
                                                <tr key={loanIdValue ?? idx} className="hover:bg-gray-50/60 transition-colors">
                                                    <td className="py-3 font-mono text-xs text-gray-500">
                                                        {loanIdValue != null ? `#${String(loanIdValue).slice(0, 8)}` : "—"}
                                                    </td>
                                                    <td className="py-3 font-medium text-gray-700">
                                                        {amountValue != null
                                                            ? `₹${Number(amountValue).toLocaleString("en-IN")}`
                                                            : "—"}
                                                    </td>
                                                    <td className="py-3">
                                                        <LoanStatusPill status={loan.status ?? "PENDING"} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </SectionCard>

                {/* Officers */}
                <SectionCard
                    title="Officers"
                    subtitle={`${officers.length} total · ${activeOfficers} active`}
                >
                    {officers.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No officers found.</p>
                    ) : (
                        <>
                            {/* Mobile card list */}
                            <div className="flex flex-col gap-3 md:hidden">
                                {officers.slice(0, 5).map((o, idx) => (
                                    <MobileRow key={o.id ?? o.userId ?? idx}>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700">{o.name}</span>
                                            <HealthBadge
                                                ok={o.active !== false}
                                                label={o.active !== false ? "Active" : "Inactive"}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 break-all">{o.email}</p>
                                    </MobileRow>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
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
                                            <tr key={o.id ?? o.userId ?? idx} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="py-3 font-medium text-gray-700">{o.name}</td>
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
                        </>
                    )}
                </SectionCard>

                {/* Recent Customers */}
                <SectionCard
                    title="Recent Customers"
                    subtitle={`Showing latest ${Math.min(customers.length, 5)} of ${customers.length}`}
                >
                    {customers.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No customers found.</p>
                    ) : (
                        <>
                            {/* Mobile card list */}
                            <div className="flex flex-col gap-3 md:hidden">
                                {customers.slice(0, 5).map((c, idx) => (
                                    <MobileRow key={c.customerId ?? c.id ?? idx}>
                                        <p className="font-medium text-gray-700">{c.name}</p>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span className="break-all">{c.email}</span>
                                            <span>{c.mobileNumber ?? "—"}</span>
                                        </div>
                                    </MobileRow>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                            <th className="pb-3 text-left font-medium">Name</th>
                                            <th className="pb-3 text-left font-medium">Email</th>
                                            <th className="pb-3 text-left font-medium">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {customers.slice(0, 5).map((c, idx) => (
                                            <tr key={c.customerId ?? c.id ?? idx} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="py-3 font-medium text-gray-700">{c.name}</td>
                                                <td className="py-3 text-gray-400 text-xs">{c.email}</td>
                                                <td className="py-3 text-gray-400 text-xs">{c.mobileNumber ?? "—"}</td>
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