import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import { createEquipmentSchema, updateEquipmentSchema } from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";
import { EquipmentStatus } from "@prisma/client";

export const getEquipment: RequestHandler = asyncHandler(async (req, res) => {
  const { departmentId, status, skip = 0, take = 10, search } = req.query;

  const where: Record<string, unknown> = { isActive: true };
  if (departmentId) where.departmentId = departmentId;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: "insensitive" as const } },
      { type: { contains: search as string, mode: "insensitive" as const } },
      {
        serialNumber: {
          contains: search as string,
          mode: "insensitive" as const,
        },
      },
    ];
  }

  const [equipment, total] = await Promise.all([
    prisma.equipment.findMany({
      where,
      include: {
        department: { select: { id: true, name: true } },
        inventory: true,
      },
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      orderBy: { createdAt: "desc" },
    }),
    prisma.equipment.count({ where }),
  ]);

  res.json({
    equipment,
    total,
    skip: parseInt(skip as string),
    take: parseInt(take as string),
  });
});

export const getEquipmentItem: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true } },
        inventory: true,
      },
    });

    if (!equipment) {
      throw new AppError(404, "Equipment not found");
    }

    res.json(equipment);
  }
);

export const createEquipment: RequestHandler = asyncHandler(
  async (req, res) => {
    const data = createEquipmentSchema.parse(req.body);

    const department = await prisma.department.findUnique({
      where: { id: data.departmentId },
    });

    if (!department) {
      throw new AppError(404, "Department not found");
    }

    const equipment = await prisma.equipment.create({
      data: {
        name: data.name,
        type: data.type,
        serialNumber: data.serialNumber,
        manufacturer: data.manufacturer,
        modelNumber: data.modelNumber,
        departmentId: data.departmentId,
        location: data.location,
        purchaseDate: data.purchaseDate
          ? new Date(data.purchaseDate)
          : undefined,
        cost: data.cost,
        status: EquipmentStatus.AVAILABLE,
        isActive: true,
      },
      include: {
        department: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(equipment);
  }
);

export const updateEquipment: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const data = updateEquipmentSchema.parse(req.body);

    const equipment = await prisma.equipment.findUnique({ where: { id } });
    if (!equipment) {
      throw new AppError(404, "Equipment not found");
    }

    const updated = await prisma.equipment.update({
      where: { id },
      data,
      include: {
        department: { select: { id: true, name: true } },
      },
    });

    res.json(updated);
  }
);

export const updateEquipmentStatus: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(EquipmentStatus).includes(status)) {
      throw new AppError(400, "Invalid equipment status");
    }

    const updated = await prisma.equipment.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  }
);

export const deleteEquipment: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const equipment = await prisma.equipment.findUnique({ where: { id } });
    if (!equipment) {
      throw new AppError(404, "Equipment not found");
    }

    await prisma.equipment.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: "Equipment deactivated successfully" });
  }
);

export const updateEquipmentInventory: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { quantity, minThreshold, maxThreshold } = req.body;

    const equipment = await prisma.equipment.findUnique({ where: { id } });
    if (!equipment) {
      throw new AppError(404, "Equipment not found");
    }

    let inventory = await prisma.equipmentInventory.findFirst({
      where: { equipmentId: id },
    });

    if (inventory) {
      inventory = await prisma.equipmentInventory.update({
        where: { id: inventory.id },
        data: {
          quantity: quantity ?? inventory.quantity,
          minThreshold: minThreshold ?? inventory.minThreshold,
          maxThreshold: maxThreshold ?? inventory.maxThreshold,
        },
      });
    } else {
      inventory = await prisma.equipmentInventory.create({
        data: {
          equipmentId: id,
          quantity: quantity || 1,
          minThreshold: minThreshold || 5,
          maxThreshold: maxThreshold || 50,
        },
      });
    }

    res.json(inventory);
  }
);
