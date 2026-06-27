
import React, { useState } from 'react'
import { useRoleTheme } from "../hooks/useRoleTheme";
import Sidebar from "../components/common/Sidebar";
import Header from '../components/common/Header';
import { Outlet } from 'react-router-dom';
import RoleLayout from './RoleLayout';

export default function SuperAdminLayout() {
   const [isOpen,setIsOpen ] = useState(false);

    const theme = useRoleTheme();


    const superAdminMenuItems = [
        { label: "Dashboard", path: "/superadmin/dashboard" },
        { label: "Manage Admins", path: "/superadmin/admins" },
    ];

    return (

        <RoleLayout
            menuItems={superAdminMenuItems}
            title="Super-admin Dashboard"
        />
    );
}


