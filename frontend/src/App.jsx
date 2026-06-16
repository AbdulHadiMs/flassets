import { BrowserRouter, Routes, Route, Navigate }
from "react-router-dom";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Assets from "./pages/assets/Assets";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;