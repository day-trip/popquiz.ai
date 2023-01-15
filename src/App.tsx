import React, {createContext, Dispatch, SetStateAction} from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import FindScreen from "./pages/teacher/FindScreen";
import GameScreen from "./pages/game/GameScreen";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Confirm from "./pages/auth/Confirm";
import JoinGame from "./pages/game/JoinGame";
import QuizScreen from "./pages/teacher/QuizScreen";
import useTheme from "./hooks/UseTheme";
import {createTheme, PaletteMode, ThemeProvider} from "@mui/material";

const ThemeContext = createContext<[string, Dispatch<SetStateAction<string>>] | undefined>(['', () => {}]);

const App = () => {
    const theme = useTheme();

    const muiTheme = createTheme({
        palette: {
            mode: theme[0] as PaletteMode
        },
    });

    const router = createBrowserRouter([
        {
            path: "/auth/login",
            element: <Login/>
        },
        {
            path: "/auth/register",
            element: <Register/>
        },
        {
            path: "/auth/confirm",
            element: <Confirm/>
        },
        {
            path: "/teacher",
            element: <FindScreen/>
        },
        {
            path: "/teacher/create",
            element: <CreateQuiz/>
        },
        {
            path: "/teacher/quiz",
            element: <QuizScreen/>
        },
        {
            path: "/game",
            element: <GameScreen/>
        },
        {
            path: "/join",
            element: <JoinGame/>
        },
    ]);

    return <ThemeContext.Provider value={theme}>
        <ThemeProvider theme={muiTheme}>
            {/*<PageBackground theme={theme[0]}/>*/}
            <RouterProvider router={router}/>
        </ThemeProvider>
    </ThemeContext.Provider>
}

export default App;
export {ThemeContext};
