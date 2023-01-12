import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { User } from "@prisma/client"
import { Request } from "express"

interface RequestWithUser extends Request {
  user: User
}

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req: RequestWithUser = ctx.switchToHttp().getRequest()
    return data ? req.user?.[data] : req.user
  },
)
