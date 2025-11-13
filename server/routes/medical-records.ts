import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";

export const getMedicalRecords: RequestHandler = asyncHandler(
  async (req, res) => {
    const { patientId, doctorId, appointmentId, skip = 0, take = 10 } =
      req.query;

    const where: Record<string, unknown> = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (appointmentId) where.appointmentId = appointmentId;

    const [records, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          doctor: {
            select: { id: true, firstName: true, lastName: true },
          },
          appointment: { select: { id: true, appointmentDate: true } },
        },
        skip: parseInt(skip as string),
        take: parseInt(take as string),
        orderBy: { recordDate: "desc" },
      }),
      prisma.medicalRecord.count({ where }),
    ]);

    res.json({
      records,
      total,
      skip: parseInt(skip as string),
      take: parseInt(take as string),
    });
  }
);

export const getMedicalRecord: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
        appointment: { select: { id: true, appointmentDate: true } },
        prescriptions: true,
        labTests: true,
        imagingStudies: true,
      },
    });

    if (!record) {
      throw new AppError(404, "Medical record not found");
    }

    res.json(record);
  }
);

export const createMedicalRecord: RequestHandler = asyncHandler(
  async (req, res) => {
    const data = createMedicalRecordSchema.parse(req.body);

    const [patient, doctor] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.patientId } }),
      prisma.user.findUnique({ where: { id: data.doctorId } }),
    ]);

    if (!patient) {
      throw new AppError(404, "Patient not found");
    }

    if (!doctor) {
      throw new AppError(404, "Doctor not found");
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentId: data.appointmentId,
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        treatment: data.treatment,
        notes: data.notes,
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    res.status(201).json(record);
  }
);

export const updateMedicalRecord: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const data = updateMedicalRecordSchema.parse(req.body);

    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) {
      throw new AppError(404, "Medical record not found");
    }

    const updated = await prisma.medicalRecord.update({
      where: { id },
      data,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    res.json(updated);
  }
);

export const deleteMedicalRecord: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) {
      throw new AppError(404, "Medical record not found");
    }

    await prisma.medicalRecord.delete({ where: { id } });

    res.json({ message: "Medical record deleted successfully" });
  }
);

export const getPatientMedicalHistory: RequestHandler = asyncHandler(
  async (req, res) => {
    const { patientId } = req.params;

    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
        appointment: { select: { id: true, appointmentDate: true } },
        prescriptions: true,
        labTests: true,
      },
      orderBy: { recordDate: "desc" },
    });

    res.json({
      patientId,
      totalRecords: records.length,
      records,
    });
  }
);
