import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Phone, CheckCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    waitingPatients: 0,
    newRegistrations: 0,
    callsHandled: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const appointmentsRes = await fetch("/api/v1/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const appData = await appointmentsRes.json();

        setStats({
          todayAppointments: appData.total || 0,
          waitingPatients: 5,
          newRegistrations: 3,
          callsHandled: 24,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const appointments = [
    { id: 1, patient: "John Doe", time: "09:00 AM", doctor: "Dr. Smith", status: "checked-in" },
    { id: 2, patient: "Sarah Johnson", time: "09:30 AM", doctor: "Dr. Brown", status: "waiting" },
    { id: 3, patient: "Mike Wilson", time: "10:00 AM", doctor: "Dr. Smith", status: "scheduled" },
    { id: 4, patient: "Emily Davis", time: "10:30 AM", doctor: "Dr. Jones", status: "scheduled" },
  ];

  const waitingList = [
    { name: "Sarah Johnson", waitTime: "15 min", purpose: "Cardiology Checkup" },
    { name: "Robert Lee", waitTime: "25 min", purpose: "Follow-up Visit" },
    { name: "Amanda White", waitTime: "10 min", purpose: "Lab Results" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Receptionist Dashboard</h1>
            <p className="text-gray-600 mt-1">Front desk operations and patient management</p>
          </div>
          <Phone className="h-12 w-12 text-indigo-600" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs opacity-80 mt-1">Scheduled today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Waiting Patients</CardTitle>
              <Clock className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.waitingPatients}</div>
              <p className="text-xs opacity-80 mt-1">Currently waiting</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
              <UserPlus className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.newRegistrations}</div>
              <p className="text-xs opacity-80 mt-1">Today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Calls Handled</CardTitle>
              <Phone className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.callsHandled}</div>
              <p className="text-xs opacity-80 mt-1">Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{apt.patient}</p>
                      <p className="text-sm text-gray-600">{apt.doctor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        apt.status === "checked-in" ? "default" :
                        apt.status === "waiting" ? "destructive" : "outline"
                      }>
                        {apt.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{apt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Waiting List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Waiting List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {waitingList.map((patient, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.purpose}</p>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {patient.waitTime}
                    </Badge>
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
              <Button onClick={() => navigate("/appointments/new")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6 text-indigo-600" />
                <span className="font-medium">Book Appointment</span>
                <span className="text-xs text-gray-500">Schedule new visit</span>
              </Button>
              
              <Button onClick={() => navigate("/patients/register")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <UserPlus className="h-6 w-6 text-green-600" />
                <span className="font-medium">Register Patient</span>
                <span className="text-xs text-gray-500">New patient entry</span>
              </Button>
              
              <Button onClick={() => navigate("/patients")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Patient Records</span>
                <span className="text-xs text-gray-500">View all patients</span>
              </Button>
              
              <Button onClick={() => navigate("/check-in")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <CheckCircle className="h-6 w-6 text-teal-600" />
                <span className="font-medium">Check-In</span>
                <span className="text-xs text-gray-500">Patient arrival</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Phone className="h-5 w-5" />
              Important Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Dr. Smith's clinic starting at 9:00 AM</p>
              <p>• Emergency contact: Extension 911</p>
              <p>• Reminder: Update patient insurance information</p>
              <p>• 3 patients waiting for check-in</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
