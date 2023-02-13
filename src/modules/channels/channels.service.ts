import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PaginationDto } from "src/dto/pagination.dto"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class ChannelsService {
  constructor(private prismaService: PrismaService) {}

  create(users: string[]) {
    return this.prismaService.channel.create({
      data: {
        users: {
          create: users.map((userId) => ({ userId })),
        },
      },
    })
  }

  findAllByUserId(userId: string, query: PaginationDto) {
    const where: Prisma.ChannelWhereInput = {
      users: {
        some: {
          userId,
        },
      },
      NOT: {
        messages: {
          none: {},
        },
      },
    }
    return this.prismaService.$transaction([
      this.prismaService.channel.findMany({
        include: {
          users: {
            where: {
              userId: {
                not: userId,
              },
            },
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        where,
        ...query,
      }),
      this.prismaService.channel.count({ where }),
    ])
  }

  findOneByUsers(users: string[]) {
    return this.prismaService.channel.findFirst({
      where: {
        users: {
          every: {
            userId: {
              in: users,
            },
          },
        },
      },
    })
  }
}
