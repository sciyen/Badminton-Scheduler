'use client'

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import ScoreBoard from "./ui/ScoreBoard";
import MatchCard from "./ui/MatchCard";
import NewMatch from "./ui/NewMatch";
import { PlayerStats, Match } from "./types";

import { nextGreedyMatch } from "./algorithm/GreedyMaxDiversity";

const theme = createTheme();

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

                <Button variant="contained" onClick={() => {
                    setGameStates(GameState.IN_PROGRESS)
                    setDefaultMatch(nextGreedyMatch(stats));
                }}>
                    Game Start
                </Button>
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
                        </div>

                        <NewMatch
                            stats={stats}
                            defaultMatch={defaultMatch}
                            onNewMatch={(match) => {
                                // Record match history
                                setMatches(prev => [...prev, match]);

                                // Update stats
                                updateStats(match);

                                // Schedule new match
                                const newMatch = nextGreedyMatch(stats);
                                setDefaultMatch(newMatch);
                            }} />
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
}



// const updateStats = (newMatches: Match[]) => {
//   const teammatesMap = { ...teammateSets };
//   const opponentsMap = { ...opponentSets };
//   const statsMap = { ...stats };

//   newMatches.forEach(match => {
//     const [a, b] = match.team1;
//     const [c, d] = match.team2;

//     // [a, b, c, d].forEach(p => {
//     //   if (!teammatesMap[p]) teammatesMap[p] = new Set();
//     //   if (!opponentsMap[p]) opponentsMap[p] = new Set();
//     //   if (!stats[p]) stats[p] = { name: p, games: 0, wins: 0, teammates: 0, opponents: 0, winRate: "0%" };
//     // });

//     teammatesMap[a].add(b);
//     teammatesMap[b].add(a);
//     teammatesMap[c].add(d);
//     teammatesMap[d].add(c);
//     opponentsMap[a].add(c);
//     opponentsMap[a].add(d);
//     opponentsMap[b].add(c);
//     opponentsMap[b].add(d);
//     opponentsMap[c].add(a);
//     opponentsMap[c].add(b);
//     opponentsMap[d].add(a);
//     opponentsMap[d].add(b);

//     // Update wins and games
//     [a, b, c, d].forEach(p => { statsMap[p].games++; });

//     if (match.winner === "team1") [a, b].forEach(p => statsMap[p].wins++);
//     if (match.winner === "team2") [c, d].forEach(p => statsMap[p].wins++);

//     // Recalculate win rates
//     [a, b, c, d].forEach(p => {
//       statsMap[p].teammates = teammatesMap[p].size;
//       statsMap[p].opponents = opponentsMap[p].size;
//       statsMap[p].winRate = statsMap[p].games ? ((statsMap[p].wins / statsMap[p].games) * 100).toFixed(1) + "%" : "0%";
//     });
//   });

//   setStats(statsMap);
//   setTeammateSets(teammatesMap);
//   setOpponentSets(opponentsMap);
// };

// useEffect(() => {
//   updateStats(matches);
// }, [players, matches]);

// const [lastDiversity, setLastDiversity] = useState<number>(0);

// const scheduleNextMatch = () => {
//   const combos: { team1: [string, string]; team2: [string, string] }[] = [];
//   for (let i = 0; i < players.length; i++)
//     for (let j = i + 1; j < players.length; j++)
//       for (let k = 0; k < players.length; k++)
//         for (let l = k + 1; l < players.length; l++) {
//           const s = new Set([i, j, k, l]); if (s.size === 4)
//             combos.push({ team1: [players[i], players[j]], team2: [players[k], players[l]] });
//         }
//   let best: MatchCombo[] = [];
//   let bestScore = -Infinity;
//   combos.forEach(c => {
//     let teammateDiversityScore = 0;
//     teammateDiversityScore += new Set([...teammateSets[c.team1[0]], c.team1[1]]).size;
//     teammateDiversityScore += new Set([...teammateSets[c.team1[1]], c.team1[0]]).size;
//     teammateDiversityScore += new Set([...teammateSets[c.team2[0]], c.team2[1]]).size;
//     teammateDiversityScore += new Set([...teammateSets[c.team2[1]], c.team2[0]]).size;

//     let opponentDiversityScore = 0;
//     opponentDiversityScore += new Set([...opponentSets[c.team1[0]], c.team2[0], c.team2[1]]).size;
//     opponentDiversityScore += new Set([...opponentSets[c.team1[1]], c.team2[0], c.team2[1]]).size;
//     opponentDiversityScore += new Set([...opponentSets[c.team2[0]], c.team1[0], c.team1[1]]).size;
//     opponentDiversityScore += new Set([...opponentSets[c.team2[1]], c.team1[0], c.team1[1]]).size;

//     let score = -teammateDiversityScore - opponentDiversityScore;
//     if (score > bestScore) {
//       bestScore = score;
//       best = [c];
//     }
//     if (score === bestScore) {
//       best.push(c);
//     }
//   });
//   if (best.length > 0) {
//     const selectedMatch = best[Math.floor(Math.random() * best.length)];
//     const newMatch: Match = {
//       team1: selectedMatch.team1,
//       team2: selectedMatch.team2,
//       winner: null,
//       diversityScore: bestScore,
//     };
//     setMatches(prev => [...prev, newMatch]);
//     setLastDiversity(bestScore);
//   }
// };

// const handleWinner = (idx: number, winner: "team1" | "team2") => {
//   setMatches(prev => prev.map((m, i) => i === idx ? { ...m, winner } : m));
// };
