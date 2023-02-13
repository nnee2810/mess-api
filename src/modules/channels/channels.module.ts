import { Module } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { ChannelsService } from "./channels.service"

@Module({
  providers: [ChannelsService, PrismaService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
