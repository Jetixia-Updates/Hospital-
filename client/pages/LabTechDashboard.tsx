import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FlaskConical, Clock, CheckCircle, AlertTriangle, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LabTechDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingTests: 0,
    completedToday: 0,
    urgentTests: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const labTestsRes = await fetch("/api/v1/lab-tests", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const labData = await labTestsRes.json();

        setStats({
          pendingTests: 8,
          completedToday: 15,
          urgentTests: 3,
          totalPatients: labData.total || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const testQueue = [
    { id: 1, patient: "John Doe", test: "Complete Blood Count", priority: "urgent", status: "pending" },
    { id: 2, patient: "Sarah Smith", test: "Lipid Panel", priority: "routine", status: "pending" },
    { id: 3, patient: "Mike Johnson", test: "Glucose Test", priority: "urgent", status: "in-progress" },
    { id: 4, patient: "Emily Davis", test: "Thyroid Function", priority: "routine", status: "pending" },
  ];

  const recentResults = [
    { patient: "Robert Lee", test: "Urinalysis", result: "Normal", time: "30 min ago" },
    { patient: "Amanda White", test: "Liver Function", result: "Abnormal", time: "1 hour ago" },
    { patient: "David Brown", test: "Kidney Function", result: "Normal", time: "2 hours ago" },
  ];

  const weeklyData = [
    { day: "Mon", tests: 18 },
    { day: "Tue", tests: 22 },
    { day: "Wed", tests: 20 },
    { day: "Thu", tests: 25 },
    { day: "Fri", tests: 19 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lab Technician Dashboard</h1>
            <p className="text-gray-600 mt-1">Laboratory testing and results management</p>
          </div>
          <FlaskConical className="h-12 w-12 text-cyan-600" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
              <Clock className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingTests}</div>
              <p className="text-xs opacity-80 mt-1">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedToday}</div>
              <p className="text-xs opacity-80 mt-1">Tests completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Urgent Tests</CardTitle>
              <AlertTriangle className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.urgentTests}</div>
              <p className="text-xs opacity-80 mt-1">High priority</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs opacity-80 mt-1">Tested this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Test Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tests" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-cyan-600" />
                Test Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testQueue.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{test.patient}</p>
                      <p className="text-sm text-gray-600">{test.test}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        test.priority === "urgent" ? "destructive" : "outline"
                      }>
                        {test.priority}
                      </Badge>
                      <Badge variant={
                        test.status === "in-progress" ? "default" : "secondary"
                      }>
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentResults.map((result, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{result.patient}</p>
                      <Badge variant={result.result === "Normal" ? "default" : "destructive"}>
                        {result.result}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{result.test}</p>
                    <p className="text-xs text-gray-500 mt-1">{result.time}</p>
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
              <Button onClick={() => navigate("/lab/new")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <FlaskConical className="h-6 w-6 text-cyan-600" />
                <span className="font-medium">New Test</span>
                <span className="text-xs text-gray-500">Create lab order</span>
              </Button>
              
              <Button onClick={() => navigate("/lab/results")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                <span className="font-medium">Enter Results</span>
                <span className="text-xs text-gray-500">Record test outcomes</span>
              </Button>
              
              <Button onClick={() => navigate("/lab/pending")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Clock className="h-6 w-6 text-orange-600" />
                <span className="font-medium">Pending Tests</span>
                <span className="text-xs text-gray-500">View queue</span>
              </Button>
              
              <Button onClick={() => navigate("/lab/history")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Test History</span>
                <span className="text-xs text-gray-500">Patient records</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Alerts */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Urgent Test Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-red-700">
              <p>• John Doe - CBC test marked URGENT - Process immediately</p>
              <p>• Mike Johnson - Glucose test in progress - Expected in 15 mins</p>
              <p>• Equipment calibration due in 2 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
