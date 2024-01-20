import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
//pour l'instant j'ai juste besoin de ces champs mais à changer pour compléter