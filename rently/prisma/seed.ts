import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const passwordHash = await bcrypt.hash("admin1234", 10);

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

  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      slug: "demo-org",
      name: "Demo Org",
      createdByUserId: admin.id,
      members: {
        create: [{ userId: admin.id, role: "OWNER" }],
      },
      buildings: {
        create: [
          {
            name: "Rently Tower",
            city: "Dubai",
            country: "UAE",
            units: {
              create: [
                { unitNumber: "101", bedrooms: 2, bathrooms: 2, status: "VACANT", rentAmount: 5000, currency: "AED" },
                { unitNumber: "102", bedrooms: 1, bathrooms: 1, status: "VACANT", rentAmount: 3500, currency: "AED" }
              ],
            },
          },
        ],
      },
      tenants: {
        create: [
          { fullName: "Omar Ali", email: "omar@example.com", phone: "+971500000000" },
          { fullName: "Sara Khan", email: "sara@example.com", phone: "+971511111111" }
        ],
      },
    },
  });

  console.log({ adminId: admin.id, orgId: org.id });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
