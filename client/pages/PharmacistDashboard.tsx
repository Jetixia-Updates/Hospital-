import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Pill, Clock, CheckCircle, Users, AlertCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PharmacistDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingPrescriptions: 0,
    dispensedToday: 0,
    lowStockItems: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const prescriptionsRes = await fetch("/api/v1/prescriptions", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const prescData = await prescriptionsRes.json();

        setStats({
          pendingPrescriptions: 6,
          dispensedToday: 23,
          lowStockItems: 4,
          totalPatients: prescData.total || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const prescriptionQueue = [
    { id: 1, patient: "John Doe", medication: "Amoxicillin 500mg", quantity: "30 tablets", priority: "high" },
    { id: 2, patient: "Sarah Smith", medication: "Metformin 850mg", quantity: "60 tablets", priority: "routine" },
    { id: 3, patient: "Mike Johnson", medication: "Lisinopril 10mg", quantity: "30 tablets", priority: "high" },
    { id: 4, patient: "Emily Davis", medication: "Atorvastatin 20mg", quantity: "30 tablets", priority: "routine" },
  ];

  const lowStockItems = [
    { name: "Amoxicillin 500mg", current: 50, minimum: 200, status: "critical" },
    { name: "Ibuprofen 400mg", current: 180, minimum: 300, status: "low" },
    { name: "Paracetamol 500mg", current: 250, minimum: 500, status: "low" },
  ];

  const dispensedData = [
    { name: "Antibiotics", value: 35, color: "#3b82f6" },
    { name: "Pain Relief", value: 25, color: "#10b981" },
    { name: "Chronic Disease", value: 30, color: "#f59e0b" },
    { name: "Others", value: 10, color: "#8b5cf6" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pharmacist Dashboard</h1>
            <p className="text-gray-600 mt-1">Medication dispensing and inventory management</p>
          </div>
          <Pill className="h-12 w-12 text-emerald-600" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
              <Clock className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingPrescriptions}</div>
              <p className="text-xs opacity-80 mt-1">Awaiting dispensing</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
              <CheckCircle className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.dispensedToday}</div>
              <p className="text-xs opacity-80 mt-1">Medications given</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertCircle className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.lowStockItems}</div>
              <p className="text-xs opacity-80 mt-1">Require restocking</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs opacity-80 mt-1">Served this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medication Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Medications Dispensed by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dispensedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dispensedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Prescription Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-emerald-600" />
                Prescription Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prescriptionQueue.map((presc) => (
                  <div key={presc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{presc.patient}</p>
                      <p className="text-sm text-gray-600">{presc.medication}</p>
                      <p className="text-xs text-gray-500">{presc.quantity}</p>
                    </div>
                    <Badge variant={presc.priority === "high" ? "destructive" : "outline"}>
                      {presc.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Package className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Current: {item.current} units | Minimum: {item.minimum} units
                    </p>
                  </div>
                  <Badge variant={item.status === "critical" ? "destructive" : "default"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Button onClick={() => navigate("/prescriptions")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Pill className="h-6 w-6 text-emerald-600" />
                <span className="font-medium">Dispense Medication</span>
                <span className="text-xs text-gray-500">Process prescriptions</span>
              </Button>
              
              <Button onClick={() => navigate("/inventory")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Inventory</span>
                <span className="text-xs text-gray-500">Manage stock</span>
              </Button>
              
              <Button onClick={() => navigate("/patients")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Patient History</span>
                <span className="text-xs text-gray-500">Medication records</span>
              </Button>
              
              <Button onClick={() => navigate("/orders")} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="font-medium">Place Order</span>
                <span className="text-xs text-gray-500">Restock items</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
