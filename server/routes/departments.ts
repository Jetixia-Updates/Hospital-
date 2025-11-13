import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";

export const getDepartments: RequestHandler = asyncHandler(async (req, res) => {
  const { skip = 0, take = 10, search } = req.query;

  const where = search
    ? {
        OR: [
          { name: { contains: search as string, mode: "insensitive" as const } },
          {
            description: {
              contains: search as string,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [departments, total] = await Promise.all([
    prisma.department.findMany({
      where,
      include: {
        staff: { select: { id: true, email: true, firstName: true } },
        clinics: { select: { id: true, name: true } },
      },
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      orderBy: { createdAt: "desc" },
    }),
    prisma.department.count({ where }),
  ]);

  res.json({
    departments,
    total,
    skip: parseInt(skip as string),
    take: parseInt(take as string),
  });
});

export const getDepartment: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      staff: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
      clinics: { select: { id: true, name: true, specialization: true } },
      equipment: { select: { id: true, name: true, type: true, status: true } },
    },
  });

  if (!department) {
    throw new AppError(404, "Department not found");
  }

  res.json(department);
});

export const createDepartment: RequestHandler = asyncHandler(
  async (req, res) => {
    const data = createDepartmentSchema.parse(req.body);

    const existingDept = await prisma.department.findUnique({
      where: { name: data.name },
    });

    if (existingDept) {
      throw new AppError(409, "Department with this name already exists");
    }

    const department = await prisma.department.create({
      data: {
        name: data.name,
        description: data.description || undefined,
        manager: data.manager || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        staff: { select: { id: true, email: true } },
      },
    });

    res.status(201).json(department);
  }
);

export const updateDepartment: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const data = updateDepartmentSchema.parse(req.body);

    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
      throw new AppError(404, "Department not found");
    }

    const updated = await prisma.department.update({
      where: { id },
      data,
      include: {
        staff: { select: { id: true, email: true, firstName: true } },
        clinics: { select: { id: true, name: true } },
      },
    });

    res.json(updated);
  }
);

export const deleteDepartment: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
      throw new AppError(404, "Department not found");
    }

    await prisma.department.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: "Department deactivated successfully" });
  }
);

export const getDepartmentStats: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new AppError(404, "Department not found");
    }

    const [staffCount, clinicsCount, equipmentCount] = await Promise.all([
      prisma.user.count({
        where: { departmentId: id, isActive: true },
      }),
      prisma.clinic.count({
        where: { departmentId: id, isActive: true },
      }),
      prisma.equipment.count({
        where: { departmentId: id, isActive: true },
      }),
    ]);

    res.json({
      departmentId: id,
      departmentName: department.name,
      staffCount,
      clinicsCount,
      equipmentCount,
    });
  }
);
