import { RequestHandler } from "express";
import { prisma } from "../lib/db";
import { createLabTestSchema, updateLabTestSchema } from "../lib/validation";
import { AppError, asyncHandler } from "../middleware/error";

export const getLabTests: RequestHandler = asyncHandler(async (req, res) => {
  const { patientId, recordId, status, skip = 0, take = 10, search } =
    req.query;

  const where: Record<string, unknown> = {};
  if (patientId) where.patientId = patientId;
  if (recordId) where.recordId = recordId;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { testName: { contains: search as string, mode: "insensitive" as const } },
      { testCode: { contains: search as string, mode: "insensitive" as const } },
    ];
  }

  const [tests, total] = await Promise.all([
    prisma.labTest.findMany({
      where,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        record: { select: { id: true } },
      },
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      orderBy: { testDate: "desc" },
    }),
    prisma.labTest.count({ where }),
  ]);

  res.json({
    tests,
    total,
    skip: parseInt(skip as string),
    take: parseInt(take as string),
  });
});

export const getLabTest: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const test = await prisma.labTest.findUnique({
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
      record: { select: { id: true } },
    },
  });

  if (!test) {
    throw new AppError(404, "Lab test not found");
  }

  res.json(test);
});

export const createLabTest: RequestHandler = asyncHandler(async (req, res) => {
  const data = createLabTestSchema.parse(req.body);

  const [patient, record] = await Promise.all([
    prisma.user.findUnique({ where: { id: data.patientId } }),
    prisma.medicalRecord.findUnique({ where: { id: data.recordId } }),
  ]);

  if (!patient) {
    throw new AppError(404, "Patient not found");
  }

  if (!record) {
    throw new AppError(404, "Medical record not found");
  }

  const test = await prisma.labTest.create({
    data: {
      patientId: data.patientId,
      recordId: data.recordId,
      testName: data.testName,
      testCode: data.testCode,
      result: data.result,
      resultValue: data.resultValue,
      unit: data.unit,
      referenceRange: data.referenceRange,
      status: "PENDING",
    },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  res.status(201).json(test);
});

export const updateLabTest: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = updateLabTestSchema.parse(req.body);

  const test = await prisma.labTest.findUnique({ where: { id } });
  if (!test) {
    throw new AppError(404, "Lab test not found");
  }

  const updated = await prisma.labTest.update({
    where: { id },
    data: {
      ...data,
      resultDate:
        data.result && !test.resultDate ? new Date() : test.resultDate,
    },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  res.json(updated);
});

export const publishLabTestResult: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { result, resultValue, status } = req.body;

    const test = await prisma.labTest.findUnique({ where: { id } });
    if (!test) {
      throw new AppError(404, "Lab test not found");
    }

    const updated = await prisma.labTest.update({
      where: { id },
      data: {
        result,
        resultValue,
        status: status || "COMPLETED",
        resultDate: new Date(),
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.json(updated);
  }
);

export const deleteLabTest: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const test = await prisma.labTest.findUnique({ where: { id } });
  if (!test) {
    throw new AppError(404, "Lab test not found");
  }

  await prisma.labTest.delete({ where: { id } });

  res.json({ message: "Lab test deleted successfully" });
});

export const getPatientLabTests: RequestHandler = asyncHandler(
  async (req, res) => {
    const { patientId } = req.params;
    const { skip = 0, take = 20 } = req.query;

    const [tests, total] = await Promise.all([
      prisma.labTest.findMany({
        where: { patientId },
        include: {
          record: { select: { id: true, recordDate: true } },
        },
        skip: parseInt(skip as string),
        take: parseInt(take as string),
        orderBy: { testDate: "desc" },
      }),
      prisma.labTest.count({ where: { patientId } }),
    ]);

    res.json({
      patientId,
      tests,
      total,
      skip: parseInt(skip as string),
      take: parseInt(take as string),
    });
  }
);
