import { useState } from "react";
import { useRoleTheme } from "../hooks/useRoleTheme";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

export default function RoleLayout({ menuItems = [], title }) {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useRoleTheme();

    return (
        <div className={`flex h-screen h-[100dvh] ${theme.layoutBg}`}>

            <Sidebar
                menuItems={menuItems}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                theme={theme}
            />

            <div className="flex-1 flex flex-col w-full min-w-0 min-h-0">
                <Header
                    title={title}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    theme={theme}
                />
                <div className="p-3 sm:p-6 flex-1 min-h-0 overflow-y-auto">
                    <Outlet />
                </div>
            </div>

        </div>
    );
}