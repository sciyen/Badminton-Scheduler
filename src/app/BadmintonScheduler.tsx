'use client'

import React, { useState, useCallback } from "react";
import Button from "@mui/material/Button";

import ScoreBoard from "./ui/ScoreBoard";
import MatchCard from "./ui/MatchCard";
import NewMatch from "./ui/NewMatch";
import Typography from "@mui/material/Typography";
import GitHubIcon from '@mui/icons-material/GitHub';
import { PlayerStats, Match } from "./types";
import { useCookies } from 'react-cookie';

import { nextGreedyMatch } from "./algorithm/GreedyMaxDiversity";

// enum for game states
enum GameState {
    CONFIGURE,
    IN_PROGRESS,
    COMPLETED,
}

const calc_initial_stat = (players: string[]): PlayerStats[] => {
    console.log("Calculating initial stats for players:", players);
    if (!players || players.length === 0) {
        console.warn("No players provided, using default players.");
        players = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"];
    }
    return players.map(player => ({
        name: player,
        games: 0,
        wins: 0,
        teammates: new Set(),
        opponents: new Set(),
    }));
}

// type PlayerNames = string[];
interface ICookieValues {
    names: string[];
};

const defaultPlayers = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"];

export default function BadmintonScheduler() {
    const [cookies, setCookie] = useCookies<'names', ICookieValues>(['names']);
    const [stats, setStats] = useState<PlayerStats[]>(() => {
        if (!cookies || !cookies.names || cookies.names.length === 0) {
            console.log("No player names found in cookies, setting default names.");
            setCookie('names', defaultPlayers, { path: '/' });
            return calc_initial_stat(defaultPlayers);
        }
        console.log("Initializing player stats from cookies:", cookies.names);
        return calc_initial_stat(cookies.names);
    });

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
        <div>
            <Typography variant="h2" className="text-center pt-5">Badminton Scheduler</Typography>
            <Typography variant="subtitle1" className="text-center pd-5">
                <a href="https://github.com/sciyen/Badminton-Scheduler">
                    <GitHubIcon className="inline-block ml-2 mr-2" fontSize="small" sx={{ marginTop: -0.3 }} />
                </a>
                sciyen.ycc
            </Typography>
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
                        setCookie('names', stats.map(s => s.name));
                    }}>
                    Game Start
                </Button>

                <hr style={{ margin: '1rem 0' }} />

                {(gameStates != GameState.CONFIGURE) && (
                    <div className="flex gap-2 justify-center">
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
        </div>
    );
}
