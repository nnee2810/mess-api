import { SetMetadata } from "@nestjs/common"
import { Key } from "src/constants/key"

export const PublicRoute = () => SetMetadata(Key.PUBLIC_ROUTE, true)
