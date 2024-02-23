import { Decimal } from "@prisma/client/runtime/library"

export class FrontUserDto {
	id: number
	username: string
	email: string
	tfa_status: boolean
}

export class StatsDto {
	win: number
	lose: number
	elo: number
	success_one: boolean
	success_two: boolean
	success_three: boolean
	level: number
}