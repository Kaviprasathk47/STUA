// Navbar.jsx - Top navigation bar component
import { Menu, User, LogOut, ChevronDown, PanelLeftClose } from 'lucide-react';
import { useAuth } from "../../context/AuthContext.jsx";
import { useState } from 'react';
import Logo from '../ui/Logo';

const Navbar = ({ onMenuClick, sidebarOpen = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.userName || "User";
  const displayEmail = user?.email || "";

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 animate-fade-in">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
            aria-label="Toggle menu"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
            )}
          </button>

          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Logo size="default" className="animate-float" />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-semibold bg-linear-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Sustainable Transport
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">Usage Analyser</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-semibold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                STUA
              </h1>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* User Info */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 hover:bg-slate-50 rounded-lg transition-all group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>

              {/* User Name - Hidden on mobile */}
              <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {displayName}
              </span>

              {/* Dropdown Icon */}
              <ChevronDown className={`hidden md:block w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-scale-in">
                <div className="p-3 bg-linear-to-br from-emerald-50 to-teal-50 border-b border-slate-200">
                  <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
