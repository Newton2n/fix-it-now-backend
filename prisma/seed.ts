import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "../src/config";
import {
  PrismaClient,
  UserActiveStatus,
  UserRole,
} from "../generated/prisma/client";

const pool = new Pool({
  connectionString: config.database_url,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log(" Seeding database...");

  // Hash  password
  const hashedPassword = await bcrypt.hash(
    config.admin_password,
    Number(config.bcrypt_salt_rounds),
  );

  // Admin
  await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserActiveStatus.ACTIVE,
    },
  });

  // Categories
  const categories = [
    {
      name: "Electrical",
      description: "Electrical installation, maintenance, and repair services.",
    },
    {
      name: "Plumbing",
      description: "Plumbing installation, maintenance, and repair services.",
    },
    {
      name: "Cleaning",
      description: "Residential and commercial cleaning services.",
    },
    {
      name: "Painting",
      description: "Interior and exterior painting services.",
    },
    {
      name: "Carpentry",
      description: "Woodworking and furniture repair services.",
    },
    {
      name: "AC Repair",
      description: "Air conditioner installation and repair services.",
    },
    {
      name: "Home Appliance Repair",
      description: "Repair services for home appliances.",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name: category.name,
      },
      update: {},
      create: category,
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
