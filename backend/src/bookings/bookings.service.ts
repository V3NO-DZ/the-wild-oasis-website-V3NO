import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  createBooking as createBookingModel,
  deleteBooking as deleteBookingModel,
  getBooking as getBookingModel,
  getBookings as getBookingsModel,
  getAllBookings as getAllBookingsModel,
  updateBooking as updateBookingModel,
} from "../models/bookingModel.js";

@Injectable()
export class BookingsService {
  async listBookings(guestId?: number) {
    try {
      if (guestId) {
        // If guestId is provided, get bookings for that guest
        const bookings = await getBookingsModel(guestId);
        return bookings;
      } else {
        // If no guestId is provided, get all bookings
        const bookings = await getAllBookingsModel();
        return bookings;
      }
    } catch (error) {
      throw new InternalServerErrorException("Bookings could not get loaded");
    }
  }

  async listAllBookings() {
    try {
      const bookings = await getAllBookingsModel();
      return bookings;
    } catch (error) {
      throw new InternalServerErrorException("Bookings could not get loaded");
    }
  }

  async getBooking(bookingId: number) {
    if (!bookingId) {
      throw new BadRequestException("Invalid booking id");
    }

    try {
      const booking = await getBookingModel(bookingId);
      if (!booking) {
        throw new NotFoundException("Booking not found");
      }
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Internal server error");
    }
  }

  async createBooking(createBookingDto: any) {
    try {
      const booking = await createBookingModel(createBookingDto);
      return booking;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async updateBooking(bookingId: number, updateBookingDto: any) {
    if (!bookingId) {
      throw new BadRequestException("Invalid booking id");
    }

    try {
      const booking = await updateBookingModel(bookingId, updateBookingDto);
      return booking;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async deleteBooking(bookingId: number) {
    if (!bookingId) {
      throw new BadRequestException("Invalid booking id");
    }

    try {
      await deleteBookingModel(bookingId);
      return { message: "Booking deleted successfully" };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
