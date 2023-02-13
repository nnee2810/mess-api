import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PaginationDto } from "src/dto/pagination.dto"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService) {}

  create(userId: string, channelId: string, message: string) {
    return this.prismaService.message.create({
      data: {
        userId,
        channelId,
        message,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })
  }

  findAllByChannelId(channelId: string, query: PaginationDto) {
    const where: Prisma.MessageWhereInput = {
      channelId,
    }
    return this.prismaService.$transaction([
      this.prismaService.message.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        ...query,
      }),
      this.prismaService.message.count({
        where,
      }),
    ])
  }
}
