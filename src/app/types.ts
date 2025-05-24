export interface PlayerStats {
    name: string;
    games: number;
    wins: number;
    teammates: Set<number>;
    opponents: Set<number>;
}
  
export interface Match {
    team1: [number, number];
    team2: [number, number];
    winner?: "team1" | "team2";
    diversityScore?: number;
}