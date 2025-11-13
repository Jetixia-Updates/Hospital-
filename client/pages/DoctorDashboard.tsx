import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, FileText, Users, Stethoscope, ClipboardList, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingRecords: 0,
    completedToday: 0,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const [appointmentsRes, patientsRes, recordsRes] = await Promise.all([
          fetch("/api/v1/appointments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/users?role=PATIENT", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/records", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const appData = await appointmentsRes.json();
        const patData = await patientsRes.json();
        const recData = await recordsRes.json();

        setStats({
          todayAppointments: appData.total || 0,
          totalPatients: patData.total || 0,
          pendingRecords: 3,
          completedToday: 5,
        });

        if (appData.data) {
          setUpcomingAppointments(appData.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const weeklyData = [
    { day: "Mon", patients: 8 },
    { day: "Tue", patients: 12 },
    { day: "Wed", patients: 10 },
    { day: "Thu", patients: 15 },
    { day: "Fri", patients: 11 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-1">Patient care and medical management</p>
          </div>
          <Stethoscope className="h-12 w-12 text-teal-600" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs opacity-80 mt-1">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Patients</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs opacity-80 mt-1">Under my care</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Records</CardTitle>
              <FileText className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingRecords}</div>
              <p className="text-xs opacity-80 mt-1">Need completion</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <UserCheck className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedToday}</div>
              <p className="text-xs opacity-80 mt-1">Consultations done</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Patient Load</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((apt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{apt.patientName || "Patient"}</p>
                        <p className="text-sm text-gray-600">{apt.reason || "Consultation"}</p>
                      </div>
                      <Badge variant="outline">{apt.time || "10:00 AM"}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No appointments scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => navigate("/appointments")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Calendar className="h-6 w-6 text-teal-600" />
                  <span className="font-medium">Appointments</span>
                </Button>
                
                <Button onClick={() => navigate("/patients")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">My Patients</span>
                </Button>
                
                <Button onClick={() => navigate("/records")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  <span className="font-medium">Medical Records</span>
                </Button>
                
                <Button onClick={() => navigate("/prescriptions")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <ClipboardList className="h-6 w-6 text-green-600" />
                  <span className="font-medium">Prescriptions</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-teal-500 pl-4 py-2">
                <p className="font-medium">Patient: John Doe</p>
                <p className="text-sm text-gray-600">Follow-up required in 2 weeks. Monitor blood pressure.</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium">Patient: Sarah Smith</p>
                <p className="text-sm text-gray-600">Lab results pending. Review before next appointment.</p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
