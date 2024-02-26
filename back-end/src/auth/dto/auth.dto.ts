import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class UserDetails {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class TFAcode {
	@IsString()
  	@IsNotEmpty()
	TFACode: string;

	@IsNumber()
	@IsNotEmpty()
	idFront: number;
}

export class TFAcodeTO {
	@IsString()
  	@IsNotEmpty()
	TFACode: string;
}
