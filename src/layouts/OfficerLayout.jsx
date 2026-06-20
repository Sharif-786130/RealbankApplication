import { useRoleTheme } from "../hooks/useRoleTheme";
import RoleLayout from "./RoleLayout";

export default function OfficerLayout() {

    const theme = useRoleTheme();

    // ✅ Updated menu with all tabs
    const officerMenuItems = [
        { label: "Dashboard", path: "dashboard" },
        { label: "Customers", path: "customers" },
        { label: "Accounts", path: "accounts" },        // ← accounts
        // { label: "Create Account", path: "create-account" }, // ← create account
        // { label: "Loans", path: "loans" },              // ← loans
        // { label: "Create Loan", path: "create-loan" },  // ← create loan
        { label: "Loan Approvals", path: "loan-approvals" },
    ];

    return (
        <RoleLayout
            menuItems={officerMenuItems}
            title="Officer Dashboard"
        />
    );
}