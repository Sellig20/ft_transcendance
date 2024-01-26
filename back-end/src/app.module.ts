import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


// import { ConfigModule } from '@nestjs/config';
// import { Module } from '@nestjs/common';
// <<<<<<< HEAD
// // import { PrismaModule } from './prisma/prisma.module';
// // import { AuthModule } from './auth/auth.module';
// // import { UserModule } from './user/user.module';
// // import { BookmarkModule } from './bookmark/bookmark.module';
// import { gatewayModule } from './gateway/gateway.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [gatewayModule],
//   controllers: [AppController],
//   providers: [AppService],
//   // imports: [
//   //   ConfigModule.forRoot({
//   //     isGlobal: true,
//   //   }),
//   //   AuthModule, 
//   //   BookmarkModule,
//   //   UserModule,
//   //   PrismaModule],
//   //   providers: [AppGateway],
// =======
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
  ],
})

export class AppModule {}
