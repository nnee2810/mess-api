import { BadRequestException, Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create({ password, ...data }: CreateUserDto) {
    const user = await this.getByUsername(data.username)
    if (user) throw new BadRequestException("Người dùng này đã tồn tại")
    const hashPassword = await bcrypt.hash(password, 10)
    return this.prismaService.user.create({
      data: {
        ...data,
        password: hashPassword,
      },
      select: {
        id: true,
      },
    })
  }

  getById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } })
  }

  getByUsername(username: string) {
    return this.prismaService.user.findUnique({ where: { username } })
  }
}
