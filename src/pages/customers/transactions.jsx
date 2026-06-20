import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAccountByCustomerQuery } from "../../api/accountApi";
import { useTransferMutation } from "../../api/transactionApi";
import { ArrowLeft, Link } from "lucide-react";

export default function TransferMoney() {
    const navigate = useNavigate();
    const { customerId } = useSelector((state) => state.auth);

    const { data: accounts = [] } = useGetAccountByCustomerQuery(customerId);
    const [transfer, { isLoading }] = useTransferMutation();

    const [form, setForm] = useState({
        fromAccountId: "",
        toAccountNumber: "",
        amount: "",
        type: "TRANSFER",
        upiId: "",
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fromAccountId || !form.toAccountNumber || !form.amount) {
            setMessage("Please fill all required fields.");
            setIsError(true);
            return;
        }
        if (Number(form.amount) <= 0) {
            setMessage("Amount must be greater than 0.");
            setIsError(true);
            return;
        }
        try {
            await transfer({
                fromAccountId: Number(form.fromAccountId),
                toAccountNumber: form.toAccountNumber,
                amount: Number(form.amount),
                type: form.type,
                upiId: form.type === "UPI" ? form.upiId : "",
            }).unwrap();
            setMessage("Transfer successful!");
            setIsError(false);
            setForm({ fromAccountId: "", toAccountNumber: "", amount: "", type: "TRANSFER", upiId: "" });
        } catch (err) {
            setMessage(err?.data?.message || "Transfer failed. Please try again.");
            setIsError(true);
        }
    };

    // selected account balance for display
    const selectedAccount = accounts.find(
        (a) => String(a.accountId) === String(form.fromAccountId)
    );


    return (
        // <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Back */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
                >
                    <ArrowLeft size={15} /> Back
                </button>
            </div>

            {/* <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"> */}
            <div className="flex justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfer Money</h2>
                    <p className="text-sm text-gray-500 mb-6">Send money to any bank account or UPI</p>

                    {/* Message */}
                    {message && (
                        <div className={`mb-5 p-3 rounded-lg text-sm font-medium ${isError
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                            }`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-4">

                        {/* From Account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                From Account
                            </label>
                            <select
                                name="fromAccountId"
                                value={form.fromAccountId}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="">-- Select Account --</option>
                                {accounts.map((acc) => (
                                    <option key={acc.accountId} value={acc.accountId}>
                                        {acc.accountNumber} — ₹{Number(acc.balance).toLocaleString("en-IN")}
                                    </option>
                                ))}
                            </select>
                            {/* Show balance below */}
                            {selectedAccount && (
                                <p className="text-xs text-teal-600 mt-1 ml-1">
                                    Available balance: ₹{Number(selectedAccount.balance).toLocaleString("en-IN")}
                                </p>
                            )}
                        </div>

                        {/* Transfer Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Transfer Type
                            </label>
                            <div className="flex gap-3">
                                {["TRANSFER", "UPI"].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setForm({ ...form, type: t })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${form.type === t
                                            ? "bg-teal-600 text-white border-teal-600"
                                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {t === "TRANSFER" ? "Bank Transfer" : "UPI"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* UPI ID — only for UPI */}
                        {form.type === "UPI" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    UPI ID
                                </label>
                                <input
                                    type="text"
                                    name="upiId"
                                    value={form.upiId}
                                    onChange={handleChange}
                                    placeholder="example@okaxis"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        )}

                        {/* To Account Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To Account Number
                            </label>
                            <input
                                type="text"
                                name="toAccountNumber"
                                value={form.toAccountNumber}
                                onChange={handleChange}
                                placeholder="Enter receiver account number"
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                min="1"
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                            {/* Insufficient balance warning */}
                            {selectedAccount && form.amount &&
                                Number(form.amount) > Number(selectedAccount.balance) && (
                                    <p className="text-xs text-red-500 mt-1 ml-1">
                                        Insufficient balance
                                    </p>
                                )}
                        </div>

                        {/* Buttons */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white py-2.5 rounded-lg font-medium transition"
                        >
                            {isLoading ? "Processing..." : "Transfer Now"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg transition text-sm"
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}