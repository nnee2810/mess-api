import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"
import { Key } from "src/constants/key"

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(ctx: ExecutionContext) {
    const publicRoute = this.reflector.get<boolean>(
      Key.PUBLIC_ROUTE,
      ctx.getHandler(),
    )
    if (publicRoute) return true

    return super.canActivate(ctx)
  }
}
