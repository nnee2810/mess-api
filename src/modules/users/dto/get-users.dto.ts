import { IsOptional, IsString } from "class-validator"
import { PaginationDto } from "src/dto/pagination.dto"

export class GetUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  username?: string
}
