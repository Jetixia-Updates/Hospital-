import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Calendar, Building2, TrendingUp, ClipboardList, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    departmentStaff: 0,
    todayAppointments: 0,
    departmentClinics: 0,
    monthlyPatients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const [staffRes, appointmentsRes, clinicsRes] = await Promise.all([
          fetch("/api/v1/users?role=DOCTOR,NURSE", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/appointments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/clinics", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const staffData = await staffRes.json();
        const appData = await appointmentsRes.json();
        const clinicData = await clinicsRes.json();

        setStats({
          departmentStaff: staffData.total || 0,
          todayAppointments: appData.total || 0,
          departmentClinics: clinicData.total || 0,
          monthlyPatients: appData.total || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const trendData = [
    { name: "Mon", appointments: 12 },
    { name: "Tue", appointments: 19 },
    { name: "Wed", appointments: 15 },
    { name: "Thu", appointments: 22 },
    { name: "Fri", appointments: 18 },
    { name: "Sat", appointments: 10 },
    { name: "Sun", appointments: 8 },
  ];

  const performanceData = [
    { name: "Completed", value: 85, color: "#10b981" },
    { name: "Pending", value: 12, color: "#f59e0b" },
    { name: "Cancelled", value: 3, color: "#ef4444" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">Department operations and staff management</p>
          </div>
          <ClipboardList className="h-12 w-12 text-blue-600" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Department Staff</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.departmentStaff}</div>
              <p className="text-xs opacity-80 mt-1">Active team members</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs opacity-80 mt-1">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clinics</CardTitle>
              <Building2 className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.departmentClinics}</div>
              <p className="text-xs opacity-80 mt-1">Under management</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Patients</CardTitle>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.monthlyPatients}</div>
              <p className="text-xs opacity-80 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Appointment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Department Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button onClick={() => navigate("/staff")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <UserCheck className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Staff Schedule</span>
                <span className="text-xs text-gray-500">Manage shifts and schedules</span>
              </Button>
              
              <Button onClick={() => navigate("/departments")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Building2 className="h-6 w-6 text-green-600" />
                <span className="font-medium">Department Info</span>
                <span className="text-xs text-gray-500">Update department details</span>
              </Button>
              
              <Button onClick={() => navigate("/clinics")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Clinic Operations</span>
                <span className="text-xs text-gray-500">Manage clinic activities</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
