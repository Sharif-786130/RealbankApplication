import { useState, useMemo } from "react";
import { useCreateLoanMutation } from "../../api/loanApi";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const INTEREST_RATES = {
  HOME: 8.5,
  PERSONAL: 12.0,
  VEHICLE: 9.0,
};

const calcEMI = (principal, annualRate, tenureMonths) => {
  if (!principal || !annualRate || !tenureMonths) return null;
  const p = Number(principal);
  const r = annualRate / 12 / 100;
  const n = Number(tenureMonths);
  if (r === 0) return p / n;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

const fmt = (n) =>
  n != null ? `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "—";

export default function CreateLoan() {
  const [createLoan, { isLoading }] = useCreateLoanMutation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerId: id || "",
    loanType: "PERSONAL",
    loanAmount: "",
    tenureMonths: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const rate = INTEREST_RATES[form.loanType];
  const emi = useMemo(
    () => calcEMI(form.loanAmount, rate, form.tenureMonths),
    [form.loanAmount, form.tenureMonths, form.loanType]
  );
  const totalPayable = emi ? emi * Number(form.tenureMonths) : null;
  const totalInterest = totalPayable ? totalPayable - Number(form.loanAmount) : null;

  const clearDate = useMemo(() => {
    if (!form.tenureMonths) return null;
    const d = new Date();
    d.setMonth(d.getMonth() + Number(form.tenureMonths));
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }, [form.tenureMonths]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.loanAmount || Number(form.loanAmount) <= 0) {
      setError("Please enter a valid loan amount.");
      return;
    }
    if (!form.tenureMonths) {
      setError("Please select a tenure.");
      return;
    }
    try {
      await createLoan(form).unwrap();
      alert("Loan application submitted successfully!");
      navigate(-1);
    } catch (err) {
      setError(err?.data?.message || "Failed to create loan. Please try again.");
    }
  };

  return (


    // <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">

    <div className="min-h-screen bg-gray-100 p-6">

      {/* <div className="w-full flex justify-end"> */}
        <div className="flex justify-end mb-4">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      {/* <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg"> */}
         <div className="flex justify-center">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Apply for a Loan</h2>

        <div className="space-y-4">



          <div>
            <label className="block text-sm text-gray-500 mb-1">Customer ID</label>
            <input
              name="customerId"
              value={form.customerId}
              readOnly
              className="w-full border p-2 rounded-lg bg-gray-100 text-gray-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Loan Type</label>
            <select
              name="loanType"
              value={form.loanType}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="HOME">Home Loan ({INTEREST_RATES.HOME}% p.a.)</option>
              <option value="PERSONAL">Personal Loan ({INTEREST_RATES.PERSONAL}% p.a.)</option>
              <option value="VEHICLE">Vehicle Loan ({INTEREST_RATES.VEHICLE}% p.a.)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Loan Amount (₹)</label>
            <input
              name="loanAmount"
              type="number"
              min="1"
              placeholder="e.g. 500000"
              value={form.loanAmount}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Tenure</label>
            <select
              name="tenureMonths"
              value={form.tenureMonths}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Tenure</option>
              <option value="12">1 Year (12 Months)</option>
              <option value="24">2 Years (24 Months)</option>
              <option value="36">3 Years (36 Months)</option>
              <option value="60">5 Years (60 Months)</option>
              <option value="120">10 Years (120 Months)</option>
            </select>
          </div>

          {emi && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
              <p className="text-sm font-semibold text-blue-700 mb-1">Loan Preview</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <PreviewRow label="Interest Rate" value={`${rate}% p.a.`} />
                <PreviewRow label="Monthly EMI" value={fmt(emi)} highlight />
                <PreviewRow label="Total Interest" value={fmt(totalInterest)} />
                <PreviewRow label="Total Payable" value={fmt(totalPayable)} />
              </div>

              {clearDate && (
                <div className="mt-2 pt-2 border-t border-blue-200 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Expected Loan Clearance Date</span>
                  <span className="font-semibold text-indigo-700">{clearDate}</span>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-1">
                * EMI is indicative. Final rate will be confirmed upon approval.
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 rounded-lg font-medium transition"
          >
            {isLoading ? "Submitting…" : "Submit Loan Application"}
          </button>

        </div>
      </div>
    </div>
    </div>
  );
}

const PreviewRow = ({ label, value, highlight }) => (
  <div className="bg-white rounded-lg p-2.5 shadow-sm">
    <p className="text-xs text-gray-400">{label}</p>
    <p className={`font-semibold ${highlight ? "text-blue-700 text-base" : "text-gray-800"}`}>
      {value}
    </p>
  </div>
);