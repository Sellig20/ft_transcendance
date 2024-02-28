import { IsNotEmpty, IsNumber } from 'class-validator';

export class GameOverDTO {

  @IsNumber()
  winnerId: number;

  @IsNumber()
  loserId: number;
}

export class GameDTO {
  winnerId: number;
  loserId: number;
  winnerElo: number;
  loserElo: number;
}