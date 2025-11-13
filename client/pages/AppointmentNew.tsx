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
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AppointmentNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patientId: "",
    clinicId: "",
    appointmentDate: "",
    appointmentTime: "",
    endTime: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchClinics();
  }, []);

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

  const fetchClinics = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/v1/clinics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setClinics(data.data || []);
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      
      // Combine date and time
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
      const endDateTime = formData.endTime 
        ? new Date(`${formData.appointmentDate}T${formData.endTime}`)
        : null;

      const payload = {
        patientId: formData.patientId,
        clinicId: formData.clinicId,
        appointmentDate: appointmentDateTime.toISOString(),
        endTime: endDateTime?.toISOString(),
        reason: formData.reason,
        notes: formData.notes,
      };

      const response = await fetch("/api/v1/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      toast({
        title: "Success",
        description: "Appointment created successfully",
      });

      navigate("/appointments");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment",
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
            onClick={() => navigate("/appointments")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Appointment</h1>
            <p className="text-gray-600 mt-1">Schedule a new patient appointment</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
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
                  <Label htmlFor="clinicId">Clinic *</Label>
                  <Select
                    value={formData.clinicId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, clinicId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinics.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id}>
                          {clinic.name} - {clinic.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="appointmentDate"
                      type="date"
                      className="pl-10"
                      value={formData.appointmentDate}
                      onChange={(e) =>
                        setFormData({ ...formData, appointmentDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentTime">Start Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="appointmentTime"
                      type="time"
                      className="pl-10"
                      value={formData.appointmentTime}
                      onChange={(e) =>
                        setFormData({ ...formData, appointmentTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (Optional)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="endTime"
                      type="time"
                      className="pl-10"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Annual checkup, Follow-up"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
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
                <Button type="submit" disabled={loading} className="bg-green-600">
                  {loading ? "Creating..." : "Create Appointment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/appointments")}
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
