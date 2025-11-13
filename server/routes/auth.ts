import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyRefreshToken,
} from "../lib/auth";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(409, "User with this email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender,
      role: data.role,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(201).json({
    user,
    ...tokens,
  });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.isActive) {
    throw new AppError(401, "Invalid credentials");
  }

  const passwordValid = await verifyPassword(data.password, user.password);
  if (!passwordValid) {
    throw new AppError(401, "Invalid credentials");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    ...tokens,
  });
});

export const refreshToken: RequestHandler = asyncHandler(async (req, res) => {
  const data = refreshTokenSchema.parse(req.body);

  const payload = verifyRefreshToken(data.refreshToken);
  if (!payload) {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.isActive) {
    throw new AppError(401, "User not found or inactive");
  }

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.json(tokens);
});

export const currentUser: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      phoneNumber: true,
      address: true,
      city: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.json(user);
});
