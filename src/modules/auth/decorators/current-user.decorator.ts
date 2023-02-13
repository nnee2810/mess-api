import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { User } from "@prisma/client"
import { Request } from "express"

export interface RequestWithUser extends Request {
  user: User
}

interface CurrentUserArgs {
  field?: keyof User
  isSocket?: boolean
}

export const CurrentUser = createParamDecorator(
  (args: CurrentUserArgs, context: ExecutionContext) => {
    const user = args?.isSocket
      ? context.switchToWs().getClient().user
      : context.switchToHttp().getRequest().user
    return args?.field ? user[args.field] : user
  },
)
