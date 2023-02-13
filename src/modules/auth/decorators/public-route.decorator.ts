import { SetMetadata } from "@nestjs/common"
import { Key } from "src/configs/constants"

export const PublicRoute = () => SetMetadata(Key.PUBLIC_ROUTE, true)
