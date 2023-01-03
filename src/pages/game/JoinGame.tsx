import React from "react";
import {useState} from "react";
import FormField from "../../component/FormField";
import {Game, games} from "../../backend/Tables";
import {useNavigate} from "react-router-dom";
import useTheme from "../../hooks/UseTheme";

const JoinGame = () => {
    const navigate = useNavigate();

    const [code, setCode] = useState("");

    useTheme("dark");

    const find = () => {
        const x = async () => {
            const game = await games.query([`code = '${code.toLowerCase()}'`], 1, ["id", "quiz_id"]);
            navigate("/game", {state: {id: game.id, code, quizid: game.quiz_id}});
            // yzc_inag
        }
        x().then();
    }

    return <div className="flex w-screen h-screen justify-center items-center">
        <div className="shadow-lg rounded-lg bg-white p-5 w-full max-w-xs">
            <FormField maxLength={8} getter={code} setter={setCode} className="input styled w-full text-center rounded-md text-lg text-black" placeholder="Game PIN"/>
            <button className="btn styled w-full text-xl font-bold text-white mt-5" onClick={find}>JOIN</button>
        </div>
    </div>
}

export default JoinGame;
