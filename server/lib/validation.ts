import { z } from "zod";
import { UserRole } from "@prisma/client";

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.string().optional(),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().datetime().optional().or(z.literal("")),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
  departmentId: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  gender: z.string().optional(),
});

// Department schemas
export const createDepartmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  manager: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

// Clinic schemas
export const createClinicSchema = z.object({
  name: z.string().min(1),
  specialization: z.string().min(1),
  departmentId: z.string(),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  capacity: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateClinicSchema = createClinicSchema.partial();

// Equipment schemas
export const createEquipmentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  serialNumber: z.string().min(1),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  departmentId: z.string(),
  status: z.string().optional(),
  location: z.string().optional(),
  purchaseDate: z.string().datetime().optional().or(z.literal("")),
  lastMaintenanceDate: z.string().datetime().optional().or(z.literal("")),
  nextMaintenanceDate: z.string().datetime().optional().or(z.literal("")),
  cost: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateEquipmentSchema = createEquipmentSchema.partial();

// Appointment schemas
export const createAppointmentSchema = z.object({
  patientId: z.string(),
  clinicId: z.string(),
  appointmentDate: z.string().datetime(),
  endTime: z.string().datetime().optional().or(z.literal("")),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.string().optional(),
  notes: z.string().optional(),
  reason: z.string().optional(),
});

// Medical Record schemas
export const createMedicalRecordSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  appointmentId: z.string().optional(),
  diagnosis: z.string().optional(),
  symptoms: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  chiefComplaint: z.string().optional(),
  physicalExamination: z.string().optional(),
  vitalSigns: z.string().optional(),
  icd10Code: z.string().optional(),
  severity: z.string().optional(),
  recordDate: z.string().datetime().optional(),
});

export const updateMedicalRecordSchema =
  createMedicalRecordSchema.partial();

// Lab Test schemas
export const createLabTestSchema = z.object({
  patientId: z.string(),
  orderedById: z.string(),
  medicalRecordId: z.string().optional(),
  testType: z.string().min(1),
  testCode: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  orderDate: z.string().datetime().optional(),
  result: z.string().optional(),
  referenceRange: z.string().optional(),
  notes: z.string().optional(),
});

export const updateLabTestSchema = createLabTestSchema.partial();

// Prescription schemas
export const createPrescriptionSchema = z.object({
  patientId: z.string(),
  recordId: z.string(),
  doctorId: z.string(),
  medicationName: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  duration: z.string().optional(),
  quantity: z.number().positive(),
  refills: z.number().optional(),
  instructions: z.string().optional(),
});

export const updatePrescriptionSchema = createPrescriptionSchema.partial();

// Shift schemas
export const createShiftSchema = z.object({
  staffId: z.string(),
  shiftDate: z.string().datetime(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  shiftType: z.string().min(1),
  notes: z.string().optional(),
});

export const updateShiftSchema = createShiftSchema.partial();
