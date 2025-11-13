import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean up existing data (optional)
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.clinic.deleteMany({});

  // Create departments
  const cardiology = await prisma.department.create({
    data: {
      name: "Cardiology",
      description: "Heart and cardiovascular diseases",
      phone: "+1-555-0100",
      email: "cardiology@hospital.com",
      isActive: true,
    },
  });

  const orthopedics = await prisma.department.create({
    data: {
      name: "Orthopedics",
      description: "Bone and joint disorders",
      phone: "+1-555-0101",
      email: "orthopedics@hospital.com",
      isActive: true,
    },
  });

  const pediatrics = await prisma.department.create({
    data: {
      name: "Pediatrics",
      description: "Children's health care",
      phone: "+1-555-0102",
      email: "pediatrics@hospital.com",
      isActive: true,
    },
  });

  // Create test users for each role
  const testUsers = [
    {
      email: "admin@hospital.com",
      password: "Admin@123456",
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      phoneNumber: "+1-555-0001",
      departmentId: null,
    },
    {
      email: "manager@hospital.com",
      password: "Manager@123456",
      firstName: "John",
      lastName: "Manager",
      role: UserRole.MANAGER,
      phoneNumber: "+1-555-0002",
      departmentId: cardiology.id,
    },
    {
      email: "doctor@hospital.com",
      password: "Doctor@123456",
      firstName: "Dr. Sarah",
      lastName: "Johnson",
      role: UserRole.DOCTOR,
      phoneNumber: "+1-555-0003",
      departmentId: cardiology.id,
    },
    {
      email: "nurse@hospital.com",
      password: "Nurse@123456",
      firstName: "Emily",
      lastName: "Nurse",
      role: UserRole.NURSE,
      phoneNumber: "+1-555-0004",
      departmentId: cardiology.id,
    },
    {
      email: "receptionist@hospital.com",
      password: "Receptionist@123456",
      firstName: "Michael",
      lastName: "Receptionist",
      role: UserRole.RECEPTIONIST,
      phoneNumber: "+1-555-0005",
      departmentId: orthopedics.id,
    },
    {
      email: "lab_tech@hospital.com",
      password: "LabTech@123456",
      firstName: "David",
      lastName: "Lab Technician",
      role: UserRole.LAB_TECH,
      phoneNumber: "+1-555-0006",
      departmentId: null,
    },
    {
      email: "pharmacist@hospital.com",
      password: "Pharmacist@123456",
      firstName: "Lisa",
      lastName: "Pharmacist",
      role: UserRole.PHARMACIST,
      phoneNumber: "+1-555-0007",
      departmentId: null,
    },
    {
      email: "patient@hospital.com",
      password: "Patient@123456",
      firstName: "James",
      lastName: "Patient",
      role: UserRole.PATIENT,
      phoneNumber: "+1-555-0008",
      departmentId: null,
    },
  ];

  console.log("👥 Creating test users...");
  for (const userData of testUsers) {
    const hashedPassword = await hashPassword(userData.password);
    await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        departmentId: userData.departmentId,
        isActive: true,
      },
    });
    console.log(
      `✅ Created ${userData.role}: ${userData.email}`
    );
  }

  // Create clinics
  console.log("🏥 Creating clinics...");
  await prisma.clinic.create({
    data: {
      name: "Cardiology Clinic",
      specialization: "Cardiovascular",
      departmentId: cardiology.id,
      location: "Building A, Floor 2",
      phone: "+1-555-0200",
      email: "cardiology.clinic@hospital.com",
      capacity: 30,
      isActive: true,
    },
  });

  await prisma.clinic.create({
    data: {
      name: "Orthopedic Surgery Center",
      specialization: "Orthopedics",
      departmentId: orthopedics.id,
      location: "Building B, Floor 1",
      phone: "+1-555-0201",
      email: "ortho.clinic@hospital.com",
      capacity: 25,
      isActive: true,
    },
  });

  await prisma.clinic.create({
    data: {
      name: "Pediatric Wellness Center",
      specialization: "Pediatrics",
      departmentId: pediatrics.id,
      location: "Building C, Floor 3",
      phone: "+1-555-0202",
      email: "pediatric.clinic@hospital.com",
      capacity: 40,
      isActive: true,
    },
  });

  console.log("✅ Clinics created");

  console.log("\n✨ Database seeding completed successfully!");
  console.log("\n📋 Test User Credentials:\n");
  console.log("═".repeat(70));

  testUsers.forEach((user) => {
    console.log(`\n Role: ${user.role}`);
    console.log(`  Email:    ${user.email}`);
    console.log(`  Password: ${user.password}`);
  });

  console.log("\n" + "═".repeat(70));
  console.log(
    "\n⚠️  These are test credentials only. Change them in production!\n"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
