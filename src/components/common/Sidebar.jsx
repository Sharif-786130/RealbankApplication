import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

function Sidebar({ isOpen, setIsOpen, menuItems = [], theme }) {
    return (
        <>
            {/* ✅ Overlay — closes sidebar on mobile tap */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                />
            )}

            <div className={`
                fixed top-0 left-0 h-full w-64 shadow-xl z-40
                flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                ${theme?.sidebarBg ?? "bg-amber-100 border-r border-amber-200"}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/20">
                    <div>
                        <h2 className={`text-lg font-bold ${theme?.sidebarText ?? "text-amber-900"}`}>
                            🏦 Bank System
                        </h2>
                        <p className={`text-xs mt-0.5 opacity-70 ${theme?.sidebarText ?? "text-amber-900"}`}>
                            Management Portal
                        </p>
                    </div>
                    {/* ✅ Close button — visible on mobile */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className={`p-1.5 rounded-lg hover:bg-white/20 transition
                                    ${theme?.sidebarText ?? "text-amber-900"}`}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === "dashboard"}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-xl
                                         text-sm font-medium transition-all duration-150
                                         ${isActive
                                            ? (theme?.activeNav ?? "bg-amber-600 text-white shadow-sm")
                                            : (theme?.inactiveNav ?? "text-amber-900 hover:bg-amber-200")
                                         }`
                                    }
                                >
                                    {item.icon && <item.icon size={16} />}
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className={`px-5 py-4 border-t border-white/20 text-xs
                                 opacity-50 ${theme?.sidebarText ?? "text-amber-900"}`}>
                    Bank Management System v1.0
                </div>
            </div>
        </>
    );
}

export default Sidebar;