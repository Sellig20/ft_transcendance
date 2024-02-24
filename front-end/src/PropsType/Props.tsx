interface MessageProps {
	id: number
	content: string
	sender: string
	recipient : string
}

export interface PlayerStats {
	username: string;
	img_url: string;
	level: number;
	win: number;
	lose: number;
	elo: number;
	success_one: boolean;
	success_two: boolean;
	success_three: boolean;
}
  
export interface Matchs {
	id: number;
	startTime: string;
	endTime: string | null;
	winnerId: number;
	loserId: number;
	winnerName: string;
	loserName: string;
}