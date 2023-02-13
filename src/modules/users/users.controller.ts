import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common"
import { User } from "@prisma/client"
import { exclude } from "src/utils/exclude"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { GetUsersDto } from "./dto/get-users.dto"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(@Query() query: GetUsersDto, @CurrentUser() currentUser: User) {
    return this.usersService.findAll(currentUser.id, query)
  }

  @Get(":id")
  async getUser(@Param("id") id: string) {
    const user = await this.usersService.findOneById(id)
    if (!user) throw new NotFoundException()

    return exclude(user, ["password"])
  }
}
