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
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full bg-linear-to-b from-emerald-600 via-teal-600 to-blue-600
          shadow-2xl transition-all duration-300

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
          className="lg:hidden absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Logo size="default" />
          {isOpen && (
            <div>
              <h2 className="text-white font-bold text-lg">STUA</h2>
              <p className="text-emerald-100 text-xs">Dashboard</p>
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
                    ? "bg-white text-emerald-700 shadow-lg"
                    : "text-white hover:bg-white/10"
                  }
                  `
                }
              >
                <Icon className="w-5 h-5" />

                {isOpen && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.name}
                  </span>
                )}

                {/* Tooltip when collapsed */}
                {!isOpen && (
                  <span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
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
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-300" />
                </div>
                <p className="text-emerald-50 text-xs leading-relaxed">
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
