import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Response } from "express"
import { Key } from "src/constants/key"
import { handleErrorException } from "src/helpers/handleErrorException"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { UsersService } from "../users/users.service"
import { AuthService } from "./auth.service"
import { PublicRoute } from "./decorators/public-route.decorator"
import { SignInDto } from "./dto/sign-in.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post("sign-in")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(signInDto)
      if (!user) throw new UnauthorizedException()
      const token = this.jwtService.sign({
        id: user.id,
      })
      res.cookie(Key.TOKEN, token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      return "Success"
    } catch (error) {
      handleErrorException(error)
    }
  }

  @PublicRoute()
  @Post("sign-up")
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto)
    } catch (error) {
      handleErrorException(error)
    }
  }
}
