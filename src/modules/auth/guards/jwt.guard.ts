import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"
import { Key } from "src/configs/constants"

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const publicRoute = this.reflector.get<boolean>(
      Key.PUBLIC_ROUTE,
      context.getHandler(),
    )
    if (publicRoute) return true

    return super.canActivate(context)
  }
}
