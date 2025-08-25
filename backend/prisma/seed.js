import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.cabin.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.settings.deleteMany();

  console.log("🧹 Cleared existing data");

  // Create settings
  const settings = await prisma.settings.create({
    data: {
      minBookingLength: 1,
      maxBookingLength: 30,
      maxGuestsPerBooking: 10,
      breakfastPrice: 15,
    },
  });
  console.log("⚙️ Created settings:", settings);

  // Create sample cabins
  const cabins = await Promise.all([
    prisma.cabin.create({
      data: {
        name: "001",
        maxCapacity: 2,
        regularPrice: 250,
        discount: 0,
        image: "/cabins/cabin-001.jpg",
        description:
          "Cozy cabin perfect for couples, featuring a romantic fireplace and mountain views.",
      },
    }),
    prisma.cabin.create({
      data: {
        name: "002",
        maxCapacity: 4,
        regularPrice: 350,
        discount: 25,
        image: "/cabins/cabin-002.jpg",
        description:
          "Spacious family cabin with two bedrooms and a fully equipped kitchen.",
      },
    }),
    prisma.cabin.create({
      data: {
        name: "003",
        maxCapacity: 6,
        regularPrice: 450,
        discount: 0,
        image: "/cabins/cabin-003.jpg",
        description:
          "Luxury cabin with hot tub, game room, and panoramic mountain vistas.",
      },
    }),
    prisma.cabin.create({
      data: {
        name: "004",
        maxCapacity: 3,
        regularPrice: 300,
        discount: 50,
        image: "/cabins/cabin-004.jpg",
        description:
          "Charming cabin with a loft bedroom and private deck overlooking the forest.",
      },
    }),
    prisma.cabin.create({
      data: {
        name: "005",
        maxCapacity: 5,
        regularPrice: 400,
        discount: 0,
        image: "/cabins/cabin-005.jpg",
        description:
          "Family-friendly cabin with bunk beds for kids and a large living area.",
      },
    }),
    prisma.cabin.create({
      data: {
        name: "006",
        maxCapacity: 2,
        regularPrice: 280,
        discount: 0,
        image: "/cabins/cabin-006.jpg",
        description:
          "Intimate cabin with a king-size bed and private hot tub on the deck.",
      },
    }),
    prisma.cabin.create({
      data: {
        name: "007",
        maxCapacity: 4,
        regularPrice: 380,
        discount: 0,
        image: "/cabins/cabin-001.jpg",
        description:
          "Modern cabin with floor-to-ceiling windows and a gourmet kitchen.",
      },
    }),
    prisma.cabin.create({
      data: {
        name: "008",
        maxCapacity: 6,
        regularPrice: 500,
        discount: 100,
        image: "/cabins/cabin-008.jpg",
        description:
          "Premium cabin with multiple levels, home theater, and outdoor fire pit.",
      },
    }),
  ]);
  console.log("🏠 Created", cabins.length, "cabins");

  // Create sample guests
  const guests = await Promise.all([
    prisma.guest.create({
      data: {
        email: "john.doe@example.com",
        fullName: "John Doe",
      },
    }),
    prisma.guest.create({
      data: {
        email: "jane.smith@example.com",
        fullName: "Jane Smith",
      },
    }),
    prisma.guest.create({
      data: {
        email: "mike.johnson@example.com",
        fullName: "Mike Johnson",
      },
    }),
  ]);
  console.log("👥 Created", guests.length, "guests");

  // Create sample bookings
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        startDate: tomorrow,
        endDate: nextWeek,
        numNights: 6,
        numGuests: 2,
        totalPrice: 1500,
        guestId: guests[0].id,
        cabinId: cabins[0].id,
        status: "confirmed",
        isPaid: true,
        hasBreakfast: true,
        observations: "Early check-in preferred if possible.",
      },
    }),
    prisma.booking.create({
      data: {
        startDate: nextMonth,
        endDate: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
        numNights: 3,
        numGuests: 4,
        totalPrice: 1050,
        guestId: guests[1].id,
        cabinId: cabins[1].id,
        status: "unconfirmed",
        isPaid: false,
        hasBreakfast: false,
        observations: "Family with two children, ages 8 and 12.",
      },
    }),
    prisma.booking.create({
      data: {
        startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
        numNights: 3,
        numGuests: 2,
        totalPrice: 840,
        guestId: guests[2].id,
        cabinId: cabins[2].id,
        status: "checked-out",
        isPaid: true,
        hasBreakfast: true,
        observations: "Wonderful stay! Will definitely return.",
      },
    }),
  ]);
  console.log("📅 Created", bookings.length, "bookings");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
