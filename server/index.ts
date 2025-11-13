import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { errorHandler, asyncHandler } from "./middleware/error";
import { authMiddleware, requireRole } from "./middleware/auth";
import { handleDemo } from "./routes/demo";
import * as authRoutes from "./routes/auth";
import * as userRoutes from "./routes/users";
import * as departmentRoutes from "./routes/departments";
import * as clinicRoutes from "./routes/clinics";
import * as equipmentRoutes from "./routes/equipment";
import * as appointmentRoutes from "./routes/appointments";
import * as medicalRecordRoutes from "./routes/medical-records";
import * as labTestRoutes from "./routes/lab-tests";
import * as prescriptionRoutes from "./routes/prescriptions";
import * as shiftRoutes from "./routes/shifts";
import { UserRole } from "@prisma/client";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 10000, // Much higher limit in development
  message: "Too many requests from this IP, please try again later.",
});

export function createServer() {
  const app = express();

  // Middleware
  app.use(limiter);
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes (public)
  app.post("/api/v1/auth/register", asyncHandler(authRoutes.register));
  app.post("/api/v1/auth/login", asyncHandler(authRoutes.login));
  app.post("/api/v1/auth/refresh", asyncHandler(authRoutes.refreshToken));
  app.get(
    "/api/v1/auth/me",
    authMiddleware,
    asyncHandler(authRoutes.currentUser)
  );

  // User routes
  app.get(
    "/api/v1/users",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(userRoutes.getUsers)
  );
  app.post(
    "/api/v1/users",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST),
    asyncHandler(userRoutes.createUser)
  );
  app.get(
    "/api/v1/users/:id",
    authMiddleware,
    asyncHandler(userRoutes.getUser)
  );
  app.patch(
    "/api/v1/users/:id",
    authMiddleware,
    asyncHandler(userRoutes.updateUser)
  );
  app.delete(
    "/api/v1/users/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(userRoutes.deleteUser)
  );
  app.patch(
    "/api/v1/users/:id/role",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(userRoutes.updateUserRole)
  );
  app.patch(
    "/api/v1/users/:id/department",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(userRoutes.assignDepartment)
  );

  // Department routes
  app.get("/api/v1/departments", asyncHandler(departmentRoutes.getDepartments));
  app.get(
    "/api/v1/departments/:id",
    asyncHandler(departmentRoutes.getDepartment)
  );
  app.post(
    "/api/v1/departments",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(departmentRoutes.createDepartment)
  );
  app.patch(
    "/api/v1/departments/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(departmentRoutes.updateDepartment)
  );
  app.delete(
    "/api/v1/departments/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(departmentRoutes.deleteDepartment)
  );
  app.get(
    "/api/v1/departments/:id/stats",
    asyncHandler(departmentRoutes.getDepartmentStats)
  );

  // Clinic routes
  app.get("/api/v1/clinics", asyncHandler(clinicRoutes.getClinics));
  app.get("/api/v1/clinics/:id", asyncHandler(clinicRoutes.getClinic));
  app.post(
    "/api/v1/clinics",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(clinicRoutes.createClinic)
  );
  app.patch(
    "/api/v1/clinics/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(clinicRoutes.updateClinic)
  );
  app.delete(
    "/api/v1/clinics/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(clinicRoutes.deleteClinic)
  );
  app.post(
    "/api/v1/clinics/:id/doctors",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(clinicRoutes.addDoctorToClinic)
  );
  app.delete(
    "/api/v1/clinics/:id/doctors",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(clinicRoutes.removeDoctorFromClinic)
  );

  // Equipment routes
  app.get("/api/v1/equipment", asyncHandler(equipmentRoutes.getEquipment));
  app.get(
    "/api/v1/equipment/:id",
    asyncHandler(equipmentRoutes.getEquipmentItem)
  );
  app.post(
    "/api/v1/equipment",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(equipmentRoutes.createEquipment)
  );
  app.patch(
    "/api/v1/equipment/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(equipmentRoutes.updateEquipment)
  );
  app.patch(
    "/api/v1/equipment/:id/status",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(equipmentRoutes.updateEquipmentStatus)
  );
  app.patch(
    "/api/v1/equipment/:id/inventory",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(equipmentRoutes.updateEquipmentInventory)
  );
  app.delete(
    "/api/v1/equipment/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(equipmentRoutes.deleteEquipment)
  );

  // Appointment routes
  app.get(
    "/api/v1/appointments",
    authMiddleware,
    asyncHandler(appointmentRoutes.getAppointments)
  );
  app.get(
    "/api/v1/appointments/:id",
    authMiddleware,
    asyncHandler(appointmentRoutes.getAppointment)
  );
  app.post(
    "/api/v1/appointments",
    authMiddleware,
    asyncHandler(appointmentRoutes.createAppointment)
  );
  app.patch(
    "/api/v1/appointments/:id",
    authMiddleware,
    asyncHandler(appointmentRoutes.updateAppointment)
  );
  app.post(
    "/api/v1/appointments/:id/cancel",
    authMiddleware,
    asyncHandler(appointmentRoutes.cancelAppointment)
  );
  app.post(
    "/api/v1/appointments/:id/complete",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE),
    asyncHandler(appointmentRoutes.completeAppointment)
  );
  app.get(
    "/api/v1/appointments/patient/:patientId/upcoming",
    authMiddleware,
    asyncHandler(appointmentRoutes.getUpcomingAppointments)
  );

  // Medical Records routes
  app.get(
    "/api/v1/records",
    authMiddleware,
    asyncHandler(medicalRecordRoutes.getMedicalRecords)
  );
  app.get(
    "/api/v1/records/:id",
    authMiddleware,
    asyncHandler(medicalRecordRoutes.getMedicalRecord)
  );
  app.post(
    "/api/v1/records",
    authMiddleware,
    requireRole(UserRole.DOCTOR, UserRole.NURSE),
    asyncHandler(medicalRecordRoutes.createMedicalRecord)
  );
  app.patch(
    "/api/v1/records/:id",
    authMiddleware,
    requireRole(UserRole.DOCTOR, UserRole.NURSE),
    asyncHandler(medicalRecordRoutes.updateMedicalRecord)
  );
  app.delete(
    "/api/v1/records/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(medicalRecordRoutes.deleteMedicalRecord)
  );
  app.get(
    "/api/v1/records/patient/:patientId/history",
    authMiddleware,
    asyncHandler(medicalRecordRoutes.getPatientMedicalHistory)
  );

  // Lab Tests routes
  app.get(
    "/api/v1/lab-tests",
    authMiddleware,
    asyncHandler(labTestRoutes.getLabTests)
  );
  app.get(
    "/api/v1/lab-tests/:id",
    authMiddleware,
    asyncHandler(labTestRoutes.getLabTest)
  );
  app.post(
    "/api/v1/lab-tests",
    authMiddleware,
    requireRole(UserRole.LAB_TECH, UserRole.DOCTOR),
    asyncHandler(labTestRoutes.createLabTest)
  );
  app.patch(
    "/api/v1/lab-tests/:id",
    authMiddleware,
    requireRole(UserRole.LAB_TECH, UserRole.DOCTOR),
    asyncHandler(labTestRoutes.updateLabTest)
  );
  app.post(
    "/api/v1/lab-tests/:id/publish",
    authMiddleware,
    requireRole(UserRole.LAB_TECH, UserRole.DOCTOR),
    asyncHandler(labTestRoutes.publishLabTestResult)
  );
  app.delete(
    "/api/v1/lab-tests/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(labTestRoutes.deleteLabTest)
  );
  app.get(
    "/api/v1/lab-tests/patient/:patientId",
    authMiddleware,
    asyncHandler(labTestRoutes.getPatientLabTests)
  );

  // Prescriptions routes
  app.get(
    "/api/v1/prescriptions",
    authMiddleware,
    asyncHandler(prescriptionRoutes.getPrescriptions)
  );
  app.get(
    "/api/v1/prescriptions/:id",
    authMiddleware,
    asyncHandler(prescriptionRoutes.getPrescription)
  );
  app.post(
    "/api/v1/prescriptions",
    authMiddleware,
    requireRole(UserRole.DOCTOR),
    asyncHandler(prescriptionRoutes.createPrescription)
  );
  app.patch(
    "/api/v1/prescriptions/:id",
    authMiddleware,
    requireRole(UserRole.DOCTOR),
    asyncHandler(prescriptionRoutes.updatePrescription)
  );
  app.post(
    "/api/v1/prescriptions/:id/complete",
    authMiddleware,
    requireRole(UserRole.PHARMACIST),
    asyncHandler(prescriptionRoutes.completePrescription)
  );
  app.post(
    "/api/v1/prescriptions/:id/cancel",
    authMiddleware,
    requireRole(UserRole.DOCTOR),
    asyncHandler(prescriptionRoutes.cancelPrescription)
  );
  app.get(
    "/api/v1/prescriptions/patient/:patientId",
    authMiddleware,
    asyncHandler(prescriptionRoutes.getPatientPrescriptions)
  );

  // Shifts routes
  app.get(
    "/api/v1/shifts",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(shiftRoutes.getShifts)
  );
  app.get(
    "/api/v1/shifts/:id",
    authMiddleware,
    asyncHandler(shiftRoutes.getShift)
  );
  app.post(
    "/api/v1/shifts",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(shiftRoutes.createShift)
  );
  app.patch(
    "/api/v1/shifts/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(shiftRoutes.updateShift)
  );
  app.patch(
    "/api/v1/shifts/:id/status",
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.MANAGER),
    asyncHandler(shiftRoutes.updateShiftStatus)
  );
  app.delete(
    "/api/v1/shifts/:id",
    authMiddleware,
    requireRole(UserRole.ADMIN),
    asyncHandler(shiftRoutes.deleteShift)
  );
  app.get(
    "/api/v1/shifts/staff/:staffId/schedule",
    authMiddleware,
    asyncHandler(shiftRoutes.getStaffSchedule)
  );

  // Error handling
  app.use(errorHandler);

  return app;
}
