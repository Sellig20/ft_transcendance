import { IsNotEmpty, IsNumber } from 'class-validator';

export class GameOverDTO {

  @IsNumber()
  @IsNotEmpty()
  winnerId: number;

  @IsNumber()
  @IsNotEmpty()
  losserId: number;
}

export class GameDTO {
  winnerId: number;
  loserId: number;
  winnerElo: number;
  loserElo: number;
}