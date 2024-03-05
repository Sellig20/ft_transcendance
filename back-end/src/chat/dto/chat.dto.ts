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

export class LeaveChannelById {
  @IsNumber()
  @IsNotEmpty()
  channelid: number;

  @IsNumber()
  @IsNotEmpty()
  userid: number;
}

export class BanChannelById {
  @IsNumber()
  @IsNotEmpty()
  channelid: number;

  @IsNumber()
  @IsNotEmpty()
  userid: number;
}

export class BlockUserById {
  @IsNumber()
  @IsNotEmpty()
  userid: number;

  @IsNumber()
  @IsNotEmpty()
  userToBlock: number;
}

export class SetAdminById {
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  @IsNumber()
  @IsNotEmpty()
  userToSet: number;
}

export class MuteById {
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class InviteUser {
  @IsNumber()
  @IsNotEmpty()
  channelid: number;

  @IsString()
  @IsNotEmpty()
  userid: string;
}

export class InviteUserId {
  @IsNumber()
  @IsNotEmpty()
  channelid: number;

  @IsNumber()
  @IsNotEmpty()
  userid: number;
}

export class ChangePassword {
  @IsString()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  channelid: number;
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
