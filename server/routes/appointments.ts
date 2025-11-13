import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";
import { AppointmentStatus } from "@prisma/client";

export const getAppointments: RequestHandler = asyncHandler(
  async (req, res) => {
    const {
      patientId,
      clinicId,
      status,
      startDate,
      endDate,
      skip = 0,
      take = 10,
    } = req.query;

    const where: Record<string, unknown> = {};
    if (patientId) where.patientId = patientId;
    if (clinicId) where.clinicId = clinicId;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate) {
        (where.appointmentDate as Record<string, unknown>).gte = new Date(
          startDate as string
        );
      }
      if (endDate) {
        (where.appointmentDate as Record<string, unknown>).lte = new Date(
          endDate as string
        );
      }
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          clinic: { select: { id: true, name: true, specialization: true } },
        },
        skip: parseInt(skip as string),
        take: parseInt(take as string),
        orderBy: { appointmentDate: "asc" },
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({
      appointments,
      total,
      skip: parseInt(skip as string),
      take: parseInt(take as string),
    });
  }
);

export const getAppointment: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await prisma.appointment.findUnique({
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
      clinic: { select: { id: true, name: true, specialization: true } },
    },
  });

  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  res.json(appointment);
});

export const createAppointment: RequestHandler = asyncHandler(
  async (req, res) => {
    const data = createAppointmentSchema.parse(req.body);

    const [patient, clinic] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.patientId } }),
      prisma.clinic.findUnique({ where: { id: data.clinicId } }),
    ]);

    if (!patient) {
      throw new AppError(404, "Patient not found");
    }

    if (!clinic) {
      throw new AppError(404, "Clinic not found");
    }

    const appointmentDate = new Date(data.appointmentDate);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        clinicId: data.clinicId,
        appointmentDate,
        reason: data.reason,
        notes: data.notes,
        status: AppointmentStatus.SCHEDULED,
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        clinic: { select: { id: true, name: true, specialization: true } },
      },
    });

    res.status(201).json(appointment);
  }
);

export const updateAppointment: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const data = updateAppointmentSchema.parse(req.body);

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new AppError(404, "Appointment not found");
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        clinic: { select: { id: true, name: true, specialization: true } },
      },
    });

    res.json(updated);
  }
);

export const cancelAppointment: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new AppError(404, "Appointment not found");
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        clinic: { select: { id: true, name: true, specialization: true } },
      },
    });

    res.json(updated);
  }
);

export const completeAppointment: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new AppError(404, "Appointment not found");
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.COMPLETED },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        clinic: { select: { id: true, name: true, specialization: true } },
      },
    });

    res.json(updated);
  }
);

export const getUpcomingAppointments: RequestHandler = asyncHandler(
  async (req, res) => {
    const { patientId, days = 7 } = req.query;

    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientId as string,
        appointmentDate: {
          gte: now,
          lte: futureDate,
        },
        status: AppointmentStatus.SCHEDULED,
      },
      include: {
        clinic: { select: { id: true, name: true, specialization: true } },
      },
      orderBy: { appointmentDate: "asc" },
    });

    res.json(appointments);
  }
);
