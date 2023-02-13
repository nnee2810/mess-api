import { Module } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { DevicesService } from "./devices.service"

@Module({
  providers: [DevicesService, PrismaService],
  exports: [DevicesService],
})
export class DevicesModule {}
