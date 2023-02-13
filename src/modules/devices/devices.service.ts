import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class DevicesService {
  constructor(private prismaService: PrismaService) {}

  create(userId: string, socketId: string) {
    return this.prismaService.device.create({
      data: {
        userId,
        socketId,
      },
    })
  }

  findAllByUserId(userId: string) {
    return this.prismaService.device.findMany({
      where: {
        userId,
      },
    })
  }

  async findAllByUsers(users: string[]) {
    return (
      await this.prismaService.device.findMany({
        where: {
          userId: {
            in: users,
          },
        },
      })
    ).map((device) => device.socketId)
  }

  deleteOneBySocketId(socketId: string) {
    return this.prismaService.device.delete({
      where: {
        socketId,
      },
    })
  }

  deleteAllByUserId(userId: string) {
    return this.prismaService.device.deleteMany({
      where: {
        userId,
      },
    })
  }
}
