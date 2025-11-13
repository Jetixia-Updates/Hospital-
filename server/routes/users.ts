import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import { createUserSchema, updateUserSchema } from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export const getUsers: RequestHandler = asyncHandler(async (req, res) => {
  const { role, department, skip = 0, take = 10 } = req.query;

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (department) where.departmentId = department;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true,
        department: { select: { id: true, name: true } },
      },
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    users,
    total,
    skip: parseInt(skip as string),
    take: parseInt(take as string),
  });
});

export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      phoneNumber: true,
      dateOfBirth: true,
      gender: true,
      address: true,
      city: true,
      postalCode: true,
      isActive: true,
      createdAt: true,
      department: { select: { id: true, name: true } },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.json(user);
});

export const createUser: RequestHandler = asyncHandler(async (req, res) => {
  const data = createUserSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      role: data.role as UserRole,
      departmentId: data.departmentId,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      phoneNumber: true,
      isActive: true,
      createdAt: true,
      department: { select: { id: true, name: true } },
    },
  });

  res.status(201).json(user);
});

export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = updateUserSchema.parse(req.body);

  // Check if user is updating their own profile or is an admin
  if (req.user?.userId !== id && req.user?.role !== UserRole.ADMIN) {
    throw new AppError(403, "Cannot update other user profiles");
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      gender: data.gender,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      phoneNumber: true,
      address: true,
      city: true,
      postalCode: true,
    },
  });

  res.json(user);
});

export const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });

  res.json({ message: "User deactivated successfully" });
});

export const updateUserRole: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      throw new AppError(400, "Invalid role");
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res.json(user);
  }
);

export const assignDepartment: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { departmentId } = req.body;

    if (!departmentId) {
      throw new AppError(400, "Department ID is required");
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new AppError(404, "Department not found");
    }

    const user = await prisma.user.update({
      where: { id },
      data: { departmentId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        department: { select: { id: true, name: true } },
      },
    });

    res.json(user);
  }
);
