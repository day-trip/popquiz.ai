import {AppBar, Button, Toolbar} from "@mui/material";
import React, {Dispatch, SetStateAction, useContext} from "react";
import {ThemeContext} from "../App";
import {MoonIcon, SunIcon} from "@heroicons/react/24/outline";
import {Link, useLocation} from "react-router-dom";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";

const TeacherNavbar = ({}) => {
    const theme: [string, Dispatch<SetStateAction<string>>] = useContext(ThemeContext) as [string, Dispatch<SetStateAction<string>>];

    const path = useLocation().pathname;
    const parts = path.split('/');
    const back = parts.slice(0, -1).join('/') || '/';

    return <AppBar position="sticky" color="transparent" elevation={0} className="dark:backdrop-brightness-75 backdrop-blur-sm border-b border-slate-200 dark:border-slate-500">
        <Toolbar>
            {parts.length > 1 && <div className="flex-none">
                <Link className="btn btn-circle btn-ghost" to={back}>
                    <ArrowLeftIcon className="w-6 h-6"/>
                </Link>
            </div>}
            <p style={{ flexGrow: 1 }} className="font-bold text-xl">Kahot</p>
            <label className="swap swap-rotate btn btn-circle btn-ghost">
                <input type="checkbox" className="hidden" checked={theme[0] === "light"} onChange={() => {theme[1](theme[0] === "light" ? "dark": "light")}}/>
                <SunIcon className="swap-on fill-current w-7 h-7"/>
                <MoonIcon className="swap-off fill-current w-7 h-7"/>
            </label>
            <Button color="inherit">Logout</Button>
        </Toolbar>
    </AppBar>
}

export default TeacherNavbar;
