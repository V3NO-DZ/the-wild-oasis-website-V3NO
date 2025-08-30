import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { GuestsService } from "./guests.service";

@Controller("guests")
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  async getGuest(@Query("email") email: string) {
    return this.guestsService.getGuest(email);
  }

  @Post()
  async createGuest(@Body() createGuestDto: any) {
    return this.guestsService.createGuest(createGuestDto);
  }

  @Put(":guestId")
  async updateGuest(
    @Param("guestId", ParseIntPipe) guestId: number,
    @Body() updateGuestDto: any
  ) {
    return this.guestsService.updateGuest(guestId, updateGuestDto);
  }
}
