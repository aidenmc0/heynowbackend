import { Menu, Bell } from "lucide-react";

export function Navbar({ sidebarOpen, setSidebarOpen, isCollapsed }) {
  return (
    <nav
      className={`fixed top-0 right-0 h-8 bg-white/80 backdrop-blur-md border-b border-slate-100 z-30 transition-all duration-300 ease-in-out ${
        isCollapsed ? "lg:left-16" : "lg:left-40"
      } left-0`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;