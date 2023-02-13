import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { ChannelsModule } from "../channels/channels.module"
import { DevicesModule } from "../devices/devices.module"
import { PrismaService } from "../prisma/prisma.service"
import { UsersModule } from "../users/users.module"
import { MessagesController } from "./messages.controller"
import { MessagesGateway } from "./messages.gateway"
import { MessagesService } from "./messages.service"

@Module({
  imports: [DevicesModule, AuthModule, UsersModule, ChannelsModule],
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, MessagesGateway],
  exports: [MessagesService],
})
export class MessagesModule {}
