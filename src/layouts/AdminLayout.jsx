import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { useState } from "react";
import { useSelector } from "react-redux";
import { roleThemes } from "../theme/roleThemes";
import { useRoleTheme } from "../hooks/useRoleTheme";
import RoleLayout from "./RoleLayout";

export default function AdminLayout() {

    const [isOpen,setIsOpen ] = useState(false);
    // const { role } =useSelector((state) => state.auth);
    // const theme = roleThemes[role];
    const theme = useRoleTheme();

    // const [collapsed, setCollapsed] = useState(false);
    const adminMenuItems = [
        { label: "Dashboard", path: "dashboard" },
        { label: "Manage Officers", path: "officers" },
        // { label: "Customers", path: "customers" },
        { label: "Loan Approvals", path: "loan-approvals" },
    ];

    return (
     
        <RoleLayout
            menuItems={adminMenuItems}
            title="Admin Dashboard"
        />
    );
}