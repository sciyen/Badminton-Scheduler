import { PlayerStats } from "./types";

export function showName(stats: PlayerStats[], idx: number) {
    return stats[idx].name;
}

export function showTeam(stats: PlayerStats[], idxs: number[]) {
    return idxs.map(idx => showName(stats, idx)).join(" & ");
}