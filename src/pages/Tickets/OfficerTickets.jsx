import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useGetOpenTicketsQuery, useResolveTicketMutation } from "../../api/ticketApi";

export default function OfficerTickets() {
    const navigate = useNavigate();
    const {
        data: ticketResponse,
        isLoading,
        isError,
        refetch
    } = useGetOpenTicketsQuery();

    const tickets = ticketResponse?.data || [];
    const [resolveTicket] = useResolveTicketMutation();

    const [resolutions, setResolutions] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    const handleResolve = async (ticketId) => {
        const resolution = resolutions[ticketId] || "Issue resolved by officer";
        setLoadingId(ticketId);
        try {
            await resolveTicket({ ticketId, resolution }).unwrap();
            setSuccessMsg(`Ticket #${ticketId} resolved!`);
            refetch();
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            alert(err?.data?.message || "Failed to resolve ticket");
        }
        setLoadingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Support Tickets</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Open tickets from customers</p>
                </div>
                <div className="flex gap-3">
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

            {successMsg && (
                <div className="bg-green-50 text-green-700 border border-green-100
                                rounded-xl px-4 py-3 text-sm font-medium">
                    ✅ {successMsg}
                </div>
            )}

            {isLoading && (
                <div className="flex justify-center h-40 items-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-teal-500
                                    rounded-full animate-spin" />
                </div>
            )}

            {!isLoading && tickets.length === 0 && !isError && (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <p className="text-gray-400 text-sm">🎉 No open tickets! All resolved.</p>
                </div>
            )}

            <div className="space-y-4">
                {tickets.map((t) => (
                    <div key={t.ticketId}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-semibold text-gray-800">{t.subject}</p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                    {t.ticketNumber} — {t.customerName}
                                </p>
                            </div>
                            <span className="px-2 py-1 rounded-full text-xs font-medium
                                             bg-yellow-100 text-yellow-700">
                                OPEN
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl p-3">
                            {t.description}
                        </p>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Enter resolution note..."
                                value={resolutions[t.ticketId] || ""}
                                onChange={(e) => setResolutions((p) => ({
                                    ...p, [t.ticketId]: e.target.value
                                }))}
                                className="flex-1 border border-gray-200 rounded-xl px-3 py-2
                                           text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                            <button
                                disabled={loadingId === t.ticketId}
                                onClick={() => handleResolve(t.ticketId)}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2
                                           rounded-xl text-sm font-medium transition disabled:opacity-50">
                                {loadingId === t.ticketId ? "Resolving..." : "✓ Resolve"}
                            </button>
                        </div>

                        <p className="text-xs text-gray-300 mt-2">
                            Raised: {t.createdAt
                                ? new Date(t.createdAt).toLocaleDateString("en-IN")
                                : "—"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}