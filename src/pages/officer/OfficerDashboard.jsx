import { Link } from "react-router-dom";
import { Users, UserCheck, FileClock, AlertTriangle, PlusCircle, ClipboardList } from "lucide-react";
import { useGetCustomersQuery } from "../../api/officerCustomerApi";
import { useRoleTheme } from "../../hooks/useRoleTheme";

function StatCard({ title, value, icon: Icon, gradient, sub }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white`}>
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

export default function OfficerDashboard() {
    const theme = useRoleTheme();

    const {
        data: customers = [],
        isLoading,
        isError,
    } = useGetCustomersQuery();

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.active === true).length;
    const kycPending = customers.filter((c) => c.kycStatus === "PENDING").length;

    const stats = [
        {
            title: "Total Customers",
            value: isLoading ? "—" : totalCustomers,
            icon: Users,
            gradient: "from-indigo-500 to-indigo-600",
        },
        {
            title: "Active Customers",
            value: isLoading ? "—" : activeCustomers,
            icon: UserCheck,
            gradient: "from-emerald-500 to-teal-500",
            sub: isLoading ? undefined : `${totalCustomers - activeCustomers} inactive`,
        },
        {
            title: "KYC Pending",
            value: isLoading ? "—" : kycPending,
            icon: FileClock,
            gradient: "from-amber-500 to-orange-500",
        },
    ];

    if (isLoading) {
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
            <div>
                <h2 className={`text-2xl font-bold tracking-tight ${theme.textColor}`}>
                    Officer Dashboard
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                    Welcome back — here's what's happening today.
                </p>
            </div>

            {/* Error banner */}
            {isError && <ErrorBanner message="Couldn't load customer data. Please check the customer service." />}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* KYC Pending Quick View */}
            {!isError && kycPending > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                            <FileClock size={16} />
                            {kycPending} customer{kycPending > 1 ? "s" : ""} with pending KYC
                        </h3>
                        <p className="text-xs text-amber-600 mt-1">
                            Review and verify customer KYC documents.
                        </p>
                    </div>

                    <Link
                        to="/officer/customers"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Review now →
                    </Link>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/officer/create-customer"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
                    >
                        <PlusCircle size={16} />
                        Create Customer
                    </Link>

                    <Link
                        to="/officer/customers"
                        className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition text-sm font-medium"
                    >
                        <ClipboardList size={16} />
                        View Customers
                    </Link>

                    <Link to="/officer/tickets"
                        className="inline-flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5
               rounded-xl hover:bg-rose-700 transition text-sm font-medium">
                        Support Tickets
                    </Link>
                </div>
            </div>

            {/* Empty state */}
            {!isError && totalCustomers === 0 && (
                <div className="text-center text-sm text-gray-400 py-10 bg-white rounded-2xl border border-gray-100">
                    No customers yet. Use "Create Customer" to add your first one.
                </div>
            )}

        </div>
    );
}