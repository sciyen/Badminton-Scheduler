import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { PlayerStats, Match } from "../types";
import { showTeam } from "../utils";

interface MatchCardProps {
    stats: PlayerStats[];
    match: Match;
    index: number;
}

export default function MatchCard({ stats, match, index }: MatchCardProps) {

    return (
        <Card key={index}>
            <CardContent>
                <h4>Match {index}</h4>
                <div>
                    <span className={match.winner === "team1" ? "winner" : ""} >{showTeam(stats, match.team1)}</span>
                    <span> vs </span>
                    <span className={match.winner === "team2" ? "winner" : ""} > {showTeam(stats, match.team2)} </span>
                </div>

                {/* (Score: {m.diversityScore}) */}
                {/* <Button size="small" onClick={() => handleWinner(idx, "team1")}>Team 1 Wins</Button>
                <Button size="small" onClick={() => handleWinner(idx, "team2")}>Team 2 Wins</Button> */}
            </CardContent>
        </Card>
    );
}