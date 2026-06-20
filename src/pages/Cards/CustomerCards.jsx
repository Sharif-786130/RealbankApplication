import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useGetCardsByCustomerQuery } from "../../api/cardApi";

function CardStatusPill({ status }) {
    const map = {
        ACTIVE:  "bg-green-100 text-green-700",
        BLOCKED: "bg-red-100 text-red-700",
        EXPIRED: "bg-gray-100 text-gray-600",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status}
        </span>
    );
}

export default function CustomerCards() {
    const navigate = useNavigate();
    const { customerId } = useSelector((state) => state.auth);
    const { data: cards = [], isLoading, isError } = useGetCardsByCustomerQuery(
        customerId, { skip: !customerId }
    );

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
                <h2 className="text-2xl font-bold text-gray-800">My Cards</h2>
                <p className="text-sm text-gray-400 mt-0.5">Your debit and credit cards</p>
            </div>

            {isLoading && (
                <div className="flex justify-center h-40 items-center">
                    <div className="w-7 h-7 border-2 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                </div>
            )}

            {isError && (
                <p className="text-sm text-red-500">Failed to load cards.</p>
            )}

            {!isLoading && cards.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <CreditCard className="mx-auto text-gray-300 mb-3" size={40} />
                    <p className="text-gray-500 font-medium">No cards issued yet.</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Visit your branch officer to request a debit card.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cards.map((card) => (
                    <div key={card.cardId}
                        className="bg-gradient-to-br from-indigo-600 to-blue-700
                                   rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">

                        {/* Background pattern */}
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full
                                        bg-white/5 -translate-y-10 translate-x-10" />
                        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full
                                        bg-white/5 translate-y-10 -translate-x-10" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <CreditCard size={28} className="text-white/80" />
                                <CardStatusPill status={card.status} />
                            </div>

                            <p className="text-xl font-bold tracking-widest mb-1">
                                {card.cardNumber}
                            </p>

                            <div className="flex justify-between items-end mt-6">
                                <div>
                                    <p className="text-xs text-white/60 uppercase tracking-wide">
                                        Card Type
                                    </p>
                                    <p className="font-semibold">{card.cardType}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-white/60 uppercase tracking-wide">
                                        Expires
                                    </p>
                                    <p className="font-semibold">
                                        {card.expiryDate
                                            ? new Date(card.expiryDate).toLocaleDateString("en-IN", {
                                                month: "2-digit", year: "numeric"
                                              })
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}