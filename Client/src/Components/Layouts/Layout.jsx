import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useLocalStorage } from "../../Utils/useLocalStorage"; 

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useLocalStorage("sidebarCollapsed", false);
  
  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
      />

      <div className="flex pt-8 flex-1 min-h-0">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <main
          className={`flex-1 min-h-0 flex flex-col transition-all duration-300 ease-in-out ${
            isCollapsed ? "lg:pl-16" : "lg:pl-40"
          }`}
        >
          <div className="p-2 md:p-2 flex-1 min-h-0 flex flex-col overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;