import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from 'src/auth/utils/custo.deco';

@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAnyUser() {
    return await this.prisma.user.findMany();
  }
  @Public()
  @Get('/test')
  hello() {
    return {msg: 'yep yep'};
  }
}
