import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Activity, Heart, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NurseDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayPatients: 0,
    activeTasks: 0,
    vitalsChecks: 0,
    medications: 0,
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
          todayPatients: appData.total || 0,
          activeTasks: 8,
          vitalsChecks: 12,
          medications: 15,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const tasks = [
    { id: 1, patient: "John Doe", task: "Vitals check", priority: "high", time: "09:00 AM" },
    { id: 2, patient: "Sarah Smith", task: "Medication administration", priority: "high", time: "09:30 AM" },
    { id: 3, patient: "Mike Johnson", task: "Wound dressing", priority: "medium", time: "10:00 AM" },
    { id: 4, patient: "Emily Davis", task: "Pre-op preparation", priority: "high", time: "10:30 AM" },
  ];

  const vitals = [
    { patient: "John Doe", bp: "120/80", temp: "98.6°F", pulse: "72", status: "normal" },
    { patient: "Sarah Smith", bp: "130/85", temp: "99.1°F", pulse: "78", status: "attention" },
    { patient: "Mike Johnson", bp: "118/75", temp: "98.4°F", pulse: "68", status: "normal" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
            <p className="text-gray-600 mt-1">Patient care and vital monitoring</p>
          </div>
          <Heart className="h-12 w-12 text-pink-600" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Patients</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayPatients}</div>
              <p className="text-xs opacity-80 mt-1">Under care today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Clock className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeTasks}</div>
              <p className="text-xs opacity-80 mt-1">Pending completion</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vitals Checks</CardTitle>
              <Activity className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.vitalsChecks}</div>
              <p className="text-xs opacity-80 mt-1">Completed today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Medications</CardTitle>
              <AlertCircle className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.medications}</div>
              <p className="text-xs opacity-80 mt-1">Administered today</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-pink-600" />
                Priority Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{task.patient}</p>
                      <p className="text-sm text-gray-600">{task.task}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={task.priority === "high" ? "destructive" : "default"}>
                        {task.priority}
                      </Badge>
                      <span className="text-sm text-gray-500">{task.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" />
                Recent Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vitals.map((vital, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{vital.patient}</p>
                      <Badge variant={vital.status === "normal" ? "default" : "destructive"}>
                        {vital.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">BP</p>
                        <p className="font-medium">{vital.bp}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Temp</p>
                        <p className="font-medium">{vital.temp}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pulse</p>
                        <p className="font-medium">{vital.pulse}</p>
                      </div>
                    </div>
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
              <Button onClick={() => navigate("/patients")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="h-6 w-6 text-pink-600" />
                <span className="font-medium">Patient List</span>
                <span className="text-xs text-gray-500">View all patients</span>
              </Button>
              
              <Button onClick={() => navigate("/vitals")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Activity className="h-6 w-6 text-teal-600" />
                <span className="font-medium">Record Vitals</span>
                <span className="text-xs text-gray-500">Log vital signs</span>
              </Button>
              
              <Button onClick={() => navigate("/medications")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <AlertCircle className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Medications</span>
                <span className="text-xs text-gray-500">Administer meds</span>
              </Button>
              
              <Button onClick={() => navigate("/appointments")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Schedule</span>
                <span className="text-xs text-gray-500">View schedule</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Patient Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-red-700">
              <p>• Sarah Smith - Elevated blood pressure requires monitoring</p>
              <p>• Room 204 - Medication due in 15 minutes</p>
              <p>• Emily Davis - Pre-op checklist incomplete</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
