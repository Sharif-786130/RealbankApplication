import { useParams, Link } from "react-router-dom";
import { useGetLoanByCustomerQuery } from "../../api/loanApi";
import { useSelector } from "react-redux";
import { AlertTriangle, ArrowLeft, FileText } from "lucide-react";

// ── EMI calculator (same logic as ViewCustomer.jsx) ──
const calcEMI = (principal, annualRate, tenureMonths) => {
    if (!principal || !annualRate || !tenureMonths) return null;
    const r = annualRate / 12 / 100;
    if (r === 0) return principal / tenureMonths;
    return (principal * r * Math.pow(1 + r, tenureMonths)) /
        (Math.pow(1 + r, tenureMonths) - 1);
};

const clearanceDate = (startDate, tenureMonths) => {
    if (!startDate || !tenureMonths) return null;
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + Number(tenureMonths));
    return d.toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
    });
};

// ── Status pill ──
function StatusPill({ status }) {
    const map = {
        APPROVED: "bg-green-100 text-green-700",
        PENDING:  "bg-yellow-100 text-yellow-700",
        REJECTED: "bg-red-100 text-red-700",
        DISBURSED:"bg-blue-100 text-blue-700",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status ?? "—"}
        </span>
    );
}

// ── Detail row ──
function DetailRow({ label, value, highlight }) {
    return (
        <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`font-semibold ${highlight ? "text-indigo-700" : "text-gray-800"}`}>
                {value || "—"}
            </p>
        </div>
    );
}

export default function LoanDetails() {
    const { loanId } = useParams();           // route: /customer/loans/:loanId
    const { customerId } = useSelector((state) => state.auth);

    // We fetch ALL loans for this customer, then find the one
    // matching the loanId from the URL
    const {
        data: loans = [],
        isLoading,
        isError,
    } = useGetLoanByCustomerQuery(customerId, { skip: !customerId });

    if (!customerId) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="mx-auto text-red-500 mb-2" size={28} />
                    <p className="text-red-600 font-medium">Session expired</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                    <p className="text-sm">Loading loan details…</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertTriangle size={16} />
                <span>Failed to load loan details. Please try again.</span>
            </div>
        );
    }

    // Find the specific loan from the list
    const loan = loans.find((l) => String(l.loanId) === String(loanId));

    if (!loan) {
        return (
            <div className="text-center py-20">
                <FileText className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="text-gray-500 font-medium">Loan not found.</p>
                <Link
                    to="/customer/dashboard"
                    className="text-sm text-teal-600 underline mt-2 inline-block"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    // ── Calculations ──
    const RATES = { HOME: 8.5, PERSONAL: 12.0, VEHICLE: 9.0 };
    const rate = loan.interestRate ?? RATES[loan.loanType?.toUpperCase()];
    const emi = calcEMI(loan.loanAmount, rate, loan.tenureMonths);
    const totalPayable = emi ? emi * loan.tenureMonths : null;
    const totalInterest = totalPayable ? totalPayable - loan.loanAmount : null;
    const clearDate = clearanceDate(
        loan.approvedAt || loan.disbursedAt, loan.tenureMonths
    );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                        Loan Details
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5 font-mono">
                        {loan.loanNumber}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusPill status={loan.status} />
                    <Link
                        to="/customer/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        <ArrowLeft size={15} />
                        Back
                    </Link>
                </div>
            </div>

            {/* Basic loan info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Loan Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DetailRow label="Loan Type"    value={loan.loanType} />
                    <DetailRow label="Loan Amount"
                        value={loan.loanAmount
                            ? `₹${Number(loan.loanAmount).toLocaleString("en-IN")}`
                            : null}
                    />
                    <DetailRow label="Interest Rate"
                        value={rate ? `${rate}% p.a.` : null}
                    />
                    <DetailRow label="Tenure"
                        value={loan.tenureMonths ? `${loan.tenureMonths} months` : null}
                    />
                    <DetailRow label="Outstanding Balance"
                        value={loan.outstandingBalance
                            ? `₹${Number(loan.outstandingBalance).toLocaleString("en-IN")}`
                            : null}
                    />
                    <DetailRow label="Status" value={loan.status} />
                    <DetailRow label="Applied On"
                        value={loan.createdAt
                            ? new Date(loan.createdAt).toLocaleDateString("en-IN")
                            : null}
                    />
                    <DetailRow label="Approved On"
                        value={loan.approvedAt
                            ? new Date(loan.approvedAt).toLocaleDateString("en-IN")
                            : null}
                    />
                    <DetailRow
                        label="Loan Clear Date"
                        value={clearDate}
                        highlight={!!clearDate}
                    />
                </div>
            </div>

            {/* EMI breakdown — only when approved */}
            {loan.status === "APPROVED" && emi ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        EMI Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 text-center">
                            <p className="text-xs text-teal-500 font-medium uppercase tracking-wide mb-2">
                                Monthly EMI
                            </p>
                            <p className="text-3xl font-bold text-teal-700">
                                ₹{emi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </p>
                        </div>

                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-center">
                            <p className="text-xs text-orange-500 font-medium uppercase tracking-wide mb-2">
                                Total Interest
                            </p>
                            <p className="text-3xl font-bold text-orange-600">
                                ₹{totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
                            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-2">
                                Total Payable
                            </p>
                            <p className="text-3xl font-bold text-blue-700">
                                ₹{totalPayable.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </p>
                        </div>

                    </div>

                    {/* Repayment schedule bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Principal</span>
                            <span>Interest</span>
                        </div>
                        <div className="flex rounded-full overflow-hidden h-3">
                            <div
                                className="bg-teal-500"
                                style={{
                                    width: `${(loan.loanAmount / totalPayable) * 100}%`
                                }}
                            />
                            <div className="bg-orange-400 flex-1" />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>
                                ₹{Number(loan.loanAmount).toLocaleString("en-IN")}
                                {" "}({((loan.loanAmount / totalPayable) * 100).toFixed(1)}%)
                            </span>
                            <span>
                                ₹{totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                {" "}({((totalInterest / totalPayable) * 100).toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                </div>
            ) : loan.status === "PENDING" ? (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-5 py-4 text-sm text-yellow-700">
                    ⏳ EMI details will be available once your loan is approved.
                </div>
            ) : loan.status === "REJECTED" ? (
                <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-sm text-red-700">
                    ✗ This loan was rejected. Please contact your branch officer for details.
                </div>
            ) : null}

        </div>
    );
}