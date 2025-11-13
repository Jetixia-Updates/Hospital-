import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Microscope, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LabTestNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patientId: "",
    orderedById: "",
    medicalRecordId: "",
    testType: "",
    testCode: "",
    priority: "NORMAL",
    status: "PENDING",
    orderDate: new Date().toISOString().split("T")[0],
    result: "",
    referenceRange: "",
    notes: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.patientId) {
      fetchMedicalRecords(formData.patientId);
    }
  }, [formData.patientId]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/v1/users?role=PATIENT", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPatients(data.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/v1/users?role=DOCTOR", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDoctors(data.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchMedicalRecords = async (patientId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/v1/medical-records?patientId=${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMedicalRecords(data.data || []);
    } catch (error) {
      console.error("Error fetching medical records:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const payload = {
        patientId: formData.patientId,
        orderedById: formData.orderedById,
        medicalRecordId: formData.medicalRecordId || null,
        testType: formData.testType,
        testCode: formData.testCode || null,
        priority: formData.priority,
        status: formData.status,
        orderDate: new Date(formData.orderDate).toISOString(),
        result: formData.result || null,
        referenceRange: formData.referenceRange || null,
        notes: formData.notes || null,
      };

      const response = await fetch("/api/v1/lab-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create lab test");
      }

      toast({
        title: "Success",
        description: "Lab test order created successfully",
      });

      navigate("/lab");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create lab test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/lab")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Lab Test</h1>
            <p className="text-gray-600 mt-1">Create a new lab test order</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lab Test Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient *</Label>
                  <Select
                    value={formData.patientId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, patientId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} - {patient.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderedById">Ordered By (Doctor) *</Label>
                  <Select
                    value={formData.orderedById}
                    onValueChange={(value) =>
                      setFormData({ ...formData, orderedById: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalRecordId">Medical Record (Optional)</Label>
                  <Select
                    value={formData.medicalRecordId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicalRecordId: value })
                    }
                    disabled={!formData.patientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medical record" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalRecords.map((record) => (
                        <SelectItem key={record.id} value={record.id}>
                          {new Date(record.recordDate).toLocaleDateString()} - {record.diagnosis}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testType">Test Type *</Label>
                  <div className="relative">
                    <Microscope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="testType"
                      className="pl-10"
                      placeholder="e.g., Complete Blood Count"
                      value={formData.testType}
                      onChange={(e) =>
                        setFormData({ ...formData, testType: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testCode">Test Code</Label>
                  <Input
                    id="testCode"
                    placeholder="e.g., CBC-001"
                    value={formData.testCode}
                    onChange={(e) =>
                      setFormData({ ...formData, testCode: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="orderDate"
                      type="date"
                      className="pl-10"
                      value={formData.orderDate}
                      onChange={(e) =>
                        setFormData({ ...formData, orderDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  <Input
                    id="result"
                    placeholder="e.g., 12.5 g/dL"
                    value={formData.result}
                    onChange={(e) =>
                      setFormData({ ...formData, result: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceRange">Reference Range</Label>
                  <Input
                    id="referenceRange"
                    placeholder="e.g., 12-16 g/dL"
                    value={formData.referenceRange}
                    onChange={(e) =>
                      setFormData({ ...formData, referenceRange: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="bg-teal-600">
                  {loading ? "Creating..." : "Create Lab Test"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/lab")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
