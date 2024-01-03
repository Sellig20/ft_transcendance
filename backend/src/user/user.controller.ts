import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@ApiTags('User')
@ApiResponse({ status: 401, description: "Unauthorized" })
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    @Get('me')
    @ApiResponse({ status: 200, description: "User is successfully returned" })
    getMe(
        @GetUser() user: User,
        @GetUser('email') email: string, //print the email in term
    ) {
        console.log(
            email
        )
        return user;
    }

    @Patch()
    editUser() { }
}
