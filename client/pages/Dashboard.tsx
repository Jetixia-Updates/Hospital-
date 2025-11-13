import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, Calendar, FileText, Activity } from "lucide-react";

const chartData = [
  { name: "Jan", appointments: 65, patients: 43 },
  { name: "Feb", appointments: 75, patients: 52 },
  { name: "Mar", appointments: 82, patients: 68 },
  { name: "Apr", appointments: 95, patients: 71 },
  { name: "May", appointments: 110, patients: 89 },
  { name: "Jun", appointments: 125, patients: 104 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    appointmentCount: 0,
    patientCount: 0,
    departmentCount: 0,
    clinicCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const [appointmentsRes, patientsRes, deptRes, clinicsRes] = await Promise.all([
          fetch("/api/v1/appointments?take=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/v1/users?role=PATIENT&take=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/v1/departments?take=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/v1/clinics?take=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const appData = await appointmentsRes.json();
        const patData = await patientsRes.json();
        const deptData = await deptRes.json();
        const clinicData = await clinicsRes.json();

        setStats({
          appointmentCount: appData.total || 0,
          patientCount: patData.total || 0,
          departmentCount: deptData.total || 0,
          clinicCount: clinicData.total || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appointmentCount}</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.patientCount}</div>
              <p className="text-xs text-gray-500">Active patients</p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.departmentCount}</div>
              <p className="text-xs text-gray-500">Total departments</p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clinics</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clinicCount}</div>
              <p className="text-xs text-gray-500">Total clinics</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointments & Patients Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="appointments" fill="#2563eb" />
                  <Bar dataKey="patients" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    dot={{ fill: "#14b8a6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/appointments")}
                className="p-4 text-center border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-sm">Manage Appointments</p>
              </button>
              <button
                onClick={() => navigate("/patients")}
                className="p-4 text-center border border-gray-200 rounded-lg hover:bg-teal-50 transition-colors"
              >
                <Users className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                <p className="font-medium text-sm">View Patients</p>
              </button>
              <button
                onClick={() => navigate("/lab")}
                className="p-4 text-center border border-gray-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Activity className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="font-medium text-sm">Lab Tests</p>
              </button>
              <button
                onClick={() => navigate("/records")}
                className="p-4 text-center border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <FileText className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="font-medium text-sm">Medical Records</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
