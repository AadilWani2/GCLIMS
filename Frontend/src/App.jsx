import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import LabEntryPage from "./pages/LabEntryPage";

import ProtectedRoute from "./routes/ProtectedRoute";

import ReportsPage from "./pages/ReportsPage";
import ReportsHistoryPage from "./pages/ReportsHistoryPage";
import BillingPage from "./pages/BillingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/lab-entry"
            element={<LabEntryPage />}
          />

          <Route
            path="/reports"
            element={<ReportsHistoryPage />}
          />

          <Route
            path="/reports/:patientId"
            element={<ReportsPage />}
          />

          <Route
            path="/billing"
            element={<BillingPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;