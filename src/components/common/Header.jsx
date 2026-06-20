import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../app/authSlice";
import { Menu } from "lucide-react";

export default function Header({ isOpen, setIsOpen, title, theme }) {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="flex justify-between items-center
                        px-4 sm:px-6 py-3 sm:py-4
                        bg-white border-b border-amber-200 shadow-sm
                        sticky top-0 z-20">

            <div className="flex items-center gap-3">
                {/* ✅ Hamburger — lucide icon, cleaner */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl text-amber-800
                               hover:bg-amber-50 hover:text-orange-600
                               transition-colors duration-150"
                    aria-label="Toggle menu"
                >
                    <Menu size={22} />
                </button>

                <h1 className="text-base sm:text-lg font-semibold text-amber-900 truncate">
                    Dashboard
                </h1>
            </div>

            <button
                onClick={handleLogout}
                className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800
                           text-white text-sm font-medium
                           px-3 sm:px-4 py-2 rounded-lg
                           transition-colors duration-150
                           whitespace-nowrap">
                Logout
            </button>
        </div>
    );
}