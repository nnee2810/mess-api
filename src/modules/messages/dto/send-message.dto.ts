import { IsString } from "class-validator"

export class SendMessageDto {
  @IsString()
  userId: string

  @IsString()
  message: string
}
