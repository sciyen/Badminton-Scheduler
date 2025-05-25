import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { PlayerStats, Match } from "../types";
import { showTeam } from "../utils";

interface MatchCardProps {
    stats: PlayerStats[];
    match: Match;
    index: number;
}

export default function MatchCard({ stats, match, index }: MatchCardProps) {

    return (
        <Card key={index} className="pl-5 pr-5" sx={{ bgcolor: "secondary.main", color: "white" }}>
            <CardContent>
                <Typography variant="h4" className="text-center">Match {index}</Typography>
                <div className="flex justify-between mt-4 center-container">
                    <span className={match.winner === "team1" ? "winner" : ""} >{showTeam(stats, match.team1)}</span>
                    <Typography className="text-center"> vs </Typography>
                    <span className={match.winner === "team2" ? "winner" : ""} > {showTeam(stats, match.team2)} </span>
                </div>

                {/* (Score: {m.diversityScore}) */}
                {/* <Button size="small" onClick={() => handleWinner(idx, "team1")}>Team 1 Wins</Button>
                <Button size="small" onClick={() => handleWinner(idx, "team2")}>Team 2 Wins</Button> */}
            </CardContent>
        </Card>
    );
}