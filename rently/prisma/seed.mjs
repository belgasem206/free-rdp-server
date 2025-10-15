import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@rently.local" },
    update: {},
    create: {
      email: "admin@rently.local",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  const org = await prisma.organization.create({
    data: {
      name: "Rently Demo Org",
      slug: "rently-demo",
      createdByUserId: admin.id,
      members: {
        create: [{ userId: admin.id, role: "OWNER" }],
      },
    },
  });

  const building = await prisma.building.create({
    data: {
      organizationId: org.id,
      name: "Marina Tower",
      address: "Dubai Marina",
      city: "Dubai",
      country: "UAE",
    },
  });

  const unit101 = await prisma.unit.create({
    data: {
      buildingId: building.id,
      unitNumber: "101",
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 110,
      rentAmount: 90000,
      currency: "AED",
      status: "VACANT",
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      organizationId: org.id,
      fullName: "Ahmed Ali",
      email: "ahmed@example.com",
      phone: "+971500000000",
    },
  });

  const lease = await prisma.lease.create({
    data: {
      organizationId: org.id,
      unitId: unit101.id,
      tenantId: tenant.id,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rentAmount: 90000,
      currency: "AED",
      paymentFrequency: "MONTHLY",
      status: "ACTIVE",
    },
  });

  await prisma.invoice.create({
    data: {
      leaseId: lease.id,
      number: "INV-0001",
      dueDate: new Date(),
      amount: 7500,
      currency: "AED",
      status: "DUE",
    },
  });

  console.log("Seed complete. Admin: admin@rently.local / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
