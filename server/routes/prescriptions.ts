import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
} from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";
import { PrescriptionStatus } from "@prisma/client";

export const getPrescriptions: RequestHandler = asyncHandler(
  async (req, res) => {
    const { patientId, doctorId, status, skip = 0, take = 10 } = req.query;

    const where: Record<string, unknown> = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          doctor: {
            select: { id: true, firstName: true, lastName: true },
          },
          record: { select: { id: true } },
        },
        skip: parseInt(skip as string),
        take: parseInt(take as string),
        orderBy: { prescriptionDate: "desc" },
      }),
      prisma.prescription.count({ where }),
    ]);

    res.json({
      prescriptions,
      total,
      skip: parseInt(skip as string),
      take: parseInt(take as string),
    });
  }
);

export const getPrescription: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
        record: { select: { id: true } },
      },
    });

    if (!prescription) {
      throw new AppError(404, "Prescription not found");
    }

    res.json(prescription);
  }
);

export const createPrescription: RequestHandler = asyncHandler(
  async (req, res) => {
    const data = createPrescriptionSchema.parse(req.body);

    const [patient, doctor, record] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.patientId } }),
      prisma.user.findUnique({ where: { id: data.doctorId } }),
      prisma.medicalRecord.findUnique({ where: { id: data.recordId } }),
    ]);

    if (!patient) {
      throw new AppError(404, "Patient not found");
    }

    if (!doctor) {
      throw new AppError(404, "Doctor not found");
    }

    if (!record) {
      throw new AppError(404, "Medical record not found");
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        recordId: data.recordId,
        doctorId: data.doctorId,
        medicationName: data.medicationName,
        dosage: data.dosage,
        frequency: data.frequency,
        duration: data.duration,
        quantity: data.quantity,
        refills: data.refills || 0,
        instructions: data.instructions,
        status: PrescriptionStatus.ACTIVE,
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

    res.status(201).json(prescription);
  }
);

export const updatePrescription: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const data = updatePrescriptionSchema.parse(req.body);

    const prescription = await prisma.prescription.findUnique({
      where: { id },
    });
    if (!prescription) {
      throw new AppError(404, "Prescription not found");
    }

    const updated = await prisma.prescription.update({
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

export const completePrescription: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
    });
    if (!prescription) {
      throw new AppError(404, "Prescription not found");
    }

    const updated = await prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.COMPLETED },
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

export const cancelPrescription: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
    });
    if (!prescription) {
      throw new AppError(404, "Prescription not found");
    }

    const updated = await prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.CANCELLED },
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

export const getPatientPrescriptions: RequestHandler = asyncHandler(
  async (req, res) => {
    const { patientId } = req.params;
    const { status, skip = 0, take = 20 } = req.query;

    const where: Record<string, unknown> = { patientId };
    if (status) where.status = status;

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        include: {
          doctor: {
            select: { id: true, firstName: true, lastName: true },
          },
          record: { select: { id: true } },
        },
        skip: parseInt(skip as string),
        take: parseInt(take as string),
        orderBy: { prescriptionDate: "desc" },
      }),
      prisma.prescription.count({ where }),
    ]);

    res.json({
      patientId,
      prescriptions,
      total,
      skip: parseInt(skip as string),
      take: parseInt(take as string),
    });
  }
);
