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
import { ArrowLeft, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MedicalRecordNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentId: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    notes: "",
    chiefComplaint: "",
    physicalExamination: "",
    vitalSigns: "",
    icd10Code: "",
    severity: "",
    recordDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.patientId) {
      fetchAppointments(formData.patientId);
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

  const fetchAppointments = async (patientId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/v1/appointments?patientId=${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        appointmentId: formData.appointmentId || null,
        diagnosis: formData.diagnosis,
        symptoms: formData.symptoms || null,
        treatment: formData.treatment || null,
        notes: formData.notes || null,
        chiefComplaint: formData.chiefComplaint || null,
        physicalExamination: formData.physicalExamination || null,
        vitalSigns: formData.vitalSigns || null,
        icd10Code: formData.icd10Code || null,
        severity: formData.severity || null,
        recordDate: new Date(formData.recordDate).toISOString(),
      };

      const response = await fetch("/api/v1/medical-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create medical record");
      }

      toast({
        title: "Success",
        description: "Medical record created successfully",
      });

      navigate("/records");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create medical record",
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
            onClick={() => navigate("/records")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Medical Record</h1>
            <p className="text-gray-600 mt-1">Create a new patient medical record</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Medical Record Details</CardTitle>
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
                  <Label htmlFor="doctorId">Doctor *</Label>
                  <Select
                    value={formData.doctorId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, doctorId: value })
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
                  <Label htmlFor="appointmentId">Related Appointment (Optional)</Label>
                  <Select
                    value={formData.appointmentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, appointmentId: value })
                    }
                    disabled={!formData.patientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointments.map((apt) => (
                        <SelectItem key={apt.id} value={apt.id}>
                          {new Date(apt.appointmentDate).toLocaleDateString()} - {apt.clinic?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recordDate">Record Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="recordDate"
                      type="date"
                      className="pl-10"
                      value={formData.recordDate}
                      onChange={(e) =>
                        setFormData({ ...formData, recordDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                  <Input
                    id="chiefComplaint"
                    placeholder="Primary reason for visit"
                    value={formData.chiefComplaint}
                    onChange={(e) =>
                      setFormData({ ...formData, chiefComplaint: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="List of symptoms experienced by the patient"
                    rows={3}
                    value={formData.symptoms}
                    onChange={(e) =>
                      setFormData({ ...formData, symptoms: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis *</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="diagnosis"
                      className="pl-10"
                      placeholder="Primary diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) =>
                        setFormData({ ...formData, diagnosis: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icd10Code">ICD-10 Code</Label>
                  <Input
                    id="icd10Code"
                    placeholder="e.g., I10"
                    value={formData.icd10Code}
                    onChange={(e) =>
                      setFormData({ ...formData, icd10Code: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, severity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MODERATE">Moderate</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vitalSigns">Vital Signs</Label>
                  <Input
                    id="vitalSigns"
                    placeholder="e.g., BP: 120/80, Temp: 98.6°F"
                    value={formData.vitalSigns}
                    onChange={(e) =>
                      setFormData({ ...formData, vitalSigns: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="physicalExamination">Physical Examination</Label>
                  <Textarea
                    id="physicalExamination"
                    placeholder="Findings from physical examination"
                    rows={3}
                    value={formData.physicalExamination}
                    onChange={(e) =>
                      setFormData({ ...formData, physicalExamination: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="treatment">Treatment Plan</Label>
                  <Textarea
                    id="treatment"
                    placeholder="Prescribed treatment and care plan"
                    rows={3}
                    value={formData.treatment}
                    onChange={(e) =>
                      setFormData({ ...formData, treatment: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or observations"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="bg-indigo-600">
                  {loading ? "Creating..." : "Create Medical Record"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/records")}
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
