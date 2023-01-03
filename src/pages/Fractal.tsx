import React from 'react';
import '../css/chumisfun.css';
import useTheme from "../hooks/UseTheme";
import PageBackground from "../component/PageBackground";

function Fractal() {
    const theme = useTheme("dark");
    return <>
        <PageBackground theme={theme[0]}/>
        <div className="h-96">

        </div>
        <div className="h-96">

        </div>
        <div className="h-96">

        </div>
        <div className="h-96">

        </div>
    </>
}

export default Fractal;
