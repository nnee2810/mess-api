import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "@prisma/client"
import { handleErrorException } from "src/helpers/handleErrorException"
import { exclude } from "src/utils/exclude"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { UsersService } from "../users/users.service"
import { AuthService } from "./auth.service"
import { CurrentUser } from "./decorators/current-user.decorator"
import { PublicRoute } from "./decorators/public-route.decorator"
import { SignInDto } from "./dto/sign-in.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @PublicRoute()
  @Post("sign-in")
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const user = await this.authService.validateUser(signInDto)
      if (!user) throw new UnauthorizedException()
      const token = this.jwtService.sign({
        id: user.id,
      })

      return { token, user: exclude(user, ["password"]) }
    } catch (error) {
      handleErrorException(error)
    }
  }

  @PublicRoute()
  @Post("sign-up")
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto)

      return exclude(user, ["password"])
    } catch (error) {
      handleErrorException(error)
    }
  }

  @Post("check")
  check(@CurrentUser() currentUser: User) {
    return exclude(currentUser, ["password"])
  }
}
