import { PlayerStats, Match } from "@/app/types";

const allPossibleCombinations = (n: number, m: number): number[][] => {
    const result = [];
    // initial combination
    const comb = Array.from({ length: m }, (_, i) => i);

    while (true) {
        result.push(comb.slice());   // record a copy of current

        // find the position to increment
        let i = m - 1;
        while (i >= 0 && comb[i] === i + n - m) {
            i--;
        }
        // if no such position, we are done
        if (i < 0) break;

        // increment this position
        comb[i]++;
        // reset the tail to the smallest possible values
        for (let j = i + 1; j < m; j++) {
            comb[j] = comb[j - 1] + 1;
        }
    }

    return result;
}


const allPossibleMatches = (n: number, m: number): Match[] => {
    const matches: Match[] = [];
    const combs = allPossibleCombinations(n, m);

    combs.forEach( comb => {
        matches.push({
            team1: [comb[0], comb[1]],
            team2: [comb[2], comb[3]],
        })
        matches.push({
            team1: [comb[0], comb[2]],
            team2: [comb[1], comb[3]],
        })
        matches.push({
            team1: [comb[0], comb[3]],
            team2: [comb[1], comb[2]],
        })
    })

    return matches;
};

let allMatches: Match[] = [];
let match_n = -1;

export function nextGreedyMatch(stats: PlayerStats[]): Match {
    const n = stats.length;

    if (n != match_n) {
        allMatches = allPossibleMatches(n, 4);
        match_n = n;
    }

    // Initialize the best match and score
    let bestMatch: Match[] = [];
    let bestScore = -1;

    // Iterate through all possible pairs of players for team 1
    allMatches.forEach( match => {
        const score = calculateDiversityScore(stats, match);
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = [match];
        } else if (score == bestScore) {
            bestMatch = [...bestMatch, match]
        }
    })

    if (bestMatch.length > 1) {
        return bestMatch[Math.floor(Math.random() * bestMatch.length)];
    } else {
        return bestMatch[0];
    }
}

function calculateDiversityScore(stats: PlayerStats[], match: Match): number {
    let gain = 0;
    const w_game = 0.1;
    match.team1.forEach( p => {
        gain += new Set(match.team1).difference(new Set([p])).difference(stats[p].teammates).size;
        gain += new Set(match.team2).difference(stats[p].opponents).size;
        gain -= w_game * stats[p].games; // penalize for number of games played
    })

    match.team2.forEach( p => {
        gain += new Set(match.team2).difference(new Set([p])).difference(stats[p].teammates).size;
        gain += new Set(match.team1).difference(stats[p].opponents).size;
        gain -= w_game * stats[p].games; // penalize for number of games played
    })

    return gain;
}