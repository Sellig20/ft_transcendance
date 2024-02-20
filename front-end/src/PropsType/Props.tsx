interface MessageProps {
	id: number
	content: string
	sender: string
	recipient : string
}

export interface PlayerStats {
	level: number;
	win: number;
	lose: number;
	elo: number;
	success_one: boolean;
	success_two: boolean;
	success_three: boolean;
}
  