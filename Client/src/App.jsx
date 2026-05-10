import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Routes/Login";
import Dashboard from "./Routes/Dashboard/Dashboard";

import EmployeeList from "./Routes/Controls/Employee/EmployeeList"
import CreateEmployee from "./Routes/Controls/Employee/CreateEmployee";
import DepartmentList from "./Routes/Controls/Department/DepartmentList";

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

        {/* fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;