import React, { useMemo, useState, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { PlayerStats, Match } from "../types";

interface NewMatchProps {
    stats: PlayerStats[];
    defaultMatch: Match;
    className?: string;
    onNewMatch: (match: Match) => void;
}

export default function NewMatch({ stats, defaultMatch, className, onNewMatch }: NewMatchProps) {
    const [match, setMatch] = useState<Match>(defaultMatch);

    useEffect(() => {
        setMatch(defaultMatch);
    }, [defaultMatch]);

    const nameList = useMemo(() => {
        return stats.map((s) => s.name);
    }, [stats]);

    const handleWinner = useCallback((winner: "team1" | "team2") => {
        onNewMatch({
            ...match,
            winner,
        });
    }, [match, onNewMatch]);

    return (
        <Card className={className + " pl-5 pr-5"} sx={{ bgcolor: "secondary.main", color: "white" }}>
            <CardContent>
                <Typography variant="h4" className="text-center">Next Match</Typography>
                <Grid className="flex justify-between mt-4 gap-10 space-x-4 center-container">
                    {/* <span className={match.winner === "team1" ? "winner" : ""} >{showTeam(match.team1)}</span> */}
                    <div>
                        <PlayerSelect
                            player={match.team1[0]}
                            teammate={match.team1[1]}
                            nameList={nameList}
                            onChange={(player) => setMatch({ ...match, team1: [player, match.team1[1]] })}
                        />
                        <PlayerSelect
                            player={match.team1[1]}
                            teammate={match.team1[0]}
                            nameList={nameList}
                            onChange={(player) => setMatch({ ...match, team1: [match.team1[0], player] })}
                        />
                    </div>
                    <Typography className="text-center"> vs </Typography>
                    <div className="text-right">
                        <PlayerSelect
                            player={match.team2[0]}
                            teammate={match.team2[1]}
                            nameList={nameList}
                            onChange={(player) => setMatch({ ...match, team2: [player, match.team2[1]] })}
                        />
                        <PlayerSelect
                            player={match.team2[1]}
                            teammate={match.team2[0]}
                            nameList={nameList}
                            onChange={(player) => setMatch({ ...match, team2: [match.team2[0], player] })}
                        />
                    </div>
                </Grid>

                {/* (Score: {m.diversityScore}) */}
                <div className="flex justify-between mt-4">
                    <Button className="text-left"
                        variant="outlined" onClick={() => { handleWinner("team1") }}>Team 1 Wins</Button>
                    <Button className="text-right"
                        variant="outlined" onClick={() => { handleWinner("team2") }}>Team 2 Wins</Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface PlayerSelectProps {
    player: number;
    teammate: number;
    nameList: string[];
    onChange: (player: number) => void;
}

function PlayerSelect({ player, teammate, nameList, onChange }: PlayerSelectProps) {
    return (
        <FormControl>
            <Select
                sx={{ minWidth: 120 }}
                value={player}
                autoWidth
                onChange={(e) => onChange(e.target.value as number)}
            >
                {nameList.map((name, idx) => (
                    (idx != teammate) &&
                    <MenuItem key={idx} value={idx}>{name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}