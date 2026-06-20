import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";


import SuperAdminLayout from "../layouts/SuperAdminLayout";
import AdminLayout from "../layouts/AdminLayout";
import OfficerLayout from "../layouts/OfficerLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import OfficerPage from "../pages/admin/OfficerPage";
import AdminPage from "../pages/superadmin/AdminPage";
import CustomerPage from "../pages/officer/CustomerPage";
import CreateCustomer from "../pages/customers/CreateCustomer";
import OfficerDashboard from "../pages/officer/OfficerDashboard";
import ViewCustomer from "../pages/customers/ViewCustomer";
import ResetPassword from "../pages/customers/ResetPassword";
import CustomerDashboard from "../pages/customers/CustomerDashboard";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import UpdateCustomer from "../pages/customers/UpdateCustomer";
import LoanList from "../pages/loans/LoanList";
import CreateLoan from "../pages/loans/CreateLoan";
import CreateAccount from "../pages/accounts/CreateAccount";
import AccountList from "../pages/accounts/AccountList";
import TransferMoney from "../pages/customers/transactions";
import AdminLoanApproval from "../pages/admin/AdminLoanApproval";
import OfficerLoanApproval from "../pages/officer/OfficerLoanApproval";
import CustomerAccounts from "../pages/accounts/CustomerAccounts";
import LoanDetails from "../pages/loans/LoanDetails";
import AdminFreezeAccount from "../pages/admin/AdminFreezeAccount";
import CustomerApplyLoan from "../components/loans/CustomerApplyLoan";
import OfficerTeller from "../pages/accounts/OfficerTeller";
import AdminKycVerification from "../pages/admin/AdminKycVerification";
import CustomerCards from "../pages/Cards/CustomerCards";
import RaiseTicket from "../pages/Tickets/RaiseTicket";
import OfficerIssueCard from "../pages/Cards/OfficerIssueCard";
import OfficerTickets from "../pages/Tickets/OfficerTickets";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Super-Admin Routings */}
            <Route path="/superadmin"
                element={
                    <ProtectedRoute roles={["SUPER_ADMIN"]}>
                        <SuperAdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="admins" element={<AdminPage />} />
            </Route>

            {/* Admin Routings */}
            <Route path="/admin"
                element={
                    <ProtectedRoute roles={["ADMIN"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="officers" element={<OfficerPage />} />
                {/* <Route path="loans" element={<LoanList />} /> */}
                <Route path="loan-approvals" element={<AdminLoanApproval />} />
                <Route path="accounts" element={<AdminFreezeAccount />} />
                <Route path="kyc" element={<AdminKycVerification />} />
            </Route>

            {/* Officer Routings */}
            <Route
                path="/officer"
                element={
                    <ProtectedRoute roles={["OFFICER"]}>
                        <OfficerLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<OfficerDashboard />} />
                <Route path="dashboard" element={<OfficerDashboard />} />
                <Route path="customers" element={<CustomerPage />} />
                <Route path="create-customer" element={<CreateCustomer />} />

                <Route path="customer/edit/:id" element={<UpdateCustomer />} />

                <Route path="customers/:id" element={<ViewCustomer />} />
                <Route path="customers/:id/create-account" element={<CreateAccount />} />
                <Route path="customers/:id/create-loan" element={<CreateLoan />} />

                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="customers/edit/:id" element={<UpdateCustomer />} />
                {/* <Route path="loans" element={<LoanList />} /> */}
                {/* <Route path="create-loan" element={<CreateLoan />} /> */}
                <Route path="accounts" element={<AccountList />} />
                {/* <Route path="create-account" element={<CreateAccount />} /> */}
                <Route path="loan-approvals" element={<OfficerLoanApproval />} />
                <Route path="customers/:id/teller" element={<OfficerTeller />} />
                <Route path="customers/:id/issue-card" element={<OfficerIssueCard />} />
                <Route path="tickets" element={<OfficerTickets />} />

            </Route>

            {/* Customer Routings */}
            <Route
                path="/customer"
                element={
                    <ProtectedRoute roles={["CUSTOMER"]}>
                        <CustomerLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="transfer" element={<TransferMoney />} />
                <Route path="accounts" element={<CustomerAccounts />} />
                <Route path="loans" element={<LoanList />} />
                <Route path="loans/:loanId" element={<LoanDetails />} />
                <Route path="apply-loan" element={<CustomerApplyLoan />} />
                <Route path="cards" element={<CustomerCards />} />
                <Route path="support" element={<RaiseTicket />} />

            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
    )
}