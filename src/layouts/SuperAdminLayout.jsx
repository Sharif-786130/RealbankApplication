
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
        // <div className={`flex h-screen  overflow-hidden ${theme.layoutBg}`}>

        //     {/* sidebar */}

        //     <Sidebar
        //         menuItems={menuItems}
        //         isOpen={isOpen}
        //         setIsOpen={setIsOpen}
                
        //     />


        //     {/* main content */}
        //     <div className="flex-1 flex flex-col min-h-screen w-full">

        //         <Header 
        //             isOpen={isOpen}
        //             setIsOpen={setIsOpen}
        //         />

        //         <div className="p-6 flex-1 overflow-auto">
        //             <Outlet />
        //         </div>
        //     </div>

        // </div>

        <RoleLayout
            menuItems={superAdminMenuItems}
            title="Super-admin Dashboard"
        />
    );
}


