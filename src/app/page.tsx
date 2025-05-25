'use client'

import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import BadmintonScheduler from "./BadmintonScheduler";
import { CookiesProvider } from 'react-cookie';

const theme = createTheme({
    palette: {
        primary: {
            main: '#23315c',
        },
        secondary: {
            main: '#171717',
        },
    },
});

export default function page() {
    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <ThemeProvider theme={theme}>
                <BadmintonScheduler />
            </ThemeProvider>
        </CookiesProvider>
    );
}
