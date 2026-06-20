import { useState } from "react";
import {
  useGetAllLoansQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
} from "../../api/loanApi";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLoanApproval() {
  const {
    data: loanResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllLoansQuery();

  const navigate = useNavigate();

  const loans = loanResponse?.data || [];
  const [approveLoan] = useApproveLoanMutation();
  const [rejectLoan] = useRejectLoanMutation();

  const [actionMsg, setActionMsg] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState("PENDING");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingLoanId, setPendingLoanId] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(null);
  const [checklist, setChecklist] = useState({
    officerRec: false,
    aadhaar: false,
    pan: false,
    income: false,
    account: false,
    risk: false,
    credit: false,
    collateral: false,
  });

  const OFFICER_LIMIT = 100000;
  const ADMIN_LIMIT = 500000;

  const allChecked = Object.values(checklist).every(Boolean);

  const filteredLoans = loans.filter((l) => {
    if (filter === "PENDING") return l.status === "PENDING";
    return true;
  });

  const openVerifyModal = (loanId, amount) => {
    setPendingLoanId(loanId);
    setPendingAmount(amount);
    setChecklist({
      officerRec: false,
      aadhaar: false,
      pan: false,
      income: false,
      account: false,
      risk: false,
      credit: false,
      collateral: false,
    });
    setShowVerifyModal(true);
  };

  const closeVerifyModal = () => {
    setShowVerifyModal(false);
    setPendingLoanId(null);
    setPendingAmount(null);
  };

  const handleApprove = async (loanId, amount) => {
    if (Number(amount) > ADMIN_LIMIT) {
      alert(`This loan exceeds the Admin approval limit of ₹5,00,000.`);
      return;
    }
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
  const pendingCount = loans.filter((l) => l.status === "PENDING").length;
  const approvedCount = loans.filter((l) => l.status === "APPROVED").length;
  const rejectedCount = loans.filter((l) => l.status === "REJECTED").length;

  return (

    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500
               hover:text-gray-700 hover:bg-white px-3 py-2
               rounded-lg transition border border-gray-200"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-6">
          <h1 className="text-2xl font-bold">Loan Management — Admin</h1>
          <p className="text-sm opacity-90 mt-1">
            Approve or reject all pending loans up to ₹5,00,000
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <SummaryCard label="Pending" count={pendingCount} color="yellow" />
          <SummaryCard label="Approved" count={approvedCount} color="green" />
          <SummaryCard label="Rejected" count={rejectedCount} color="red" />
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

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {["PENDING", "ALL"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border"
                }`}
            >
              {f === "PENDING"
                ? `Pending (${pendingCount})`
                : `All Loans (${loans.length})`}
            </button>
          ))}
        </div>

        {/* Loan Cards */}
        {filteredLoans.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-400 text-lg">No loans found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLoans.map((loan) => (
              <AdminLoanCard
                key={loan.loanId}
                loan={loan}
                loadingId={loadingId}
                onApprove={openVerifyModal}
                onReject={handleReject}
                adminLimit={ADMIN_LIMIT}
                officerLimit={OFFICER_LIMIT}
              />
            ))}
          </div>
        )}

      </div>

      {/* Admin Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Loan Verification Checklist
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              Admin level verification required.
            </p>
            <p className="text-xs text-indigo-600 font-medium mb-6">
              Loan Amount: ₹{Number(pendingAmount).toLocaleString("en-IN")}
            </p>

            <div className="space-y-4 mb-6">
              {[
                { key: "officerRec", label: "Officer Recommendation Received" },
                { key: "aadhaar", label: "Aadhaar Verified" },
                { key: "pan", label: "PAN Verified" },
                { key: "income", label: "Income Proof Verified" },
                { key: "account", label: "Customer Account Active" },
                { key: "risk", label: "Risk Assessment Completed" },
                { key: "credit", label: "Credit Score Checked" },
                { key: "collateral", label: "Collateral Verified" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checklist[key]}
                    onChange={(e) =>
                      setChecklist((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className={`text-sm font-medium ${checklist[key] ? "text-green-700" : "text-gray-700"
                    }`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>

            {!allChecked && (
              <p className="text-xs text-amber-600 mb-4">
                ⚠ All items must be confirmed before approving.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await handleApprove(pendingLoanId, pendingAmount);
                  closeVerifyModal();
                }}
                disabled={!allChecked}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg
                           text-sm font-medium hover:bg-purple-700 transition
                           disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ✓ Approve Loan
              </button>
              <button
                onClick={closeVerifyModal}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg
                           text-sm font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* ---------- AdminLoanCard ---------- */

function AdminLoanCard({ loan, loadingId, onApprove, onReject, adminLimit, officerLimit }) {
  const isProcessing = loadingId === loan.loanId;
  const isPending = loan.status === "PENDING";
  const amount = Number(loan.loanAmount);
  const exceedsLimit = amount > adminLimit;

  const RATES = { HOME: 8.5, PERSONAL: 12.0, VEHICLE: 9.0 };
  const rate = loan.interestRate ?? RATES[loan.loanType?.toUpperCase()];

  let emiPreview = null;
  if (loan.loanAmount && rate && loan.tenureMonths) {
    const p = amount;
    const r = rate / 12 / 100;
    const n = Number(loan.tenureMonths);
    emiPreview = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CLOSED: "bg-gray-100 text-gray-700",
  };

  return (
    <div className={`bg-white rounded-xl shadow p-5 border ${exceedsLimit && isPending ? "border-red-200" : "border-gray-100"
      }`}>

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm text-gray-500">{loan.loanNumber}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[loan.status] || "bg-gray-100 text-gray-600"
            }`}>
            {loan.status}
          </span>
          {isPending && amount > officerLimit && amount <= adminLimit && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Admin Required
            </span>
          )}
          {exceedsLimit && isPending && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              Exceeds Limit
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          Applied: {loan.createdAt
            ? new Date(loan.createdAt).toLocaleDateString("en-IN")
            : "—"}
        </span>
      </div>

      {/* Loan Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <InfoBox label="Loan Type" value={loan.loanType} />
        <InfoBox label="Loan Amount" value={`₹${amount.toLocaleString("en-IN")}`} />
        <InfoBox label="Interest Rate" value={rate ? `${rate}% p.a.` : "—"} />
        <InfoBox label="Tenure" value={`${loan.tenureMonths} months`} />
      </div>

      {/* EMI Preview */}
      {emiPreview && isPending && !exceedsLimit && (
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
              ₹{(emiPreview * loan.tenureMonths - amount)
                .toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      )}

      {/* Exceeds Limit Warning */}
      {exceedsLimit && isPending && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-600">
          ⚠ This loan exceeds the maximum approval limit of ₹5,00,000. It cannot be approved.
        </div>
      )}

      {/* Action Buttons */}
      {isPending && (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(loan.loanId, loan.loanAmount)}
            disabled={isProcessing || exceedsLimit}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300
                       disabled:cursor-not-allowed text-white px-5 py-2
                       rounded-lg text-sm font-medium transition"
          >
            {isProcessing ? "Processing..." : "✓ Approve"}
          </button>
          <button
            onClick={() => onReject(loan.loanId)}
            disabled={isProcessing}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300
                       text-white px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            {isProcessing ? "Processing..." : "✕ Reject"}
          </button>
        </div>
      )}

    </div>
  );
}

/* ---------- Small Components ---------- */

const InfoBox = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className="font-semibold text-gray-800 text-sm">{value || "—"}</p>
  </div>
);

const SummaryCard = ({ label, count, color }) => {
  const colors = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };
  return (
    <div className={`rounded-xl border p-4 text-center ${colors[color]}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-sm font-medium mt-1">{label}</p>
    </div>
  );
};