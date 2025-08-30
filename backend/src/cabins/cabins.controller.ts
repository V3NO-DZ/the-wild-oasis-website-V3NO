import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { CabinsService } from "./cabins.service";

@Controller("cabins")
export class CabinsController {
  constructor(private readonly cabinsService: CabinsService) {}

  @Get()
  async listCabins() {
    return this.cabinsService.listCabins();
  }

  @Get(":cabinId")
  async getCabinWithBookedDates(
    @Param("cabinId", ParseIntPipe) cabinId: number
  ) {
    return this.cabinsService.getCabinWithBookedDates(cabinId);
  }

  @Get(":cabinId/price")
  async getPrice(@Param("cabinId", ParseIntPipe) cabinId: number) {
    return this.cabinsService.getPrice(cabinId);
  }
}
