import { Injectable } from "@nestjs/common"
import { UnauthorizedException } from "@nestjs/common/exceptions"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Key } from "src/constants/key"
import { UsersService } from "src/modules/users/users.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies[Key.TOKEN],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    })
  }

  async validate({ id }: { id: string }) {
    const { password, ...user } = await this.usersService.getById(id)
    if (!user) throw new UnauthorizedException()
    return user
  }
}
