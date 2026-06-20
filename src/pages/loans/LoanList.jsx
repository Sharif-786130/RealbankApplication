import { useSelector } from "react-redux"; // ✅ add this import
import { useGetLoanByCustomerQuery } from "../../api/loanApi";

export default function LoanList() {
    const { customerId } = useSelector((state) => state.auth); // ✅ was hardcoded 15

    // const { data: loans = [], isLoading, error } =
    //     useGetLoanByCustomerQuery(customerId, { skip: !customerId }); // ✅ skip if no customerId

    const { data: loansResponse, isLoading, error } =
        useGetLoanByCustomerQuery(customerId, { skip: !customerId });
    const loans = Array.isArray(loansResponse?.data) ? loansResponse.data :
        Array.isArray(loansResponse) ? loansResponse : [];

    if (isLoading) return <p className="p-6">Loading loans...</p>;
    if (error) return <p className="p-6 text-red-500">Error loading loans</p>;
    if (loans.length === 0) return <p className="p-6">No loans found</p>;

    if (isLoading) return <p className="p-6">Loading loans...</p>;
    if (error) return <p className="p-6 text-red-500">Error loading loans</p>;
    if (loans.length === 0) return <p className="p-6">No loans found</p>;

    return (
        <div className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-6">
                <h1 className="text-2xl font-bold">Loan Management</h1>
                <p className="text-sm opacity-90">Manage and approve customer loans</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loans.map((loan) => (
                    <div key={loan.loanId} className="bg-white p-4 rounded-xl shadow">
                        <h2 className="font-bold text-lg mb-2">{loan.loanNumber}</h2>
                        <p>Amount: ₹{loan.loanAmount}</p>
                        <p>Status: {loan.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}