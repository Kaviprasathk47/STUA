// Sidebar.jsx - Route-aware sidebar
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  Sprout,
  Settings,
  Lightbulb,
  X,
  Car,
  Trophy,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../ui/Logo";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Trips", path: "/trips", icon: MapPin },
    { name: "My Vehicles", path: "/vehicles", icon: Car },
    { name: "Analysis", path: "/analysis", icon: BarChart3 },
    { name: "Sustainability", path: "/sustainability", icon: Sprout },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full bg-linear-to-b from-slate-950 to-slate-900
          border-r border-slate-800/50
          transition-all duration-300

          w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
          ${isOpen ? "lg:w-64" : "lg:w-16"}
          lg:top-16 lg:h-[calc(100vh-4rem)]
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-slate-800/50 flex items-center gap-3">
          <Logo size="default" />
          {isOpen && (
            <div>
              <h2 className="text-white font-bold text-lg">STUA</h2>
              <p className="text-slate-400 text-xs">Dashboard</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `
                    relative w-full flex items-center rounded-xl
                    transition-all duration-200 group
                    ${isOpen ? "gap-3 px-4 py-3" : "justify-center py-3"}
                    ${isActive
                    ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }
                  `
                }
              >
                <Icon className={`w-5 h-5 ${item.name === 'Dashboard' ? '' : ''}`} />

                {isOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}

                {/* Tooltip when collapsed */}
                {!isOpen && (
                  <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10 border border-slate-700">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Tip (only open) */}
        {isOpen && (
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-medium">
                  Cycling twice a week can save ~2kg of CO₂ 🌱
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
