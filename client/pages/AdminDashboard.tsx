import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Calendar, Building2, Activity, Settings, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalDepartments: 0,
    totalClinics: 0,
    activeStaff: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const [usersRes, appointmentsRes, deptRes, clinicsRes, patientsRes] = await Promise.all([
          fetch("/api/v1/users", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/appointments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/departments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/clinics", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/users?role=PATIENT", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const userData = await usersRes.json();
        const appData = await appointmentsRes.json();
        const deptData = await deptRes.json();
        const clinicData = await clinicsRes.json();
        const patData = await patientsRes.json();

        setStats({
          totalUsers: userData.total || 0,
          totalAppointments: appData.total || 0,
          totalDepartments: deptData.total || 0,
          totalClinics: clinicData.total || 0,
          activeStaff: (userData.total || 0) - (patData.total || 0),
          totalPatients: patData.total || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Users", count: stats.totalUsers },
    { name: "Patients", count: stats.totalPatients },
    { name: "Staff", count: stats.activeStaff },
    { name: "Departments", count: stats.totalDepartments },
    { name: "Clinics", count: stats.totalClinics },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">System-wide management and control</p>
          </div>
          <Shield className="h-12 w-12 text-red-600" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs opacity-80 mt-1">All system users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Activity className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs opacity-80 mt-1">Registered patients</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeStaff}</div>
              <p className="text-xs opacity-80 mt-1">Doctors, nurses, staff</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDepartments}</div>
              <p className="text-xs opacity-80 mt-1">Hospital departments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clinics</CardTitle>
              <Building2 className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalClinics}</div>
              <p className="text-xs opacity-80 mt-1">Specialty clinics</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs opacity-80 mt-1">Total bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* System Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Administration Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button onClick={() => navigate("/users")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Manage Users</span>
                <span className="text-xs text-gray-500">Add, edit, or remove users</span>
              </Button>
              
              <Button onClick={() => navigate("/departments")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Building2 className="h-6 w-6 text-green-600" />
                <span className="font-medium">Departments</span>
                <span className="text-xs text-gray-500">Manage hospital departments</span>
              </Button>
              
              <Button onClick={() => navigate("/clinics")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Building2 className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Clinics</span>
                <span className="text-xs text-gray-500">Manage specialty clinics</span>
              </Button>
              
              <Button onClick={() => navigate("/equipment")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Activity className="h-6 w-6 text-orange-600" />
                <span className="font-medium">Equipment</span>
                <span className="text-xs text-gray-500">Track medical equipment</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• All systems operational</p>
              <p>• Database backup: Last run 2 hours ago</p>
              <p>• {stats.activeStaff} staff members currently active</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
