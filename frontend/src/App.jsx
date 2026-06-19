import { BrowserRouter, Routes, Route, Navigate }
  from "react-router-dom";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Assets from "./pages/assets/Assets";
import Categories from "./pages/categories/Categories";
import Vendors from "./pages/vendors/Vendors";
import Locations from "./pages/locations/Locations";
import Employees from "./pages/employees/Employees";
import Allocations from "./pages/allocations/Allocations";
import Reports from "./pages/reports/Reports";
import AssetDetails from "./pages/assets/AssetDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* Public Route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <Vendors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/locations"
          element={
            <ProtectedRoute>
              <Locations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/allocations"
          element={
            <ProtectedRoute>
              <Allocations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/:id"
          element={
            <ProtectedRoute>
              <AssetDetails />
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;