
export class GameStateFD {
    boardWidth: number = 500;
    boardHeight: number = 500;
  
    playerWidth: number = 10;
    playerHeight: number = 50;
    playerVelocityY: number = 0;
  
    ballWidth: number = 10;
    ballHeight: number = 10;
  
    player1Score: number = 0;
    player2Score: number = 0;
  
    paddle1: PaddleType = {
      x: 10,
      y: this.boardHeight / 2,
      width: this.playerWidth,
      height: this.playerHeight,
      velocityY: this.playerVelocityY,
    };
  
    paddle2: PaddleType = {
      x: this.boardWidth - this.playerWidth - 10,
      y: this.boardHeight / 2,
      width: this.playerWidth,
      height: this.playerHeight,
      velocityY: this.playerVelocityY,
    };
  
    ball: BallType = {
      x: this.boardHeight / 2,
      y: this.boardHeight / 2,
      width: this.ballWidth,
      height: this.ballHeight,
      velocityX: 1,
      velocityY: 2,
      color: "purple",
    };
  }
  
  export interface PaddleType {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityY: number;
  }

  export interface BallType {
    x: number,
    y: number,
    width: number,
    height: number,
    velocityX: number,
    velocityY: number,
    color: string,
  }
  
  