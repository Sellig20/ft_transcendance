import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameDTO } from './dto';

@Injectable()
export class GameService {
	constructor(private prisma: PrismaService) { }
	calcElo(eloj1: number, eloj2: number, win: boolean){
		let newElo;
		let W;
		let D = eloj1 - eloj2
		let fctD = (1 / 1 + Math.pow(10, -D/400));
		if (win)
			W = 1
		else
			W = 0
		newElo = eloj1 + 20 * (W - fctD);
		return newElo;
	}

	async saveMatch(winnerId: number, loserId: number) {
		const useArr = [winnerId, loserId]
		try {
			const users = this.prisma.user.findMany({
				where: {
					id: {
						in: useArr
					},
				},
				select: {
					elo: true
				}
			})
			let data = new GameDTO();
			data.winnerId = winnerId;
			data.winnerElo = users[0];
			data.loserId = loserId;
			data.loserElo = users[1];
			await this.prisma.match.create({data})
		} catch (error) {
			throw new BadRequestException("Error in saving match", {
				cause: new Error(),
				description: "Error in saving match",
			});
		}
	}

	async updateUserInfo(userId: number, won: boolean, elo: number) {
		try {
			if (won) {
				await this.prisma.user.update({
					where: {
						id: userId
					},
					data: {
						win: { increment: 1 },
						elo: elo
					}
				})
			} else {
				await this.prisma.user.update({
					where: {
						id: userId
					},
					data: {
						lose: { increment: 1 },
						elo: elo
					}
				})
			}



		} catch (error) {
			throw new BadRequestException("Error retrieving match history", {
				cause: new Error(),
				description: "Error retrieving match history",
			});
		}
	}
}
