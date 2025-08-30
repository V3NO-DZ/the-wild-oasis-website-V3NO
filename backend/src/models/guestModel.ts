import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Guest = {
  id?: number;
  email: string;
  fullName: string;
  nationality?: string;
  countryFlag?: string;
  nationalID?: string;
  created_at?: Date;
  updated_at?: Date;
};

export async function getGuestByEmail(email: string) {
  try {
    const guest = await prisma.guest.findUnique({ where: { email } });
    return guest;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createGuest(newGuest: Guest) {
  try {
    const guest = await prisma.guest.create({ data: newGuest });
    return guest;
  } catch (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }
}

export async function updateGuest(
  id: number,
  updatedFields: Partial<Omit<Guest, "id" | "created_at" | "updated_at">>
) {
  try {
    const guest = await prisma.guest.update({
      where: { id },
      data: updatedFields,
    });
    return guest;
  } catch (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
}
