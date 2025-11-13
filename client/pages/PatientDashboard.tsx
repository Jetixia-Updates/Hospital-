import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Activity, Pill, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    medicalRecords: 0,
    activePrescriptions: 0,
    pendingTests: 0,
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const [userRes, appointmentsRes, recordsRes, prescriptionsRes] = await Promise.all([
          fetch("/api/v1/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/appointments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/records", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/prescriptions", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const userData = await userRes.json();
        const appData = await appointmentsRes.json();
        const recData = await recordsRes.json();
        const prescData = await prescriptionsRes.json();

        setUser(userData);
        setStats({
          upcomingAppointments: appData.total || 0,
          medicalRecords: recData.total || 0,
          activePrescriptions: prescData.total || 0,
          pendingTests: 2,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const upcomingAppointments = [
    { id: 1, date: "Nov 15, 2025", time: "10:00 AM", doctor: "Dr. Sarah Johnson", department: "Cardiology", type: "Follow-up" },
    { id: 2, date: "Nov 20, 2025", time: "2:00 PM", doctor: "Dr. Michael Smith", department: "General Medicine", type: "Check-up" },
  ];

  const prescriptions = [
    { medication: "Lisinopril 10mg", dosage: "Once daily", refills: 2, expires: "Dec 15, 2025" },
    { medication: "Metformin 850mg", dosage: "Twice daily", refills: 3, expires: "Jan 10, 2026" },
  ];

  const recentRecords = [
    { date: "Nov 5, 2025", doctor: "Dr. Johnson", diagnosis: "Hypertension - Stable", notes: "Continue current medication" },
    { date: "Oct 20, 2025", doctor: "Dr. Smith", diagnosis: "Annual Physical", notes: "All tests normal" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Health Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.firstName || "Patient"}!</p>
          </div>
          <Heart className="h-12 w-12 text-rose-600" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.upcomingAppointments}</div>
              <p className="text-xs opacity-80 mt-1">Scheduled visits</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.medicalRecords}</div>
              <p className="text-xs opacity-80 mt-1">Total records</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <Pill className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activePrescriptions}</div>
              <p className="text-xs opacity-80 mt-1">Current medications</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
              <Activity className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingTests}</div>
              <p className="text-xs opacity-80 mt-1">Lab results pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-lg">{apt.date}</p>
                      <Badge variant="outline">{apt.time}</Badge>
                      <Badge>{apt.type}</Badge>
                    </div>
                    <p className="font-medium text-gray-900">{apt.doctor}</p>
                    <p className="text-sm text-gray-600">{apt.department}</p>
                  </div>
                  <Button onClick={() => navigate(`/appointments/${apt.id}`)}>View Details</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-emerald-600" />
                Active Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prescriptions.map((presc, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="font-medium text-gray-900">{presc.medication}</p>
                    <p className="text-sm text-gray-600">{presc.dosage}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Refills: {presc.refills}</span>
                      <span className="text-xs text-gray-500">Expires: {presc.expires}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Medical Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Recent Medical Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRecords.map((record, idx) => (
                  <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{record.diagnosis}</p>
                      <span className="text-xs text-gray-500">{record.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">Doctor: {record.doctor}</p>
                    <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Button onClick={() => navigate("/appointments/book")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Book Appointment</span>
                <span className="text-xs text-gray-500">Schedule a visit</span>
              </Button>
              
              <Button onClick={() => navigate("/records")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                <span className="font-medium">View Records</span>
                <span className="text-xs text-gray-500">Medical history</span>
              </Button>
              
              <Button onClick={() => navigate("/prescriptions")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Pill className="h-6 w-6 text-emerald-600" />
                <span className="font-medium">Prescriptions</span>
                <span className="text-xs text-gray-500">View medications</span>
              </Button>
              
              <Button onClick={() => navigate("/profile")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <User className="h-6 w-6 text-orange-600" />
                <span className="font-medium">My Profile</span>
                <span className="text-xs text-gray-500">Update info</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Health Tips */}
        <Card className="border-teal-200 bg-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Heart className="h-5 w-5" />
              Health Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-teal-700">
              <p>• Remember to take your morning medication</p>
              <p>• Next appointment in 3 days - Dr. Sarah Johnson</p>
              <p>• Annual physical exam due in 2 months</p>
              <p>• Lab results will be available in 2 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
