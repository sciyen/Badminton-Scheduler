import React, { useMemo, useState, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { PlayerStats, Match } from "../types";

interface NewMatchProps {
    stats: PlayerStats[];
    defaultMatch: Match;
    onNewMatch: (match: Match) => void;
}

export default function NewMatch({ stats, defaultMatch, onNewMatch }: NewMatchProps) {
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
        <Card>
            <CardContent>
                <h4>Next Match</h4>
                <div>
                    {/* <span className={match.winner === "team1" ? "winner" : ""} >{showTeam(match.team1)}</span> */}
                    <PlayerSelect
                        player={match.team1[0]}
                        nameList={nameList}
                        onChange={(player) => setMatch({ ...match, team1: [player, match.team1[1]] })}
                    />
                    <PlayerSelect
                        player={match.team1[1]}
                        nameList={nameList}
                        onChange={(player) => setMatch({ ...match, team1: [match.team1[0], player] })}
                    />
                    <span> vs </span>
                    <PlayerSelect
                        player={match.team2[0]}
                        nameList={nameList}
                        onChange={(player) => setMatch({ ...match, team2: [player, match.team2[1]] })}
                    />
                    <PlayerSelect
                        player={match.team2[1]}
                        nameList={nameList}
                        onChange={(player) => setMatch({ ...match, team2: [match.team2[0], player] })}
                    />
                </div>

                {/* (Score: {m.diversityScore}) */}
                <Button onClick={() => { handleWinner("team1") }}>Team 1 Wins</Button>
                <Button onClick={() => { handleWinner("team2") }}>Team 2 Wins</Button>
            </CardContent>
        </Card>
    );
}

interface PlayerSelectProps {
    player: number;
    nameList: string[];
    onChange: (player: number) => void;
}

function PlayerSelect({ player, nameList, onChange }: PlayerSelectProps) {
    return (
        <FormControl>
            <Select
                value={player}
                autoWidth
                onChange={(e) => onChange(e.target.value as number)}
            >
                {nameList.map((name, idx) => (
                    <MenuItem key={idx} value={idx}>{name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}