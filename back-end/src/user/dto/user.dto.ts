import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class NameDto {

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class IdDto {

  @IsNumber()
  @IsNotEmpty()
  id: number;
}