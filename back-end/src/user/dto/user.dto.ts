import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NameDto {

  @IsString()
  @IsNotEmpty()
  username: string;
}
