import { useState, useEffect } from "react"; // ← add useEffect
import { useNavigate, useParams } from "react-router-dom";
import { useDepositMutation, useGetAccountByCustomerQuery, useWithdrawMutation } from "../../api/accountApi";
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle } from "lucide-react";

export default function OfficerTeller() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: accounts = [], isLoading } = useGetAccountByCustomerQuery(id);
    const [deposit, { isLoading: depositing }] = useDepositMutation();
    const [withdraw, { isLoading: withdrawing }] = useWithdrawMutation();

    const [tab, setTab] = useState("deposit");
    const [selectedAccount, setSelectedAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const activeAccounts = accounts.filter((a) => a.status === "ACTIVE");

    // ✅ Auto-select if customer has only one active account
    useEffect(() => {
        if (activeAccounts.length === 1) {
            setSelectedAccount(String(activeAccounts[0].accountId));
        }
    }, [activeAccounts.length]);

    const handleSubmit = async () => {
        setMessage("");
        if (!selectedAccount || !amount) {
            setMessage("Please select an account and enter amount.");
            setSuccess(false);
            return;
        }
        if (Number(amount) <= 0) {
            setMessage("Amount must be greater than 0.");
            setSuccess(false);
            return;
        }

        try {
            const fn = tab === "deposit" ? deposit : withdraw;
            const res = await fn({
                accountId: Number(selectedAccount),
                amount: Number(amount),
                description: description || (tab === "deposit" ? "Cash Deposit" : "Cash Withdrawal"),
            }).unwrap();

            setSuccess(true);
            setMessage(`✅ ${res.message} — New Balance: ₹${Number(res.newBalance).toLocaleString("en-IN")}`);
            setAmount("");
            setDescription("");

        } catch (err) {
            setSuccess(false);
            setMessage("❌ " + (err?.data?.message || "Transaction failed."));
        }
    };

   return (
    <div className="min-h-screen bg-gray-50 p-6">
        {/* Back Button */}
        <div className="w-full flex justify-end mb-6">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500
                           hover:text-gray-700 hover:bg-gray-100
                           px-3 py-1.5 rounded-lg transition-all duration-200"
            >
                <ArrowLeft size={15} />
                Back
            </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
                Teller Operations
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                Process cash deposit or withdrawal for customer
            </p>
        </div>

        {/* Centered Form Card */}
        <div className="flex justify-center">
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

                    {/* Tab Switcher */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => {
                                setTab("deposit");
                                setMessage("");
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                tab === "deposit"
                                    ? "bg-white text-green-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <ArrowDownCircle size={16} />
                            Deposit
                        </button>

                        <button
                            onClick={() => {
                                setTab("withdraw");
                                setMessage("");
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                                tab === "withdraw"
                                    ? "bg-white text-red-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <ArrowUpCircle size={16} />
                            Withdraw
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <div
                            className={`text-sm p-3 rounded-xl font-medium ${
                                success
                                    ? "bg-green-50 text-green-700 border border-green-100"
                                    : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    {/* Account Selector */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Account{" "}
                            {activeAccounts.length === 1 && (
                                <span className="text-xs text-green-600 font-normal">
                                    (Auto-selected)
                                </span>
                            )}
                        </label>

                        {isLoading ? (
                            <p className="text-sm text-gray-400">
                                Loading accounts...
                            </p>
                        ) : activeAccounts.length === 0 ? (
                            <p className="text-sm text-red-500">
                                No active accounts found for this customer.
                            </p>
                        ) : (
                            <select
                                value={selectedAccount}
                                onChange={(e) =>
                                    setSelectedAccount(e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                {activeAccounts.length > 1 && (
                                    <option value="">
                                        Select Account
                                    </option>
                                )}

                                {activeAccounts.map((acc) => (
                                    <option
                                        key={acc.accountId}
                                        value={acc.accountId}
                                    >
                                        {acc.accountType} Account —{" "}
                                        {acc.accountNumber} (
                                        ₹
                                        {Number(acc.balance).toLocaleString(
                                            "en-IN"
                                        )}
                                        )
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Amount (₹)
                        </label>

                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Description (Optional)
                        </label>

                        <input
                            type="text"
                            placeholder={
                                tab === "deposit"
                                    ? "Cash Deposit"
                                    : "Cash Withdrawal"
                            }
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={
                            depositing ||
                            withdrawing ||
                            !selectedAccount
                        }
                        className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition
                                   disabled:opacity-50 disabled:cursor-not-allowed ${
                                       tab === "deposit"
                                           ? "bg-green-600 hover:bg-green-700"
                                           : "bg-red-500 hover:bg-red-600"
                                   }`}
                    >
                        {depositing || withdrawing
                            ? "Processing..."
                            : tab === "deposit"
                            ? "Confirm Deposit"
                            : "Confirm Withdrawal"}
                    </button>
                </div>
            </div>
        </div>
    </div>
);
}