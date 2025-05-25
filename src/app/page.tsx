'use client'

import React, { useState, useCallback } from "react";
import Button from "@mui/material/Button";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import ScoreBoard from "./ui/ScoreBoard";
import MatchCard from "./ui/MatchCard";
import NewMatch from "./ui/NewMatch";
import { PlayerStats, Match } from "./types";

import { nextGreedyMatch } from "./algorithm/GreedyMaxDiversity";

const theme = createTheme({
    palette: {
        primary: {
            main: '#23315c',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

// enum for game states
enum GameState {
    CONFIGURE,
    IN_PROGRESS,
    COMPLETED,
}

const calc_initial_stat = (players: string[]): PlayerStats[] => {
    return players.map(player => ({
        name: player,
        games: 0,
        wins: 0,
        teammates: new Set(),
        opponents: new Set(),
    }));
}

const defaultPlayers = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"];

export default function BadmintonScheduler() {
    const [stats, setStats] = useState<PlayerStats[]>(calc_initial_stat(defaultPlayers));
    const [gameStates, setGameStates] = useState<GameState>(GameState.CONFIGURE);
    const [matches, setMatches] = useState<Match[]>([]);
    const [defaultMatch, setDefaultMatch] = useState<Match>({
        team1: [0, 1],
        team2: [2, 3],
    });

    const updateStats = useCallback((match: Match) => {
        const newStats = [...stats];
        match.team1.forEach(p => {
            newStats[p].games++;
            if (match.winner == "team1")
                newStats[p].wins++;
            match.team1.forEach(t => (t != p) && newStats[p].teammates.add(t));
            match.team2.forEach(o => newStats[p].opponents.add(o));
        })

        match.team2.forEach(p => {
            newStats[p].games++;
            if (match.winner == "team2")
                newStats[p].wins++;
            match.team2.forEach(t => (t != p) && newStats[p].teammates.add(t));
            match.team1.forEach(o => newStats[p].opponents.add(o));
        })

        setStats(newStats);
        console.log("Stats updated:", stats);
        return newStats;
    }, [stats])

    return (
        <ThemeProvider theme={theme}>
            <h1>
                Badminton Scheduler
            </h1>
            <div className="p-4 space-y-4">
                {/* <div>Diversity Score: {lastDiversity}</div> */}
                <ScoreBoard
                    editable={gameStates === GameState.CONFIGURE}
                    stats={stats}
                    onPlayerChange={setStats} />

                <Button fullWidth variant="contained"
                    disabled={gameStates !== GameState.CONFIGURE}
                    onClick={() => {
                        setGameStates(GameState.IN_PROGRESS)
                        setDefaultMatch(nextGreedyMatch(stats));
                    }}>
                    Game Start
                </Button>

                <hr style={{ margin: '1rem 0' }} />

                {(gameStates != GameState.CONFIGURE) && (
                    <div className="flex gap-2">
                        <div className="space-y-2">
                            {matches.map((m, idx) => (
                                <MatchCard
                                    key={idx}
                                    stats={stats}
                                    match={m}
                                    index={idx}
                                />
                            ))}

                            <NewMatch
                                stats={stats}
                                defaultMatch={defaultMatch}
                                onNewMatch={(match) => {
                                    // Record match history
                                    setMatches(prev => [...prev, match]);

                                    // Update stats
                                    const newStats = updateStats(match);

                                    // Schedule new match
                                    const newMatch = nextGreedyMatch(newStats);
                                    setDefaultMatch(newMatch);
                                }} />
                        </div>
                    </div>
                )}

                <Button fullWidth variant="contained"
                    onClick={() => {
                        setGameStates(GameState.CONFIGURE)
                        setStats(calc_initial_stat(stats.map(s => s.name)));
                        setMatches([]);
                        setDefaultMatch(nextGreedyMatch(stats));
                    }}>
                    Game Restart
                </Button>
            </div>
        </ThemeProvider>
    );
}
