import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import { createShiftSchema, updateShiftSchema } from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";
import { ShiftStatus } from "@prisma/client";

export const getShifts: RequestHandler = asyncHandler(async (req, res) => {
  const { staffId, status, startDate, endDate, skip = 0, take = 10 } =
    req.query;

  const where: Record<string, unknown> = {};
  if (staffId) where.staffId = staffId;
  if (status) where.status = status;

  if (startDate || endDate) {
    where.shiftDate = {};
    if (startDate) {
      (where.shiftDate as Record<string, unknown>).gte = new Date(
        startDate as string
      );
    }
    if (endDate) {
      (where.shiftDate as Record<string, unknown>).lte = new Date(
        endDate as string
      );
    }
  }

  const [shifts, total] = await Promise.all([
    prisma.shift.findMany({
      where,
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      orderBy: { shiftDate: "asc" },
    }),
    prisma.shift.count({ where }),
  ]);

  res.json({
    shifts,
    total,
    skip: parseInt(skip as string),
    take: parseInt(take as string),
  });
});

export const getShift: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const shift = await prisma.shift.findUnique({
    where: { id },
    include: {
      staff: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          department: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!shift) {
    throw new AppError(404, "Shift not found");
  }

  res.json(shift);
});

export const createShift: RequestHandler = asyncHandler(async (req, res) => {
  const data = createShiftSchema.parse(req.body);

  const staff = await prisma.user.findUnique({
    where: { id: data.staffId },
  });

  if (!staff) {
    throw new AppError(404, "Staff member not found");
  }

  const shift = await prisma.shift.create({
    data: {
      staffId: data.staffId,
      shiftDate: new Date(data.shiftDate),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      shiftType: data.shiftType,
      notes: data.notes,
      status: ShiftStatus.SCHEDULED,
    },
    include: {
      staff: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json(shift);
});

export const updateShift: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = updateShiftSchema.parse(req.body);

  const shift = await prisma.shift.findUnique({ where: { id } });
  if (!shift) {
    throw new AppError(404, "Shift not found");
  }

  const updated = await prisma.shift.update({
    where: { id },
    data: {
      shiftDate: data.shiftDate ? new Date(data.shiftDate) : undefined,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      shiftType: data.shiftType,
      notes: data.notes,
    },
    include: {
      staff: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  res.json(updated);
});

export const updateShiftStatus: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ShiftStatus).includes(status)) {
      throw new AppError(400, "Invalid shift status");
    }

    const shift = await prisma.shift.update({
      where: { id },
      data: { status },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json(shift);
  }
);

export const deleteShift: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const shift = await prisma.shift.findUnique({ where: { id } });
  if (!shift) {
    throw new AppError(404, "Shift not found");
  }

  await prisma.shift.delete({ where: { id } });

  res.json({ message: "Shift deleted successfully" });
});

export const getStaffSchedule: RequestHandler = asyncHandler(
  async (req, res) => {
    const { staffId } = req.params;
    const { startDate, endDate } = req.query;

    const where: Record<string, unknown> = { staffId };

    if (startDate || endDate) {
      where.shiftDate = {};
      if (startDate) {
        (where.shiftDate as Record<string, unknown>).gte = new Date(
          startDate as string
        );
      }
      if (endDate) {
        (where.shiftDate as Record<string, unknown>).lte = new Date(
          endDate as string
        );
      }
    }

    const shifts = await prisma.shift.findMany({
      where,
      orderBy: { shiftDate: "asc" },
    });

    res.json({
      staffId,
      totalShifts: shifts.length,
      shifts,
    });
  }
);
