import { HttpException, InternalServerErrorException } from "@nestjs/common"

export function handleErrorException(error: any, isSocket?: boolean) {
  if (error instanceof HttpException)
    throw new HttpException(error.message, error.getStatus())
  if (isSocket) throw new InternalServerErrorException(error?.message)
  throw new InternalServerErrorException(error?.message)
}
