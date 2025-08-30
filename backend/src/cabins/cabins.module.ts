import { Module } from "@nestjs/common";
import { CabinsController } from "./cabins.controller";
import { CabinsService } from "./cabins.service";

@Module({
  controllers: [CabinsController],
  providers: [CabinsService],
  exports: [CabinsService],
})
export class CabinsModule {}
