import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { useApplyLoanMutation } from "../../api/loanApi";
import { useCreateLoanMutation } from "../../api/loanApi";
import { useGetAccountByCustomerQuery } from "../../api/accountApi";
import { ArrowLeft, FileText } from "lucide-react";

const LOAN_TYPES = ["HOME", "PERSONAL", "VEHICLE"];
const RATES = { HOME: 8.5, PERSONAL: 12.0, VEHICLE: 9.0 };

// Live EMI preview calculator
function EmiPreview({ amount, type, tenure }) {
    if (!amount || !type || !tenure) return null;
    const rate = RATES[type];
    const r = rate / 12 / 100;
    const emi = r === 0
        ? amount / tenure
        : (amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
    const total = emi * tenure;
    const interest = total - amount;

    return (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-3">
                EMI Preview
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                    <p className="text-xs text-gray-400 mb-1">Monthly EMI</p>
                    <p className="font-bold text-blue-700 text-lg">
                        ₹{emi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-1">Total Interest</p>
                    <p className="font-bold text-orange-600 text-lg">
                        ₹{interest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-1">Total Payable</p>
                    <p className="font-bold text-gray-800 text-lg">
                        ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CustomerApplyLoan() {
    const navigate = useNavigate();
    const { customerId } = useSelector((state) => state.auth);

    // const [applyLoan, { isLoading }] = useApplyLoanMutation();
    const [applyLoan, { isLoading }] = useCreateLoanMutation();
    const { data: accounts = [] } = useGetAccountByCustomerQuery(
        customerId, { skip: !customerId }
    );

    const [form, setForm] = useState({
        customerId: customerId || "",
        loanType: "",
        loanAmount: "",
        tenureMonths: "",
    });

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setMessage(""); // clear message on change
    };

    const handleSubmit = async () => {
        if (!form.loanType || !form.loanAmount || !form.tenureMonths) {
            setMessage("Please fill all fields.");
            setSuccess(false);
            return;
        }
        if (Number(form.loanAmount) < 1000) {
            setMessage("Minimum loan amount is ₹1,000.");
            setSuccess(false);
            return;
        }

        try {
            await applyLoan({
                customerId: Number(form.customerId),
                loanType: form.loanType,
                loanAmount: Number(form.loanAmount),
                tenureMonths: Number(form.tenureMonths),
            }).unwrap();

            setSuccess(true);
            setMessage("✅ Loan application submitted! Officer will review it shortly.");
            setForm({ customerId, loanType: "", loanAmount: "", tenureMonths: "" });

            setTimeout(() => navigate("/customer/loans"), 2500);

        } catch (err) {
            setSuccess(false);
            setMessage("❌ " + (err?.data?.message || "Failed to apply loan."));
        }
    };

    return (
        <div className="space-y-6">

            {/* Back button */}
            <div className="w-full flex justify-end">
                <button onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400
                               hover:text-gray-700 hover:bg-gray-100
                               px-3 py-1.5 rounded-lg transition-all duration-200">
                    <ArrowLeft size={15} /> Back
                </button>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Apply for Loan</h2>
                    <p className="text-sm text-gray-400">
                        Submit your loan request — officer will review and approve
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

                    {message && (
                        <div className={`text-sm font-medium p-3 rounded-xl ${success
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Loan Type */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Loan Type
                        </label>
                        <select
                            name="loanType"
                            value={form.loanType}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select loan type</option>
                            {LOAN_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        {form.loanType && (
                            <p className="text-xs text-gray-400">
                                Interest rate: {RATES[form.loanType]}% p.a.
                            </p>
                        )}
                    </div>

                    {/* Loan Amount */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Loan Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="loanAmount"
                            placeholder="e.g. 50000"
                            value={form.loanAmount}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-xs text-gray-400">Minimum ₹1,000</p>
                    </div>

                    {/* Tenure */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Tenure (months)
                        </label>
                        <select
                            name="tenureMonths"
                            value={form.tenureMonths}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select tenure</option>
                            {[6, 12, 24, 36, 48, 60, 84, 120, 180, 240].map((m) => (
                                <option key={m} value={m}>
                                    {m} months ({Math.floor(m / 12)} yr{m >= 24 ? "s" : ""}{m % 12 ? ` ${m % 12} mo` : ""})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* EMI Preview */}
                    <EmiPreview
                        amount={Number(form.loanAmount)}
                        type={form.loanType}
                        tenure={Number(form.tenureMonths)}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3
                                   rounded-xl font-semibold text-sm transition disabled:opacity-50"
                    >
                        {isLoading ? "Submitting..." : "Submit Loan Application"}
                    </button>
                </div>

                {/* Info panel */}
                <div className="space-y-4">

                    {/* Loan type info cards */}
                    {LOAN_TYPES.map((type) => (
                        <div key={type}
                            onClick={() => setForm((p) => ({ ...p, loanType: type }))}
                            className={`bg-white rounded-xl border p-4 cursor-pointer transition
                                ${form.loanType === type
                                    ? "border-blue-400 ring-2 ring-blue-100"
                                    : "border-gray-100 hover:border-gray-200"}`}
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-700 text-sm">{type} LOAN</p>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    {RATES[type]}% p.a.
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                {type === "HOME" && "For purchasing or constructing a house"}
                                {type === "PERSONAL" && "For personal expenses, medical, education"}
                                {type === "VEHICLE" && "For purchasing a car or two-wheeler"}
                            </p>
                        </div>
                    ))}

                    {/* Process info */}
                    {/* <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-700 mb-2">
                            How it works
                        </p>
                        <div className="space-y-1.5 text-xs text-amber-600">
                            <p>1. Submit your application here</p>
                            <p>2. Officer reviews your documents</p>
                            <p>3. Loans ≤ ₹1,00,000 — Officer approves</p>
                            <p>4. Loans &gt; ₹1,00,000 — Admin approves</p>
                            <p>5. You get notified on your dashboard</p>
                        </div>
                    </div> */}

                    {/* Add this right after the loan amount input div */}
                    {Number(form.loanAmount) > 100000 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3">
                            <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
                            <div>
                                <p className="text-sm font-semibold text-amber-800">
                                    Branch Visit Required
                                </p>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                    Loan amount exceeds ₹1,00,000. Your application will be submitted
                                    but you must <strong>visit your nearest branch</strong> with your
                                    Aadhaar, PAN, income proof and bank statements for Admin verification
                                    before approval.
                                </p>
                            </div>
                        </div>
                    )}

                </div>


            </div>
        </div>
    );
}