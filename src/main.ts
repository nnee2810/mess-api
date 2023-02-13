import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { PrismaService } from "./modules/prisma/prisma.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.CLIENT_URL],
    },
  })

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(process.env.PORT)
}
bootstrap()
