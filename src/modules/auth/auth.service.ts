import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { Socket } from "socket.io"
import { UsersService } from "../users/users.service"
import { SignInDto } from "./dto/sign-in.dto"
import { JwtPayload } from "./interfaces/jwt-payload.interface"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(signInDto: SignInDto) {
    const user = await this.usersService.findOneByUsername(signInDto.username)
    if (!user || !(await bcrypt.compare(signInDto.password, user.password)))
      return null
    return user
  }

  async getUserFromSocket(client: Socket) {
    try {
      const payload: JwtPayload = this.jwtService.verify(
        client.handshake.auth.token,
      )
      return this.usersService.findOneById(payload.id)
    } catch (error) {
      client.disconnect()
    }
  }
}
