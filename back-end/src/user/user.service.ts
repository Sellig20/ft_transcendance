import { Injectable } from '@nestjs/common';
import { VirtualTimeScheduler } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;
export type Channel = any;

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) { }

	async findUserId(userID: number) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userID,
			},
		});
		if (user) return user;
		return null;
	}
	async findUserByMail(mail: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email: mail,
			},
		});
		return user;
	}

	async setTfaSecret(userID: number, secret: string) {
		await this.prisma.user.update({
			where: {
				id: userID,
			},
			data: {
				TFA_secret_hash: secret,
			},
		});
	}
	async setTfaOn(userID: number) {
		await this.prisma.user.update({
			where: {
				id: userID,
			},
			data: {
				TFA_activated: true,
			},
		});
	}

	async setTfaOff(userID: number) {
		await this.prisma.user.update({
			where: {
				id: userID,
			},
			data: {
				TFA_activated: false,
			},
		});
	}

	async changeName(id: number, name: string) {
		let result;
		try {
			result = await this.prisma.user.update({
				where: {
					id: id,
				},
				data: {
					username: name,
				},
			});
		} catch (error) {
			if (error.code === 'P2002') {
				console.log("There is a unique constraint violation");
			}
			throw new ForbiddenException("Error in update", {
				cause: new Error(),
				description: "username must be unique",
			});
		}
		return result;
	}

	async saveImg(id: number, imgUrl: string){
		let result;
		try {
			result = await this.prisma.user.update({
				where: {
					id: id,
				},
				data: {
					img_url: imgUrl,
				},
			});
		} catch (error) {
			throw new BadRequestException("error while saving img", {
				cause: new Error(),
				description: "error while saving img",
			});
		}
	}

	async myAvatar(id: number){
				let result;
		try {
			result = await this.prisma.user.findFirst({
				where: {
					id: id,
				}
			});
		} catch (error) {
			throw new BadRequestException("no img", {
				cause: new Error(),
				description: "no img",
			});
		}
		return result.img_url;
	}

	async changeStatus(id: number, status: string) {
		let result;
		try {
			result = await this.prisma.user.update({
				where: {
					id: id,
				},
				data: {
					user_status: status
				}
			});
		} catch (error) {
			throw new BadRequestException("status change failure", {
				cause: new Error(),
				description: "status change failure",
			});
		}
		return result;
	}

	async checkStatus(id: number) {
		let result;
		try {
			result = await this.prisma.user.findFirst({
				where: {
					id: id,
				}
			});
		} catch (error) {
			throw new BadRequestException("status check failure", {
				cause: new Error(),
				description: "status check failure",
			});
		}
		return result.user_status;
	}

	async allOnline() {
		let result;
		try {
			result = await this.prisma.user.findMany({
				where: {
					user_status: "online",
				}
			});
		} catch (error) {
			throw new BadRequestException("status check failure", {
				cause: new Error(),
				description: "status check failure",
			});
		}
		return result;
	}
	async dbStats(id: number){
		let result;
		try {
			result = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
				select: {
					username: true,
					img_url: true,
					friends: true,
					elo: true,
					win: true,
					lose: true,
					success_one: true,
  					success_two: true,
  					success_three: true,
				}
			});
		} catch (error) {
			throw new BadRequestException("stats failure", {
				cause: new Error(),
				description: "stats failure",
			});
		}
		return result;
	}

	calcLevel(wins: number, loses: number){
		const winXP = 10;
		const lossXP = 5;

		
		// Calculate total XP
		const totalXP = wins * winXP + loses * lossXP;
		
		// Calculate level based on total XP
		const level = Math.floor(Math.sqrt(totalXP / 15)) + 1;
		console.log('level: ', level);
		

		return level;
	}

	async updateAchivement(achNum: number, id: number) {
		let result;
		try {
			if (achNum === 1) {
				result = await this.prisma.user.update({
					where: {
						id: id,
					},
					data: {
						success_one: true
					}

				});
			}
			else if (achNum === 2)
				result = await this.prisma.user.update({
					where: {
						id: id,
					},
					data: {
						success_two: true
					}

				});
			else if (achNum === 3)
				result = await this.prisma.user.update({
					where: {
						id: id,
					},
					data: {
						success_three: true
					}

				});

		} catch (error) {
			throw new BadRequestException("oopsy", {
				cause: new Error(),
				description: "oopsy",
			});
		}
		return result;
	}

	async getAllFriends(id: number) {
		let friends;
		let result;

		try {
			friends = await this.prisma.user.findFirst({
				where: {
					id: id,
				},
				select: {
					friends: true
				}
			});
			
			result = await this.prisma.user.findMany({
				where: {
					id: {
						in: friends.friends
					},
				},
				select: {
					user_status: true,
					username: true,
					id: true,
					elo: true,
					img_url: true
				}
			});
		} catch (error) {
			throw new BadRequestException("failed to get friends", {
				cause: new Error(),
				description: "failed to get friends",
			});
		}
		return result;
	}

	async getAllUsers() {
		let users;

		try {
			users = await this.prisma.user.findMany()
		} catch (error) {
			throw new BadRequestException("Couldnt find users", {
				cause: new Error(),
				description: "Couldnt find users",
			});
		}

		return users;
	}

	async getAllUsersFilter(userId: number, ) {
		let users;
		let friends;		

		try {
			friends = await this.prisma.user.findFirst({
				where: {
					id: userId,
				},
				select: {
					friends: true
				}
			});

			users = await this.prisma.user.findMany({
				where: {
					id: {
						not: userId, // Exclude the current user
					},
					NOT: {
						id: {
							in: friends.friends
						},
					}
				}
			})
		} catch (error) {
			throw new BadRequestException("Couldnt find users", {
				cause: new Error(),
				description: "Couldnt find users",
			});
		}

		return users;
	}

	async addFriend(IdMe: number, IdFriend: number) {

		try {
			// console.log(IdMe, IdFriend);

			await this.prisma.user.update({
				where: {
					id: IdMe,
				},
				data: {
					friends: {
						push: IdFriend,
					},
				},
			})

			await this.prisma.user.update({
				where: {
					id: IdFriend,
				},
				data: {
					friends: {
						push: IdMe,
					},
				},
			})

		} catch (error) {
			console.log(error)
			throw new BadRequestException("Couldnt add friend", {
				cause: new Error(),
				description: "Couldnt add friend",
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
