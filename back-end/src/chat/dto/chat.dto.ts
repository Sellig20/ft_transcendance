import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// POST
export class CreateChannelDto {
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isPersonal: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @IsNumber()
  @IsNotEmpty()
  idUser: number;
}

// export class UserDetails {
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @IsString()
//   @IsNotEmpty()
//   username: string;
// }

// export class TFAcode {
// 	@IsString()
//   	@IsNotEmpty()
// 	TFACode: string;

// 	@IsNumber()
// 	@IsNotEmpty()
// 	idFront: number;
// }

// export class TFAcodeTO {
// 	@IsString()
//   	@IsNotEmpty()
// 	TFACode: string;
// }
