import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AppGateway } from "./app.gateway"
import { AuthModule } from "./modules/auth/auth.module"
import { JwtGuard } from "./modules/auth/guards/jwt.guard"
import { ChannelsModule } from "./modules/channels/channels.module"
import { DevicesModule } from "./modules/devices/devices.module"
import { MessagesModule } from "./modules/messages/messages.module"
import { UsersModule } from "./modules/users/users.module"

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DevicesModule,
    MessagesModule,
    ChannelsModule,
  ],
  providers: [
    AppGateway,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
