import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Laptop,
  Users,
  Building2,
  ShieldCheck,
  Wrench,
  ShoppingCart,
  AppWindow,
  Ticket,
  PackageOpen,
  Store,
  ChevronsRight,
  ChevronsLeft,
  User,
  LogOut,

} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    icon: <BarChart3 size={18} />,
    label: "Dashboard",
    href: "/Dashboard",
  },
  {
    id: "equipment",
    icon: <Laptop size={18} />,
    label: "Equipment",
    href: "/Equipment/List",
  },
  {
    id: "employee",
    icon: <Users size={18} />,
    label: "Employee",
    href: "/Employee/list",
  },
  {
    id: "department",
    icon: <Building2 size={18} />,
    label: "Department",
    href: "/Department/list",
  },
  {
    id: "access",
    icon: <ShieldCheck size={18} />,
    label: "Access",
    href: "/Access/list",
  },
  {
    id: "maintenance",
    icon: <Wrench size={18} />,
    label: "Maintenance",
    href: "/Maintenance/list",
  },
  {
    id: "purchase",
    icon: <ShoppingCart size={18} />,
    label: "Purchase",
    href: "/Purchase/list",
  },
  {
    id: "software",
    icon: <AppWindow size={18} />,
    label: "Software",
    href: "/Software/list",
  },
  {
    id: "token",
    icon: <Ticket size={18} />,
    label: "Token",
    href: "/Token/list",
  },
  {
    id: "takeout",
    icon: <PackageOpen size={18} />,
    label: "Takeout",
    href: "/Takeout/list",
  },
];

export function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const employeeProfile = JSON.parse(localStorage.getItem("employeeProfile"));

  const handleMenuClick = (href) => {
    navigate(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    // 1. ลบข้อมูล Auth ตัวหลัก
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    localStorage.removeItem("employeeProfile");    
    localStorage.removeItem("sidebarCollapsed");
    
    navigate("/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-100 z-40 flex flex-col overflow-visible transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-40"
          } ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Top Section */}
        <div
          className={`h-12 flex items-center border-b border-slate-100 transition-all duration-300 ${isCollapsed ? "justify-end px-4" : "pl-5"
            }`}
        >
          <img
            src="/logo.png"
            alt="ETRIA"
            className={`mt-1 object-contain transition-all duration-300 flex-shrink-0 overflow-hidden ${isCollapsed ? "w-0 opacity-0" : "h-10 max-w-[140px] opacity-100"
              }`}
          />

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors flex-shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <ChevronsLeft size={18} />
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = currentPath === item.href;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.href)}
                title={isCollapsed ? item.label : ""}
                className={`relative w-full flex items-center gap-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group overflow-hidden ${isCollapsed ? "justify-center px-0" : "px-3"
                  } ${isActive
                    ? "bg-red-50 text-red-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-red-600 rounded-r-full" />
                )}

                <span
                  className={`flex-shrink-0 ${isActive
                    ? "text-red-600"
                    : "text-slate-400 group-hover:text-slate-600"
                    }`}
                >
                  {item.icon}
                </span>

                <span
                  className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
                    }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer - User Profile */}
        <div className="border-t border-slate-100 p-3 overflow-visible">
          <div className="relative overflow-visible">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={`w-full flex items-center gap-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors group hover:bg-slate-50 ${isCollapsed ? "justify-center px-0" : "px-3"
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold tracking-wide shadow-sm shadow-red-200 flex-shrink-0">
                AD
              </div>

              <div
                className={`flex-1 text-left transition-all duration-300 overflow-hidden ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
                  }`}
              >
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  {employeeProfile.EmpCode.split('-', 1)}

                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {employeeProfile.DepCode.split("-", 1)}-{employeeProfile.DepShort}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div
                className="absolute w-44 bg-white border border-slate-300 rounded-md shadow-lg shadow-slate-600/50 overflow-hidden z-50 left-full bottom-0 ml-2"
              >
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-sm font-semibold text-slate-800">
                    {employeeProfile.EmpName + "." + employeeProfile.EmpSurname[0]}
                  </p>
                  <p className="text-xs text-slate-400">{employeeProfile.DepCode.split("-", 1)} - {employeeProfile.DepShort}</p>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <User size={16} className="text-slate-400" />
                    My Profile
                  </button>
                </div>

                <div className="border-t border-slate-50 p-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;