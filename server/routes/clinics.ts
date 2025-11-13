import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import { createClinicSchema, updateClinicSchema } from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";

export const getClinics: RequestHandler = asyncHandler(async (req, res) => {
  const { departmentId, skip = 0, take = 10, search } = req.query;

  const where: Record<string, unknown> = { isActive: true };
  if (departmentId) where.departmentId = departmentId;
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: "insensitive" as const } },
      {
        specialization: {
          contains: search as string,
          mode: "insensitive" as const,
        },
      },
    ];
  }

  const [clinics, total] = await Promise.all([
    prisma.clinic.findMany({
      where,
      include: {
        department: { select: { id: true, name: true } },
        doctors: { select: { id: true, firstName: true, lastName: true } },
        appointments: { select: { id: true } },
      },
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      orderBy: { createdAt: "desc" },
    }),
    prisma.clinic.count({ where }),
  ]);

  res.json({
    clinics,
    total,
    skip: parseInt(skip as string),
    take: parseInt(take as string),
  });
});

export const getClinic: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const clinic = await prisma.clinic.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, name: true } },
      doctors: { select: { id: true, firstName: true, lastName: true } },
      appointments: {
        select: {
          id: true,
          appointmentDate: true,
          status: true,
          patient: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!clinic) {
    throw new AppError(404, "Clinic not found");
  }

  res.json(clinic);
});

export const createClinic: RequestHandler = asyncHandler(async (req, res) => {
  const data = createClinicSchema.parse(req.body);

  const department = await prisma.department.findUnique({
    where: { id: data.departmentId },
  });

  if (!department) {
    throw new AppError(404, "Department not found");
  }

  const clinic = await prisma.clinic.create({
    data: {
      name: data.name,
      specialization: data.specialization,
      departmentId: data.departmentId,
      location: data.location,
      phone: data.phone,
      email: data.email,
      capacity: data.capacity,
      isActive: true,
    },
    include: {
      department: { select: { id: true, name: true } },
    },
  });

  res.status(201).json(clinic);
});

export const updateClinic: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = updateClinicSchema.parse(req.body);

  const clinic = await prisma.clinic.findUnique({ where: { id } });
  if (!clinic) {
    throw new AppError(404, "Clinic not found");
  }

  const updated = await prisma.clinic.update({
    where: { id },
    data,
    include: {
      department: { select: { id: true, name: true } },
      doctors: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  res.json(updated);
});

export const deleteClinic: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const clinic = await prisma.clinic.findUnique({ where: { id } });
  if (!clinic) {
    throw new AppError(404, "Clinic not found");
  }

  await prisma.clinic.update({
    where: { id },
    data: { isActive: false },
  });

  res.json({ message: "Clinic deactivated successfully" });
});

export const addDoctorToClinic: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { doctorId } = req.body;

    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) {
      throw new AppError(404, "Clinic not found");
    }

    const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new AppError(404, "Doctor not found");
    }

    const updated = await prisma.clinic.update({
      where: { id },
      data: {
        doctors: { connect: { id: doctorId } },
      },
      include: {
        doctors: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.json(updated);
  }
);

export const removeDoctorFromClinic: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { doctorId } = req.body;

    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) {
      throw new AppError(404, "Clinic not found");
    }

    const updated = await prisma.clinic.update({
      where: { id },
      data: {
        doctors: { disconnect: { id: doctorId } },
      },
      include: {
        doctors: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.json(updated);
  }
);
