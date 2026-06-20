import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetCustomerByIdQuery } from "../../api/officerCustomerApi";
import { useGetAccountByCustomerQuery } from "../../api/accountApi";
import { useApproveLoanMutation, useGetLoanByCustomerQuery, useRejectLoanMutation } from "../../api/loanApi";
import { useGetTransactionsByCustomerQuery } from "../../api/transactionApi";

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
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const RATES = { HOME: 8.5, PERSONAL: 12.0, VEHICLE: 9.0 };
const OFFICER_LIMIT = 100000;

const ViewCustomer = () => {
  const { id } = useParams();

  const { data: customer, isLoading, isError, error } = useGetCustomerByIdQuery(id);
  const { data: accounts = [] } = useGetAccountByCustomerQuery(id);
  const {
    data: loanResponse,
    refetch: refetchLoans
  } = useGetLoanByCustomerQuery(id);

  const loans = loanResponse?.data || [];
  const { data: transactionResponse } = useGetTransactionsByCustomerQuery(id);

  const transactions = transactionResponse?.data || [];

  const [approveLoan] = useApproveLoanMutation();
  const [rejectLoan] = useRejectLoanMutation();

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingLoanId, setPendingLoanId] = useState(null);
  const [checklist, setChecklist] = useState({
    aadhaar: false,
    pan: false,
    income: false,
    kyc: false,
  });

  const handleApprove = async (loanId) => {
    try {
      await approveLoan(loanId).unwrap();
      refetchLoans();
      alert("Loan approved successfully!");
    } catch (err) {
      alert(err?.data?.message || "Failed to approve loan");
    }
  };

  const handleReject = async (loanId) => {
    try {
      await rejectLoan(loanId).unwrap();
      refetchLoans();
      alert("Loan rejected.");
    } catch (err) {
      alert(err?.data?.message || "Failed to reject loan");
    }
  };

  const openVerifyModal = (loanId) => {
    setPendingLoanId(loanId);
    setChecklist({ aadhaar: false, pan: false, income: false, kyc: false });
    setShowVerifyModal(true);
  };

  const closeVerifyModal = () => {
    setShowVerifyModal(false);
    setPendingLoanId(null);
  };

  const allChecked = Object.values(checklist).every(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading customer details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">
          {error?.data?.message || "Failed to load customer"}
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>No customer found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Customer Details</h2>
          <Link
            to="/officer/customers"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center text-sm"
          >
            Back
          </Link>
        </div>

        {/* Personal Information */}
        <Section title="Personal Information">
          <Field label="Customer Number" value={customer.customerNumber} />
          <Field label="First Name" value={customer.firstName} />
          <Field label="Last Name" value={customer.lastName} />
          <Field label="Email" value={customer.email} />
          <Field label="Mobile Number" value={customer.mobileNumber} />
          <Field label="Date of Birth" value={customer.dateofBirth
            ? new Date(customer.dateofBirth).toLocaleDateString() : "_"} />
          <Field label="Gender" value={customer.gender} />
        </Section>

        {/* Address Information */}
        <Section title="Address Information">
          <Field label="Address Line 1" value={customer.addressLine1} />
          <Field label="Address Line 2" value={customer.addressLine2} />
          <Field label="City" value={customer.city} />
          <Field label="State" value={customer.state} />
          <Field label="Pincode" value={customer.pincode} />
          <Field label="Country" value={customer.country} />
        </Section>

        {/* KYC Information */}
        <Section title="KYC Information">
          <Field label="Aadhaar Number" value={customer.aadhaarNumber} />
          <Field label="PAN Number" value={customer.panNumber} />
          <Field label="KYC Status" value={customer.kycStatus} />
        </Section>

        {/* Account Status */}
        <Section title="Account Status">
          <Field label="Status" value={customer.active ? "Active" : "Inactive"} />
          <Field label="Created At" value={customer.createdAt} />
          <Field label="Updated At" value={customer.updatedAt} />
        </Section>

        {/* Accounts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Accounts</h3>
          <div className="mb-4">
            <Link
              to={`/officer/customers/${id}/teller`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm inline-block"
            >
              💰 Deposit / Withdraw
            </Link>
          </div>

          {accounts.length === 0 ? (
            <p className="text-gray-500 text-sm">No accounts found.</p>
          ) : (
            <>
              {/* Mobile card list */}
              <div className="flex flex-col gap-3 md:hidden">
                {accounts.map((acc) => (
                  <div key={acc.accountId} className="border border-gray-100 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-gray-500">{acc.accountNumber}</span>
                      <StatusBadge
                        value={acc.status}
                        map={{ ACTIVE: "green", FROZEN: "blue" }}
                        fallback="red"
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{acc.accountType} · {acc.branchName}</span>
                      <span className="font-semibold text-gray-800">
                        ₹{acc.balance?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left border-b">Account Number</th>
                      <th className="p-3 text-left border-b">Type</th>
                      <th className="p-3 text-left border-b">Balance</th>
                      <th className="p-3 text-left border-b">Status</th>
                      <th className="p-3 text-left border-b">Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr key={acc.accountId} className="hover:bg-gray-50">
                        <td className="p-3 border-b font-mono text-xs">{acc.accountNumber}</td>
                        <td className="p-3 border-b">{acc.accountType}</td>
                        <td className="p-3 border-b font-semibold">
                          ₹{acc.balance?.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 border-b">
                          <StatusBadge
                            value={acc.status}
                            map={{ ACTIVE: "green", FROZEN: "blue" }}
                            fallback="red"
                          />
                        </td>
                        <td className="p-3 border-b">{acc.branchName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Loans */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Loans</h3>
          {loans.length === 0 ? (
            <p className="text-gray-500 text-sm">No loans found.</p>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => {
                const rate = loan.interestRate ?? RATES[loan.loanType?.toUpperCase()];
                const emi = calcEMI(loan.loanAmount, rate, loan.tenureMonths);
                const totalPayable = emi ? emi * loan.tenureMonths : null;
                const totalInterest = totalPayable ? totalPayable - loan.loanAmount : null;
                const clearDate = clearanceDate(
                  loan.approvedAt || loan.createdAt,
                  loan.tenureMonths
                );
                const withinOfficerLimit = Number(loan.loanAmount) <= OFFICER_LIMIT;

                return (
                  <div
                    key={loan.loanId}
                    className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-gray-50 shadow-sm"
                  >
                    {/* Loan Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm text-gray-600">
                        {loan.loanNumber}
                      </span>
                      <StatusBadge
                        value={loan.status}
                        map={{ APPROVED: "green", PENDING: "yellow" }}
                        fallback="red"
                      />
                    </div>

                    {/* Loan Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <LoanField label="Loan Type" value={loan.loanType} />
                      <LoanField
                        label="Loan Amount"
                        value={loan.loanAmount
                          ? `₹${Number(loan.loanAmount).toLocaleString("en-IN")}`
                          : null}
                      />
                      <LoanField
                        label="Interest Rate"
                        value={rate ? `${rate}% p.a.` : null}
                      />
                      <LoanField
                        label="Tenure"
                        value={loan.tenureMonths ? `${loan.tenureMonths} months` : null}
                      />
                      <LoanField
                        label="Applied On"
                        value={loan.createdAt
                          ? new Date(loan.createdAt).toLocaleDateString("en-IN")
                          : null}
                      />
                      <LoanField
                        label="Loan Clear Date"
                        value={clearDate}
                        highlight={!!clearDate}
                      />
                    </div>

                    {/* EMI Details - only when approved */}
                    {loan.status === "APPROVED" && emi && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="text-center">
                          <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">
                            Monthly EMI
                          </p>
                          <p className="text-lg font-bold text-blue-700">
                            ₹{emi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">
                            Total Interest
                          </p>
                          <p className="text-lg font-bold text-orange-600">
                            ₹{totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">
                            Total Payable
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            ₹{totalPayable.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Pending message */}
                    {loan.status === "PENDING" && (
                      <p className="mt-3 text-xs text-yellow-600 italic">
                        EMI details will be available once the loan is approved.
                      </p>
                    )}

                    {/* Officer can approve — only loans ≤ ₹1,00,000 */}
                    {loan.status === "PENDING" && withinOfficerLimit && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={() => openVerifyModal(loan.loanId)}
                          className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(loan.loanId)}
                          className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Needs Admin — loans > ₹1,00,000 */}
                    {loan.status === "PENDING" && !withinOfficerLimit && (
                      <div className="mt-4">
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          ⏳ Needs Admin Approval — exceeds your limit of ₹1,00,000
                        </span>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Transaction History
          </h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions found for this customer.</p>
          ) : (
            <>
              {/* Mobile card list */}
              <div className="flex flex-col gap-3 md:hidden">
                {transactions.map((txn) => (
                  <div key={txn.transactionId} className="border border-gray-100 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-gray-500">{txn.transactionNumber}</span>
                      <StatusBadge
                        value={txn.status}
                        map={{ SUCCESS: "green" }}
                        fallback="red"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <StatusBadge
                        value={txn.type}
                        map={{
                          DEPOSIT: "green",
                          WITHDRAW: "red",
                          TRANSFER_CREDIT: "green",
                          TRANSFER_DEBIT: "red"
                        }}
                        fallback="blue"
                      />
                      <span className="font-semibold text-gray-800">
                        ₹{txn.amount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
                      <span>Before: ₹{txn.balanceBefore?.toLocaleString("en-IN")}</span>
                      <span>After: ₹{txn.balanceAfter?.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="p-3 text-left text-gray-600">Txn Number</th>
                      <th className="p-3 text-left text-gray-600">Type</th>
                      <th className="p-3 text-left text-gray-600">Amount</th>
                      <th className="p-3 text-left text-gray-600">Balance Before</th>
                      <th className="p-3 text-left text-gray-600">Balance After</th>
                      <th className="p-3 text-left text-gray-600">Status</th>
                      <th className="p-3 text-left text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.transactionId} className="hover:bg-gray-50 border-t">
                        <td className="p-3 font-mono text-xs">{txn.transactionNumber}</td>
                        <td className="p-3">
                          <StatusBadge
                            value={txn.type}
                            map={{
                              DEPOSIT: "green",
                              WITHDRAW: "red",
                              TRANSFER_CREDIT: "green",
                              TRANSFER_DEBIT: "red"
                            }}
                            fallback="blue"
                          />
                        </td>
                        <td className="p-3 font-semibold">
                          ₹{txn.amount?.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3">₹{txn.balanceBefore?.toLocaleString("en-IN")}</td>
                        <td className="p-3">₹{txn.balanceAfter?.toLocaleString("en-IN")}</td>
                        <td className="p-3">
                          <StatusBadge
                            value={txn.status}
                            map={{ SUCCESS: "green" }}
                            fallback="red"
                          />
                        </td>
                        <td className="p-3 text-xs text-gray-500">
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to={`/officer/customers/${id}/create-account`}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm text-center"
          >
            + Open Account
          </Link>

          <Link
            to={`/officer/customers/${id}/create-loan`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm text-center"
          >
            + Apply Loan
          </Link>

          <Link to={`/officer/customers/${id}/issue-card`}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition text-sm text-center">
            Issue Card
          </Link>
        </div>

      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Loan Verification Checklist
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Confirm all documents before approving the loan.
            </p>

            <div className="space-y-4 mb-6">
              {[
                { key: "aadhaar", label: "Aadhaar verified" },
                { key: "pan", label: "PAN verified" },
                { key: "income", label: "Income proof checked" },
                { key: "kyc", label: "KYC status is APPROVED" },
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
                    className="w-4 h-4 accent-green-600"
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
                ⚠ Please confirm all items before approving.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await handleApprove(pendingLoanId);
                  closeVerifyModal();
                }}
                disabled={!allChecked}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium
                           hover:bg-green-700 transition
                           disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ✓ Approve Loan
              </button>
              <button
                onClick={closeVerifyModal}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ViewCustomer;

/* ---------------- Reusable Components ---------------- */

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-gray-800 font-medium break-words">{value || "—"}</p>
  </div>
);

const LoanField = ({ label, value, highlight }) => (
  <div>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className={`font-medium ${highlight ? "text-indigo-700" : "text-gray-800"}`}>
      {value || "—"}
    </p>
  </div>
);

const colourMap = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
};

const StatusBadge = ({ value, map = {}, fallback = "red" }) => {
  const colour = map[value] ?? fallback;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colourMap[colour]}`}>
      {value}
    </span>
  );
};