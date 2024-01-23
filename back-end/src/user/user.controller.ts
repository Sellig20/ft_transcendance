import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAnyUser() {
    return await this.prisma.user.findMany();
  }
}
