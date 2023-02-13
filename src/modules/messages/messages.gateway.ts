import { UseGuards } from "@nestjs/common"
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets"
import { WebSocketServer } from "@nestjs/websockets/decorators"
import { User } from "@prisma/client"
import { Server } from "socket.io"
import { SocketEvent } from "src/configs/constants"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { SocketGuard } from "../auth/guards/socket.guard"
import { ChannelsService } from "../channels/channels.service"
import { DevicesService } from "../devices/devices.service"
import { MessagesService } from "../messages/messages.service"
import { SendMessageDto } from "./dto/send-message.dto"

@UseGuards(SocketGuard)
@WebSocketGateway({
  cors: true,
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server

  constructor(
    private devicesService: DevicesService,
    private messagesService: MessagesService,
    private channelsService: ChannelsService,
  ) {}

  @SubscribeMessage(SocketEvent.SEND_MESSAGE)
  async sendMessage(
    @MessageBody() data: SendMessageDto,
    @CurrentUser({ isSocket: true }) currentUser: User,
  ) {
    const channel = await this.channelsService.findOneByUsers([
      currentUser.id,
      data.userId,
    ])
    const message = await this.messagesService.create(
      currentUser.id,
      channel.id,
      data.message,
    )
    const devices = await this.devicesService.findAllByUsers([
      currentUser.id,
      data.userId,
    ])

    devices.forEach((id) =>
      this.server.to(id).emit(SocketEvent.SEND_MESSAGE, message),
    )
  }
}
