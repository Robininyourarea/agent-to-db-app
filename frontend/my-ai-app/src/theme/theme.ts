import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#18181a",
        },
        secondary: {
            main: "#18181a",
        },
        background: {
            default: "#18181a",
            paper: "#232326",
        },
        text: {
            primary: "#fff",
        },
    },
    typography: {
        fontFamily: "var(--font-poppins), sans-serif", // default
    },
});
