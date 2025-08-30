import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  createGuest as createGuestModel,
  getGuestByEmail,
  updateGuest as updateGuestModel,
} from "../models/guestModel.js";

@Injectable()
export class GuestsService {
  async getGuest(email: string) {
    if (!email) {
      throw new BadRequestException("Email is required");
    }

    try {
      const guest = await getGuestByEmail(email);
      if (!guest) {
        throw new NotFoundException("Guest not found");
      }
      return guest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Internal server error");
    }
  }

  async createGuest(createGuestDto: any) {
    try {
      const guest = await createGuestModel(createGuestDto);
      return guest;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async updateGuest(guestId: number, updateGuestDto: any) {
    if (!guestId) {
      throw new BadRequestException("Invalid guest id");
    }

    try {
      const guest = await updateGuestModel(guestId, updateGuestDto);
      return guest;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
