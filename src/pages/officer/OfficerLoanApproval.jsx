import { useState } from "react";
import {
  useGetAllLoansQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
} from "../../api/loanApi";

export default function OfficerLoanApproval() {
  // const { data: loans = [], isLoading, isError, refetch } = useGetAllLoansQuery();
  const { data: loansResponse, isLoading, isError, refetch } = useGetAllLoansQuery();
  const loans = Array.isArray(loansResponse?.data) ? loansResponse.data :
    Array.isArray(loansResponse) ? loansResponse : [];
  const [approveLoan] = useApproveLoanMutation();
  const [rejectLoan] = useRejectLoanMutation();

  const [actionMsg, setActionMsg] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const OFFICER_LIMIT = 100000;

  const pendingLoans = loans.filter(
    (l) => l.status === "PENDING" && Number(l.loanAmount) <= OFFICER_LIMIT
  );

  // ← declare here, outside return
  const needsAdminApproval = loans.filter(
    (l) => l.status === "PENDING" && Number(l.loanAmount) > OFFICER_LIMIT
  );

  const handleApprove = async (loanId) => {
    setLoadingId(loanId);
    setActionMsg("");
    try {
      await approveLoan(loanId).unwrap();
      setActionMsg("success:Loan approved successfully!");
      refetch();
    } catch (err) {
      setActionMsg("error:" + (err?.data?.message || "Failed to approve loan."));
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (loanId) => {
    if (!window.confirm("Are you sure you want to reject this loan?")) return;
    setLoadingId(loanId);
    setActionMsg("");
    try {
      await rejectLoan(loanId).unwrap();
      setActionMsg("success:Loan rejected.");
      refetch();
    } catch (err) {
      setActionMsg("error:" + (err?.data?.message || "Failed to reject loan."));
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Loading loans...</p>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-red-600">Failed to load loans.</p>
    </div>
  );

  const [msgType, msgText] = actionMsg.split(/:(.+)/);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-6">
          <h1 className="text-2xl font-bold">Loan Approvals</h1>
          <p className="text-sm opacity-90 mt-1">
            Pending loans up to ₹1,00,000 — within your approval limit
          </p>
        </div>

        {/* Action Message */}
        {actionMsg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${msgType === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
            }`}>
            {msgText}
          </div>
        )}

        {/* Loans within officer limit */}
        {pendingLoans.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-400 text-lg">
              No pending loans within your approval limit.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Loans above ₹1,00,000 require Admin approval.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingLoans.map((loan) => (
              <LoanCard
                key={loan.loanId}
                loan={loan}
                loadingId={loadingId}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}

        {/* ← Needs Admin Approval section placed HERE after pendingLoans */}
        {needsAdminApproval.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              ⏳ Awaiting Admin Approval
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              These loans exceed your limit of ₹1,00,000 and require Admin approval.
            </p>
            <div className="space-y-3">
              {needsAdminApproval.map((loan) => (
                <div
                  key={loan.loanId}
                  className="bg-white border border-orange-200 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-mono text-sm text-gray-500">
                      {loan.loanNumber}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {loan.loanType} —
                      ₹{Number(loan.loanAmount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {loan.tenureMonths} months tenure
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    Needs Admin
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function LoanCard({ loan, loadingId, onApprove, onReject }) {
  const isProcessing = loadingId === loan.loanId;
  const RATES = { HOME: 8.5, PERSONAL: 12.0, VEHICLE: 9.0 };
  const rate = loan.interestRate ?? RATES[loan.loanType?.toUpperCase()];

  let emiPreview = null;
  if (loan.loanAmount && rate && loan.tenureMonths) {
    const p = Number(loan.loanAmount);
    const r = rate / 12 / 100;
    const n = Number(loan.tenureMonths);
    emiPreview = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-100">

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-mono text-sm text-gray-500">{loan.loanNumber}</span>
          <span className="ml-3 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            PENDING
          </span>
        </div>
        <span className="text-xs text-gray-400">
          Applied: {loan.createdAt
            ? new Date(loan.createdAt).toLocaleDateString("en-IN")
            : "—"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <InfoBox label="Loan Type" value={loan.loanType} />
        <InfoBox label="Loan Amount" value={`₹${Number(loan.loanAmount).toLocaleString("en-IN")}`} />
        <InfoBox label="Interest Rate" value={rate ? `${rate}% p.a.` : "—"} />
        <InfoBox label="Tenure" value={`${loan.tenureMonths} months`} />
      </div>

      {emiPreview && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4 flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-blue-400 mb-0.5">Monthly EMI (on approval)</p>
            <p className="font-bold text-blue-700">
              ₹{emiPreview.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-400 mb-0.5">Total Payable</p>
            <p className="font-bold text-gray-700">
              ₹{(emiPreview * loan.tenureMonths)
                .toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-400 mb-0.5">Total Interest</p>
            <p className="font-bold text-orange-600">
              ₹{(emiPreview * loan.tenureMonths - Number(loan.loanAmount))
                .toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onApprove(loan.loanId)}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          {isProcessing ? "Processing..." : "✓ Approve"}
        </button>
        <button
          onClick={() => onReject(loan.loanId)}
          disabled={isProcessing}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          {isProcessing ? "Processing..." : "✕ Reject"}
        </button>
      </div>

    </div>
  );
}

const InfoBox = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className="font-semibold text-gray-800 text-sm">{value || "—"}</p>
  </div>
);