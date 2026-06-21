import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import {
    useGetAllCustomersAdminQuery,
    useVerifyKycMutation,
} from "../../api/adminApi";

function KycPill({ status }) {
    const map = {
        PENDING:  "bg-yellow-100 text-yellow-700",
        VERIFIED: "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status}
        </span>
    );
}

function KycActionButtons({ c, loadingId, handleKyc }) {
    return (
        <div className="flex flex-wrap gap-2">
            {c.kycStatus !== "VERIFIED" && (
                <button
                    disabled={loadingId === `${c.customerId}-VERIFIED`}
                    onClick={() => handleKyc(c.customerId, "VERIFIED")}
                    className="bg-green-100 text-green-700 hover:bg-green-200
                               px-3 py-1 rounded-lg text-xs font-medium
                               transition disabled:opacity-50">
                    ✓ Verify
                </button>
            )}
            {c.kycStatus !== "REJECTED" && (
                <button
                    disabled={loadingId === `${c.customerId}-REJECTED`}
                    onClick={() => handleKyc(c.customerId, "REJECTED")}
                    className="bg-red-100 text-red-700 hover:bg-red-200
                               px-3 py-1 rounded-lg text-xs font-medium
                               transition disabled:opacity-50">
                    ✗ Reject
                </button>
            )}
            {c.kycStatus !== "PENDING" && (
                <button
                    disabled={loadingId === `${c.customerId}-PENDING`}
                    onClick={() => handleKyc(c.customerId, "PENDING")}
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200
                               px-3 py-1 rounded-lg text-xs font-medium
                               transition disabled:opacity-50">
                    Reset
                </button>
            )}
        </div>
    );
}

export default function AdminKycVerification() {
    const navigate = useNavigate();
    const { data: customers = [], isLoading, isError, refetch } = useGetAllCustomersAdminQuery();
    const [verifyKyc] = useVerifyKycMutation();
    const [loadingId, setLoadingId] = useState(null);
    const [search, setSearch] = useState("");

    const handleKyc = async (customerId, status) => {
        setLoadingId(`${customerId}-${status}`);
        try {
            await verifyKyc({ customerId, status }).unwrap();
        } catch (err) {
            alert(err?.data?.message || "Failed to update KYC");
        }
        setLoadingId(null);
    };

    // Filter by search
    const filtered = customers.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.email} ${c.customerNumber}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // Stats
    const pending  = customers.filter((c) => c.kycStatus === "PENDING").length;
    const verified = customers.filter((c) => c.kycStatus === "VERIFIED").length;
    const rejected = customers.filter((c) => c.kycStatus === "REJECTED").length;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">KYC Verification</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Verify or reject customer KYC documents
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={refetch}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400
                                   hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400
                                   hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                        <ArrowLeft size={14} /> Back
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600">{pending}</p>
                    <p className="text-xs text-yellow-500 mt-1">Pending</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{verified}</p>
                    <p className="text-xs text-green-500 mt-1">Verified</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-red-600">{rejected}</p>
                    <p className="text-xs text-red-500 mt-1">Rejected</p>
                </div>
            </div>

            {/* Info banner */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100
                            text-blue-700 rounded-xl px-4 py-3 text-sm">
                <ShieldCheck size={16} className="flex-shrink-0" />
                <span>Verify Aadhaar, PAN and address proof before approving KYC.</span>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search by name, email or customer number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center h-40 items-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-indigo-500
                                    rounded-full animate-spin" />
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="bg-red-50 text-red-700 border border-red-100
                                rounded-xl px-4 py-3 text-sm">
                    Failed to load customers.
                    <button onClick={refetch} className="underline ml-1">Try again</button>
                </div>
            )}

            {/* Mobile card list */}
            {!isLoading && filtered.length > 0 && (
                <div className="flex flex-col gap-3 md:hidden">
                    {filtered.map((c, index) => (
                        <div key={c.customerId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">#{index + 1} · {c.customerNumber}</span>
                                <KycPill status={c.kycStatus} />
                            </div>

                            <div>
                                <p className="font-medium text-gray-800">{c.firstName} {c.lastName}</p>
                                <p className="text-xs text-gray-500 break-all">{c.email}</p>
                            </div>

                            <div className="flex justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
                                <span>Aadhaar: <span className="font-mono">{c.aadhaarNumber || "—"}</span></span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>PAN: <span className="font-mono">{c.panNumber || "—"}</span></span>
                            </div>

                            <div className="pt-2 border-t border-gray-50">
                                <KycActionButtons c={c} loadingId={loadingId} handleKyc={handleKyc} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Desktop table */}
            {!isLoading && filtered.length > 0 && (
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Customer No</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Aadhaar</th>
                                <th className="px-4 py-3 text-left">PAN</th>
                                <th className="px-4 py-3 text-left">KYC Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((c, index) => (
                                <tr key={c.customerId}
                                    className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-4 py-3 text-gray-400 text-xs">{index + 1}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                        {c.customerNumber}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-700">
                                        {c.firstName} {c.lastName}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{c.email}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                                        {c.aadhaarNumber || "—"}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                                        {c.panNumber || "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <KycPill status={c.kycStatus} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <KycActionButtons c={c} loadingId={loadingId} handleKyc={handleKyc} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && filtered.length === 0 && !isError && (
                <p className="text-sm text-gray-400 text-center py-10">
                    No customers found.
                </p>
            )}
        </div>
    );
}