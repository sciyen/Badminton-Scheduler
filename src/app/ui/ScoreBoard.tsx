import React, { useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    GridApi,
    ColDef,
    GridOptions,
    GridReadyEvent,
    CellValueChangedEvent,
    ModuleRegistry,
    AllCommunityModule,
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    ValidationModule,
    TextEditorModule,
    RowSelectionModule,
    RowApiModule,

    colorSchemeDarkBlue,
} from "ag-grid-community";
import { themeQuartz } from 'ag-grid-community';
import { PlayerStats } from "@/app/types";


import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    ValidationModule,
    TextEditorModule,
    RowSelectionModule,
    RowApiModule,
    AllCommunityModule
]);
const AgTheme = themeQuartz
    .withPart(colorSchemeDarkBlue)
    .withParams({
        accentColor: 'white',
        cellFontFamily: 'monospace',
    });

const columnDefs: ColDef[] = [
    { field: "name", headerName: "Player", sortable: true, filter: true, editable: true },
    { field: "games", headerName: "Games", sortable: true, filter: true },
    { field: "wins", headerName: "Wins", sortable: true, filter: true },
    { field: "num_teammates", headerName: "#Teammates", sortable: true, filter: true },
    { field: "num_opponents", headerName: "#Opponents", sortable: true, filter: true },
    { field: "winRate", headerName: "Win Rate", sortable: true, filter: true },
];

interface IScore {
    name: string;
    games: number;
    wins: number;
    num_teammates: number;
    num_opponents: number;
    winRate: string;
}

interface scoreBoardProps {
    editable: boolean;
    stats: PlayerStats[];
    onPlayerChange: (stats: PlayerStats[]) => void;
}

const ScoreBoard: React.FC<scoreBoardProps> = ({ editable, stats, onPlayerChange }) => {
    const [api, setApi] = useState<GridApi>();
    const rowData: IScore[] = useMemo(() => {
        return stats.map((player) => ({
            name: player.name,
            games: player.games,
            wins: player.wins,
            // Calculate derived values
            num_teammates: player.teammates.size,
            num_opponents: player.opponents.size,
            winRate: player.wins > 0 ? ((player.wins / player.games) * 100).toFixed(2) + "%" : "0%",
        }));
    }, [stats]);

    // Grid ready: keep api reference
    const onGridReady = (params: GridReadyEvent) => {
        setApi(params.api);
    };

    // Allow users to update the name of the selected player
    const onCellValueChanged = useCallback((params: CellValueChangedEvent) => {
        const selectedPlayer = params.rowIndex;
        const newName = params.newValue;
        const updatedStats = stats.map((player, idx) => {
            if (idx === selectedPlayer) {
                return { ...player, name: newName };
            }
            return player;
        });

        onPlayerChange(updatedStats);
    }, [stats, onPlayerChange]);

    const addPlayer = useCallback(() => {
        const name = prompt("Enter new player name:");
        if (name && !stats.some(player => player.name === name)) {
            const newPlayer: PlayerStats = {
                name,
                games: 0,
                wins: 0,
                teammates: new Set(),
                opponents: new Set(),
            };
            onPlayerChange([...stats, newPlayer]);
        }
    }, [stats, onPlayerChange]);

    const removePlayer = useCallback(() => {
        if (!api) return;
        const selected = api.getSelectedRows();
        const nameToRemove = selected.map((player: IScore) => player.name);

        onPlayerChange(stats.filter(player => !nameToRemove.includes(player.name)));
    }, [api, stats, onPlayerChange]);

    const gridOptions: GridOptions<IScore> = {
        defaultColDef: {
            flex: 1,
            minWidth: 100,
            editable: false,
            resizable: true,
        },
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        animateRows: true,
        theme: AgTheme,
        columnDefs: columnDefs,
        domLayout: "autoHeight",
        onGridReady: onGridReady
    };

    return (
        <div className="score-board">
            <AgGridReact
                gridOptions={gridOptions}
                onCellValueChanged={onCellValueChanged}
                rowData={rowData}
            />
            <div>

                <ButtonGroup disabled={!editable} variant="contained" aria-label="outlined primary button group">
                    <Button variant="contained" onClick={addPlayer}>Add A Player</Button>
                    <Button variant="contained" onClick={removePlayer}>Delete Selected Player</Button>
                </ButtonGroup>
            </div>
        </div>
    )
};

export default ScoreBoard;
