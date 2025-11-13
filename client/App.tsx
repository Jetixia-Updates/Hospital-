import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import LabTechDashboard from "./pages/LabTechDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AppointmentsPage from "./pages/AppointmentsPage";
import PatientsPage from "./pages/PatientsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ClinicsPage from "./pages/ClinicsPage";
import EquipmentPage from "./pages/EquipmentPage";
import LabTestsPage from "./pages/LabTestsPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import AppointmentNew from "./pages/AppointmentNew";
import PatientNew from "./pages/PatientNew";
import DepartmentNew from "./pages/DepartmentNew";
import ClinicNew from "./pages/ClinicNew";
import EquipmentNew from "./pages/EquipmentNew";
import LabTestNew from "./pages/LabTestNew";
import MedicalRecordNew from "./pages/MedicalRecordNew";
import { Placeholder } from "./pages/Placeholder";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/manager"
              element={
                <ProtectedRoute>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/doctor"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/nurse"
              element={
                <ProtectedRoute>
                  <NurseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/receptionist"
              element={
                <ProtectedRoute>
                  <ReceptionistDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lab"
              element={
                <ProtectedRoute>
                  <LabTechDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/pharmacist"
              element={
                <ProtectedRoute>
                  <PharmacistDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/patient"
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/departments"
              element={
                <ProtectedRoute>
                  <DepartmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clinics"
              element={
                <ProtectedRoute>
                  <ClinicsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment"
              element={
                <ProtectedRoute>
                  <EquipmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab"
              element={
                <ProtectedRoute>
                  <LabTestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <MedicalRecordsPage />
                </ProtectedRoute>
              }
            />

            {/* New/Create Routes */}
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <AppointmentNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/new"
              element={
                <ProtectedRoute>
                  <PatientNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/departments/new"
              element={
                <ProtectedRoute>
                  <DepartmentNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clinics/new"
              element={
                <ProtectedRoute>
                  <ClinicNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/new"
              element={
                <ProtectedRoute>
                  <EquipmentNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab-tests/new"
              element={
                <ProtectedRoute>
                  <LabTestNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-records/new"
              element={
                <ProtectedRoute>
                  <MedicalRecordNew />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Placeholder
                    title="Profile"
                    description="View and manage your user profile and account settings."
                  />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
