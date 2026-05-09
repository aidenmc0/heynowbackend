import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Routes/Login";
import Dashboard from "./Routes/Dashboard/Dashboard";
import EquipmentList from "./Routes/Equipment/EquipmentList";

import EmployeeList from "./Routes/Controls/Employee/EmployeeList";
import CreateEmployee from "./Routes/Controls/Employee/CreateEmployee";
import DepartmentList from "./Routes/Controls/Department/DepartmentList";
import AccessList from "./Routes/Controls/Access/AccessList";

import SoftwareList from "./Routes/Software/SoftwareList";
import MaintenanceList from "./Routes/Maintenance/MaintenanceList";
import PurchaseList from "./Routes/Purchase/PurchaseList";
import TokenList from "./Routes/Token/TokenList";
import TakeoutList from "./Routes/Takeout/TakeoutEquipmentList";
import VendorList from "./Routes/Vendor/VendorList";

const isAuthenticated = () => !!localStorage.getItem("token");

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated()
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />

        {/* Employee */}
        <Route path="/employee/list" element={<PrivateRoute> <EmployeeList /> </PrivateRoute>} />
        <Route path="/employee/create" element={<PrivateRoute> <CreateEmployee /> </PrivateRoute>} />

        {/* Department */}
        <Route path="/department/list" element={<PrivateRoute> <DepartmentList /> </PrivateRoute>} />

        {/* Access */}
        <Route path="/access/list" element={<PrivateRoute> <AccessList /> </PrivateRoute>} />

        {/* Equipment */}
        <Route path="/equipment/list" element={<PrivateRoute> <EquipmentList /> </PrivateRoute>} />

        {/* Maintenance */}
        <Route path="/maintenance/list" element={<PrivateRoute> <MaintenanceList /> </PrivateRoute>} />

        {/* Purchase */}
        <Route path="/purchase/list" element={<PrivateRoute> <PurchaseList /> </PrivateRoute>} />

        {/* Software */}
        <Route path="/software/list" element={<PrivateRoute> <SoftwareList />  </PrivateRoute>} />

        {/* Takeout */}
        <Route path="/takeout/list" element={<PrivateRoute> <TakeoutList /> </PrivateRoute>} />

        {/* Token */}
        <Route path="/token/list" element={<PrivateRoute> <TokenList /> </PrivateRoute>} />

        {/* Type Equipment */}
        <Route path="/typeEquipment/list" element={<PrivateRoute>  </PrivateRoute>} />

        {/* Type Maintenance */}
        <Route path="/typeMaintenance/list" element={<PrivateRoute>  </PrivateRoute>} />

        {/* Type Software */}
        <Route path="/typeSoftware/list" element={<PrivateRoute>  </PrivateRoute>} />

        {/* Vendor */}
        <Route path="/vendor/list" element={<PrivateRoute> <VendorList /> </PrivateRoute>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;