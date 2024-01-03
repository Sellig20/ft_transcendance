import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Controller, Get, HttpCode, HttpStatus, Body, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  @ApiResponse({ status: 201, description : "User is successfully created" })
  @ApiResponse({ status: 403, description : "Forbidden" })
  @ApiBody({
    type: AuthDto,
    description: "Creation of a user"
  })//est ce que j'ai un body a recup
  signup(
    @Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(
    @Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
