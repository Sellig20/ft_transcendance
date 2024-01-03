import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from "@nestjs/testing";
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
   
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = 
    await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
    }),
    );
    await app.init();

    prisma = app.get(PrismaService)

    await prisma.cleanDb()
  });

  afterAll(async() => {
      await app.close();
  });
  it.todo('should pass');
  it.todo('should passodoble');

  describe('Auth', () => {
    describe('Signup', () => {
      it.todo('should sign in')
    });

    describe('Signin', () => {});
  });

  describe('User', () => {
    describe('Get me', () => {});

    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmarks by id', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete bookmark', () => {});

  });
});