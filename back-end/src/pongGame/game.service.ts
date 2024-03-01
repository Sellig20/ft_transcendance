import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameDTO } from './dto';

@Injectable()
export class GameService {
	constructor(private prisma: PrismaService) { }
	async calcElo(me: number, other: number, win: boolean) {
		const useArr = [me, other]
		try {
			const users = await this.prisma.user.findMany({
				where: {
					id: {
						in: useArr
					},
				},
				select: {
					elo: true,
					id: true
				}
			})

			let eloj1: number
			let eloj2: number
			if (users[0].id === me) {
				eloj1 = users[0].elo;
				eloj2 = users[1].elo;
			}
			else {
				eloj1 = users[1].elo;
				eloj2 = users[0].elo;
			}
			let newElo;
			let W;
			let D = eloj1 - eloj2
			let fctD = (1 / (1 + Math.pow(10, (-D) / 400)));

			if (win)
				W = 1
			else
				W = 0
			newElo = eloj1 + Math.floor(40 * (W - fctD)) + 1;
			return newElo;
		} catch (error) {
			throw new BadRequestException("Error in saving elo saving", {
				cause: new Error(),
				description: "Error in saving elo saving",
			});
		}
	}

	async saveMatch(winnerId: number, loserId: number) {
		
		const useArr = [winnerId, loserId]
		try {
			const users = await this.prisma.user.findMany({
				where: {
					id: {
						in: useArr
					},
				},
				select: {
					elo: true,
					id: true,
				}
			})
			let data = new GameDTO();
			data.winnerId = winnerId;
			data.loserId = loserId;
			if (users[0].id === winnerId) {
				data.winnerElo = users[0].elo;
				data.loserElo = users[1].elo;
			}
			else { 
				data.winnerElo = users[1].elo;
				data.loserElo = users[0].elo;
			}

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
