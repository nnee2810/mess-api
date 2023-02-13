import { BadRequestException, Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"
import * as bcrypt from "bcrypt"
import { PaginationData } from "src/interfaces/pagination-data.interface"
import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { GetUsersDto } from "./dto/get-users.dto"

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create({ password, ...data }: CreateUserDto) {
    const user = await this.findOneByUsername(data.username)
    if (user) throw new BadRequestException("Người dùng này đã tồn tại")
    const hashPassword = await bcrypt.hash(password, 10)
    return this.prismaService.user.create({
      data: {
        ...data,
        password: hashPassword,
      },
    })
  }

  findOneById(id: string, options?: Partial<Prisma.UserFindUniqueArgs>) {
    return this.prismaService.user.findUnique({ where: { id }, ...options })
  }

  findOneByUsername(username: string) {
    return this.prismaService.user.findUnique({ where: { username } })
  }

  async findAll(
    userId: string,
    { username, take, skip }: GetUsersDto,
  ): Promise<PaginationData<Partial<User>>> {
    const where: Prisma.UserWhereInput = {
      id: {
        not: userId,
      },
    }
    if (username)
      where.username = {
        contains: username,
      }

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          username: true,
        },
        take,
      }),
      this.prismaService.user.count({
        where,
      }),
    ])

    return { data, total, take, skip }
  }

  updateOneById(id: string, data: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
    })
  }
}
