import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async listBookings(@Query("guestId") guestId?: string) {
    const guestIdNum = guestId ? parseInt(guestId, 10) : undefined;
    return this.bookingsService.listBookings(guestIdNum);
  }

  @Get("all")
  async listAllBookings() {
    return this.bookingsService.listAllBookings();
  }

  @Get(":bookingId")
  async getBooking(@Param("bookingId", ParseIntPipe) bookingId: number) {
    return this.bookingsService.getBooking(bookingId);
  }

  @Post()
  async createBooking(@Body() createBookingDto: any) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Put(":bookingId")
  async updateBooking(
    @Param("bookingId", ParseIntPipe) bookingId: number,
    @Body() updateBookingDto: any
  ) {
    return this.bookingsService.updateBooking(bookingId, updateBookingDto);
  }

  @Delete(":bookingId")
  async deleteBooking(@Param("bookingId", ParseIntPipe) bookingId: number) {
    return this.bookingsService.deleteBooking(bookingId);
  }
}
