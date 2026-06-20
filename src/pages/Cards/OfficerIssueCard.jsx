import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAccountByCustomerQuery } from "../../api/accountApi";
import { useIssueCardMutation } from "../../api/cardApi";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function OfficerIssueCard() {
    const { id } = useParams(); // customerId
    const navigate = useNavigate();

    const { data: accounts = [] } = useGetAccountByCustomerQuery(id, { skip: !id });
    const [issueCard, { isLoading }] = useIssueCardMutation();

    const [form, setForm] = useState({ accountId: "", cardType: "DEBIT" });
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const activeAccounts = accounts.filter((a) => a.status === "ACTIVE");

    const handleSubmit = async () => {
        if (!form.accountId) {
            setMessage("Please select an account.");
            setSuccess(false);
            return;
        }
        try {
            const res = await issueCard({
                accountId: Number(form.accountId),
                customerId: Number(id),
                cardType: form.cardType,
            }).unwrap();

            setSuccess(true);
            setMessage(`✅ ${res.message} — Card: ${res.cardNumber}`);
        } catch (err) {
            setSuccess(false);
            setMessage("❌ " + (err?.data?.message || "Failed to issue card."));
        }
    };

    return (


        <div className="space-y-6">
            {/* Back Button */}
            <div className="w-full flex justify-end">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400
                       hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
                >
                    <ArrowLeft size={15} />
                    Back
                </button>
            </div>



            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Issue Debit Card
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                    Issue a new card for customer account
                </p>
            </div>

            {/* <div className="max-w-md flex justify-center">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"> */}

                <div className="flex justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5 w-full max-w-md">

                    {message && (
                        <div className={`text-sm p-3 rounded-xl font-medium ${success
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Select Account
                        </label>
                        <select
                            value={form.accountId}
                            onChange={(e) => setForm((p) => ({ ...p, accountId: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-indigo-400">
                            <option value="">Select account</option>
                            {activeAccounts.map((acc) => (
                                <option key={acc.accountId} value={acc.accountId}>
                                    {acc.accountType} — {acc.accountNumber}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Card Type</label>
                        <select
                            value={form.cardType}
                            onChange={(e) => setForm((p) => ({ ...p, cardType: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-indigo-400">
                            <option value="DEBIT">DEBIT</option>
                            <option value="CREDIT">CREDIT</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white
                                   py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50">
                        {isLoading ? "Issuing..." : "Issue Card"}
                    </button>
                </div>
            </div>
        </div>

    );
}

