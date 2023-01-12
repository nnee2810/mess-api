import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { UsersService } from "../users/users.service"
import { SignInDto } from "./dto/sign-in.dto"

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(signInDto: SignInDto) {
    const user = await this.usersService.getByUsername(signInDto.username)
    if (!user) return null
    if (!(await bcrypt.compare(signInDto.password, user.password))) return null
    return user
  }
}
