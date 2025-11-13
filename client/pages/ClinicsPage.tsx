import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, Plus, MapPin, Users, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClinicsPage() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClinics();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const filteredClinics = clinics.filter((clinic) => {
    return searchTerm === "" || 
      clinic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getSpecializationColor = (spec: string) => {
    const colors: any = {
      "Cardiovascular": "bg-red-100 text-red-800",
      "Orthopedics": "bg-blue-100 text-blue-800",
      "Pediatrics": "bg-purple-100 text-purple-800",
      "Neurology": "bg-pink-100 text-pink-800",
      "Dermatology": "bg-yellow-100 text-yellow-800",
    };
    return colors[spec] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clinics</h1>
            <p className="text-gray-600 mt-1">Manage specialty clinics</p>
          </div>
          <Button onClick={() => navigate("/clinics/new")} className="bg-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Clinic
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Clinics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clinics.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {clinics.filter((c) => c.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {clinics.reduce((sum, c) => sum + (c.capacity || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {clinics.reduce((sum, c) => sum + (c._count?.doctors || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clinics by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center py-8">Loading...</div>
          ) : filteredClinics.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No clinics found</p>
            </div>
          ) : (
            filteredClinics.map((clinic) => (
              <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{clinic.name}</CardTitle>
                        <Badge className={getSpecializationColor(clinic.specialization)} variant="outline">
                          {clinic.specialization}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>{clinic.department?.name || "No Department"}</span>
                  </div>
                  {clinic.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{clinic.location}</span>
                    </div>
                  )}
                  {clinic.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{clinic.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{clinic._count?.doctors || 0}</span>
                    <span className="text-gray-500">doctors</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium">{clinic.capacity}</span>
                    <span className="text-gray-500">capacity</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={clinic.isActive ? "default" : "secondary"}>
                      {clinic.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/clinics/${clinic.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
