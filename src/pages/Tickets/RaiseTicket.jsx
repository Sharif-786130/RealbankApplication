import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Ticket } from "lucide-react";
import { useRaiseTicketMutation, useGetMyTicketsQuery } from "../../api/ticketApi";

const SUBJECTS = [
    "Account related issue",
    "Card blocked or lost",
    "Transaction dispute",
    "Loan query",
    "KYC verification issue",
    "Password reset issue",
    "Other",
];

function TicketStatusPill({ status }) {
    const map = {
        OPEN: "bg-yellow-100 text-yellow-700",
        IN_PROGRESS: "bg-blue-100 text-blue-700",
        RESOLVED: "bg-green-100 text-green-700",
        CLOSED: "bg-gray-100 text-gray-600",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status?.replace("_", " ")}
        </span>
    );
}

export default function RaiseTicket() {
    const navigate = useNavigate();
    const { customerId } = useSelector((state) => state.auth);

    const [raiseTicket, { isLoading }] = useRaiseTicketMutation();
    // const { data: myTickets = [], refetch } = useGetMyTicketsQuery(
    //     customerId, { skip: !customerId }
    // );

    const { data, refetch } = useGetMyTicketsQuery(
        customerId,
        { skip: !customerId }
    );

    const myTickets = Array.isArray(data)
        ? data
        : data?.data || [];

    const [form, setForm] = useState({ subject: "", description: "", customerId });
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!form.subject || !form.description) {
            setMessage("Please fill subject and description.");
            setSuccess(false);
            return;
        }
        try {
            const res = await raiseTicket(form).unwrap();
            setSuccess(true);
            setMessage(`✅ ${res.message} — Ticket: ${res.ticketNumber}`);
            setForm({ subject: "", description: "", customerId });
            refetch();
        } catch (err) {
            setSuccess(false);
            setMessage("❌ " + (err?.data?.message || "Failed to raise ticket."));
        }
    };

    return (
        <div className="space-y-6">
            <div className="w-full flex justify-end">
                <button onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400
                               hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                    <ArrowLeft size={15} /> Back
                </button>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800">Support Tickets</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                    Raise an issue — our officers will resolve it shortly
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Raise ticket form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700">Raise New Ticket</h3>

                    {message && (
                        <div className={`text-sm p-3 rounded-xl font-medium ${success
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Subject</label>
                        <select
                            value={form.subject}
                            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-teal-400">
                            <option value="">Select issue type</option>
                            {SUBJECTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={4}
                            placeholder="Describe your issue in detail..."
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white
                                   py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50">
                        {isLoading ? "Submitting..." : "Submit Ticket"}
                    </button>
                </div>

                {/* My tickets list */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">My Tickets</h3>
                    {myTickets.length === 0 ? (
                        <div className="text-center py-8">
                            <Ticket className="mx-auto text-gray-300 mb-2" size={32} />
                            <p className="text-sm text-gray-400">No tickets yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myTickets.map((t) => (
                                <div key={t.ticketId}
                                    className="border border-gray-100 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm font-medium text-gray-700">
                                            {t.subject}
                                        </p>
                                        <TicketStatusPill status={t.status} />
                                    </div>
                                    <p className="text-xs text-gray-400 font-mono">
                                        {t.ticketNumber}
                                    </p>
                                    {t.resolution && (
                                        <p className="text-xs text-green-600 mt-2 bg-green-50
                                                       px-2 py-1 rounded-lg">
                                            Resolution: {t.resolution}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-300 mt-1">
                                        {t.createdAt
                                            ? new Date(t.createdAt).toLocaleDateString("en-IN")
                                            : "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}