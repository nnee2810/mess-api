import { UseGuards } from "@nestjs/common"
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from "@nestjs/websockets"
import { Socket } from "socket.io"
import { handleErrorException } from "./helpers/handleErrorException"
import { AuthService } from "./modules/auth/auth.service"
import { SocketGuard } from "./modules/auth/guards/socket.guard"
import { DevicesService } from "./modules/devices/devices.service"

@UseGuards(SocketGuard)
@WebSocketGateway({
  cors: true,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private authService: AuthService,
    private devicesService: DevicesService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const user = await this.authService.getUserFromSocket(client)
      if (user) await this.devicesService.create(user.id, client.id)
      else client.disconnect()
    } catch (error) {
      handleErrorException(error, true)
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = await this.authService.getUserFromSocket(client)
      if (user) await this.devicesService.deleteOneBySocketId(client.id)
    } catch (error) {
      handleErrorException(error, true)
    }
  }
}
