import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { GameDTO } from './dto';

// This should be a real class/interface representing a user entity
export type User = any;
export type Channel = any;

@Injectable()
export class GameService {
	constructor(private prisma: PrismaService) { }


	calcElo(eloj1: number, eloj2: number){
		let newElo;
		let W;
		let D = eloj1 - eloj2
		let fctD = (1 / 1 + Math.pow(10, -D/400));
		//if (win)
			W = 1
		// else
			// W = 0
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

	async getMatchs(userId: number) {
		try {
			const matchHistory = await this.prisma.match.findMany({
				where: {
					OR: [
						{ winnerId: userId },
						{ loserId: userId },
					],
				},
			});
			// Fetch user names for winnerId and loserId
			const matchsWithUsernames = await Promise.all(matchHistory.map(async (match) => {
				const [winner, loser] = await Promise.all([
					this.prisma.user.findUnique({ where: { id: match.winnerId } }),
					this.prisma.user.findUnique({ where: { id: match.loserId } }),
				]);

				return {
					...match,
					winnerName: winner ? winner.username : null,
					loserName: loser ? loser.username : null,
				};
			}));

		return matchsWithUsernames;
		} catch (error) {
			throw new BadRequestException("Error retrieving match history", {
				cause: new Error(),
				description: "Error retrieving match history",
			});
		}
	}
}
