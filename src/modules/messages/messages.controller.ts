import { Controller, Get, Param, Query } from "@nestjs/common"
import { Message, User } from "@prisma/client"
import { PaginationDto } from "src/dto/pagination.dto"
import { handleErrorException } from "src/helpers/handleErrorException"
import { PaginationData } from "src/interfaces/pagination-data.interface"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { ChannelsService } from "../channels/channels.service"
import { MessagesService } from "./messages.service"

@Controller("messages")
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private channelsService: ChannelsService,
  ) {}

  @Get()
  async getAllConversations(
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: User,
  ) {
    try {
      const [data, total] = await this.channelsService.findAllByUserId(
        currentUser.id,
        query,
      )
      return {
        data: data.map((item) => ({
          channelId: item.id,
          user: item.users[0].user,
          lastMessage: item.messages[0],
        })),
        total,
        ...query,
      }
    } catch (error) {
      handleErrorException(error)
    }
  }

  @Get(":id")
  async getAllMessages(
    @Param("id") id: string,
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: User,
  ): Promise<PaginationData<Message>> {
    try {
      let channel = await this.channelsService.findOneByUsers([
        id,
        currentUser.id,
      ])
      if (!channel)
        channel = await this.channelsService.create([currentUser.id, id])
      const [data, total] = await this.messagesService.findAllByChannelId(
        channel.id,
        query,
      )
      return {
        data,
        total,
        ...query,
      }
    } catch (error) {
      handleErrorException(error)
    }
  }
}
