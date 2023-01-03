import React, {useEffect, useState} from "react";
import useTheme from "../../hooks/UseTheme";
import Navbar from "../../component/Navbar";
import {Link, Navigate, useLocation, useNavigate} from "react-router-dom";
import FormField from "../../component/FormField";
import useUser from "../../hooks/UseUser";
import io from "socket.io-client";
import {games, Quiz, quizzes} from "../../backend/Tables";


type Player = {
    id: string,
    name: string,
    points: number
}


function arraysEqual<T>(a: T[], b: T[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    a.sort();
    b.sort();

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

const GameScreen = () => {
    const {id, quizid, code} = useLocation().state || {id: null};

    const navigate = useNavigate();

    const user = useUser();
    const [teacher, setTeacher] = useState<boolean | null>(null);

    const [socket] = useState(io("ws://34.229.17.68:3000", {autoConnect: false}));

    const [name, setName] = useState("");

    const [players, setPlayers] = useState<Player[]>([]);

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [qIndex, setQIndex] = useState(-1);
    const [showQ, setShowQ] = useState(false);

    const [showL, setShowL] = useState(false);

    const [joined, setJoined] = useState(false);
    const [done, setDone] = useState(false);

    const [answers, setAnswers] = useState<number[]>([]);

    const [aStudents, setAStudents] = useState<string[]>([]);

    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const x = async () => {
            const q = await quizzes.get(quizid, ["questions", "title"]);
            setQuiz(q);
        }
        x().then();
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (user !== null) {
            setTeacher(!!user);
        }
    }, [user]);

    useEffect(() => {
        if (teacher !== null) {
            socket.on('connect', () => {
                socket.emit("join", JSON.stringify({gameid: id, teacher: teacher}));
            });
            socket.on('disconnect', () => {
                navigate("/join");
            });
            socket.on('players', (d) => {
                const data = JSON.parse(d);
                setPlayers(Object.keys(data).map(k => ({id: k, name: data[k].name, points: data[k].points})));
            });
            socket.on('join', (d) => {
                const data = JSON.parse(d);
                setPlayers(players => ([...players, {id: data.userid, name: data.name, points: 0}]));
            });
            socket.on('leave', (d) => {
                const data = JSON.parse(d);
                setPlayers(players => players.filter(player => player.id !== data.userid));
            });
            socket.on('next', (d) => {
                const data = JSON.parse(d);
                setShowQ(false);
                setAStudents([]);
                setSubmitted(false);
                if (data.leaderboard) {
                    setShowL(true);
                } else {
                    setAnswers([]);
                    setShowL(false);
                    setQIndex(qIndex => qIndex + 1);
                }
            });
            socket.on('answered', (d) => {
                const data = JSON.parse(d);
                setAStudents([...aStudents, data.userid]);
            });
        }
    }, [teacher]);

    useEffect(() => {
        if (qIndex >= 0) {
            if (qIndex === quiz?.questions?.length!) {
                setDone(true);
            } else {
                setTimeout(() => {
                    setShowQ(true);
                }, 3000);
            }
        }
    }, [qIndex]);

    const join = () => {
        if (socket.connected) {
            socket.emit("info", JSON.stringify({name: name}));
            setJoined(true);
        }
    }

    const next = () => {
        if (socket.connected) {
            socket.emit("next", JSON.stringify({leaderboard: true}));
        }
    }

    const start = () => {
        if (socket.connected) {
            socket.emit("next", JSON.stringify({leaderboard: false}));
        }
    }

    const answer = (index: number, sb: boolean = false) => {
        if (answers.includes(index)) {
            const a = [...answers];
            a.splice(a.indexOf(index), 1);
            setAnswers(a);
        } else {
            setAnswers([...answers, index]);
        }
        if (sb) {
            submit();
        }
    }

    const submit = () => {
        setSubmitted(true);
        const points = arraysEqual([...answers], [...quiz?.questions![qIndex].answers!]) ? 5 : 0;
        socket.emit("points", JSON.stringify({points}));
    }

    const end = () => {
        socket.emit("end", JSON.stringify({}));
        games.delete(id).then();
    }

    const theme = useTheme();

    if (!id) {
        return <Navigate to="/join"/>
    }

    if (done) {
        return <div className="w-screen h-screen flex justify-center items-center">
            <div className="bg-slate-200 dark:bg-slate-800 rounded-md shadow-md p-5">
                <h3 className="text-4xl font-semibold text-center text-white mb-10">{quiz?.title || ""}</h3>
                <p className="text-xl mb-10">you are awesome for even wasting your life to try my game oWo</p>
                <div className="flex justify-center">
                    {teacher ? <button onClick={end} className="btn styled">End</button> : <Link to="/join" className="btn styled">Play again</Link>}
                </div>
            </div>
        </div>
    }

    if (showL) {
        return <div className="w-screen h-screen flex flex-col">
            <div className="shadow-lg dark:shadow-md backdrop-brightness-95 dark:backdrop-brightness-75 backdrop-blur-md py-5 text-center">
                <p className="text-3xl font-semibold text-black dark:text-white">{quiz?.questions![qIndex]!.question}</p>
            </div>
            <div className="mx-auto w-full max-w-4xl flex-1 flex flex-col justify-center items-center py-16 gap-24 overflow-y-auto">
                {teacher && <div className="w-full flex justify-end">
                    <button className="btn styled bg-sky-500 hover:bg-sky-400 border-none" onClick={start}>Next</button>
                </div>}
                <div className="w-full max-w-2xl rounded-lg shadow-md bg-slate-300 dark:bg-slate-800 py-3 px-6">
                    {players.map(player => <div className="w-full flex justify-between items-center text-3xl font-bold text-white" key={player.id}>
                        <p>{player.name}</p>
                        <p>{player.points}</p>
                    </div>)}
                </div>
            </div>
            <div className="backdrop-brightness-95 dark:backdrop-brightness-75 backdrop-blur-md flex justify-between p-5">
                <p className="font-bold dark:text-white text-2xl">{qIndex + 1}/{quiz?.questions?.length!}</p>
                <p className="font-bold dark:text-white text-2xl">{code}</p>
            </div>
        </div>
    }

    if (qIndex >= 0) {
        if (qIndex === quiz?.questions?.length!) {
            return <></>
        }
        if (showQ) {
            return <div className="w-screen h-screen flex flex-col">
                <div className="shadow-lg dark:shadow-md backdrop-brightness-95 dark:backdrop-brightness-75 backdrop-blur-md py-5 text-center">
                    <p className="text-3xl font-semibold text-black dark:text-white">{quiz?.questions![qIndex]!.question}</p>
                </div>
                <div className="mx-auto w-full max-w-4xl flex-1 flex flex-col justify-center items-center py-16 gap-24 overflow-y-auto">
                    {teacher && <div className="flex justify-between items-center w-full">
                        <p className="text-2xl font-bold dark:text-white">{aStudents.length}/{players.length}</p>
                        <button className="btn styled bg-sky-500 hover:bg-sky-400 border-none" onClick={next}>Next</button>
                    </div>}
                    <div className="w-full">
                        {submitted ? <>
                            <div className="flex justify-center items-center">
                                <p>Waiting...</p>
                            </div>
                        </> : <div className="w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                                {quiz?.questions![qIndex].choices.map((choice: string, index: number) => <p key={choice} className={`p-4 text-xl bg-slate-300 dark:bg-slate-800 dark:text-white rounded-md shadow-md flex justify-between items-center font-bold ${quiz?.questions![qIndex].answers.length === 1 && !teacher && "styled"}`} onClick={() => {if (quiz?.questions![qIndex]!.answers.length === 1) answer(index, true)}}>
                                    {choice}
                                    {quiz?.questions![qIndex].answers.length !== 1 && (teacher || <input className="checkbox styled" type="checkbox" checked={answers.includes(index)} onChange={() => {answer(index)}}/>)}
                                </p>)}
                            </div>

                            {quiz?.questions![qIndex].answers.length !== 1 && (teacher || <div className="w-full flex justify-center mt-12">
                                <button className="btn styled bg-green-500 hover:bg-green-400 border-none" onClick={submit}>Submit</button>
                            </div>)}
                        </div>}
                    </div>
                    {teacher && <div className="w-full max-w-xl rounded-lg shadow-md bg-slate-300 dark:bg-slate-800 py-3 px-6">
                        <table className="table-auto w-full text-2xl font-semibold dark:text-white">
                            <thead className="w-full mb-16">
                            <tr className="flex justify-between w-full">
                                <th className="w-fit">Player</th>
                                <th className="w-fit">Completed</th>
                            </tr>
                            </thead>
                            <tbody>
                            {players.map(player => <tr key={player.id} className="py-6">
                                <td>{player.name}</td>
                                <td className="font-bold flex justify-end">{aStudents.includes(player.id) ? "Yes" : "No"}</td>
                            </tr>)}
                            </tbody>
                        </table>
                    </div>}
                </div>
                <div className="backdrop-brightness-95 dark:backdrop-brightness-75 backdrop-blur-md flex justify-between p-5">
                    <p className="font-bold dark:text-white text-2xl">{qIndex + 1}/{quiz?.questions?.length!}</p>
                    <p className="font-bold dark:text-white text-2xl">{code}</p>
                </div>
            </div>
        }

        return <div className="w-screen h-screen flex items-center">
            <div className="w-full shadow-lg dark:shadow-md backdrop-brightness-95 dark:backdrop-brightness-75 backdrop-blur-md p-5 text-center">
                <p className="text-3xl font-semibold text-black dark:text-white">{quiz?.questions![qIndex].question}</p>
            </div>
        </div>
    }

    return <>
        {teacher && <Navbar theme={theme}>
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
        </Navbar>}
        <div className="w-full max-w-full sm:mx-auto sm:max-w-3xl">
            <h3 className={`text-5xl font-semibold text-center dark:text-white mb-14 ${teacher || "mt-20"}`}>{quiz?.title || ""}</h3>
            {teacher ? <>
                <div className="flex justify-center gap-4 mb-12">
                    {code.toUpperCase().split('').map((letter: string, index: number) => <p className="text-6xl font-bold p-3 bg-slate-300 dark:bg-slate-800 dark:text-white rounded-md shadow-sm" key={index}>{letter}</p>)}
                </div>
                <div className="flex justify-center mb-14">
                    <button className="btn btn-lg styled text-xl border-none bg-sky-500 hover:bg-sky-400" onClick={start}>Start</button>
                </div>
                <h3 className="text-4xl font-semibold dark:text-white text-center">{players.length} player{players.length !== 1 && "s"}</h3>
            </> : <>
                {joined || <div className="input-group px-12">
                    <FormField getter={name} setter={setName} placeholder="Enter your nickname" className="input input-bordered font-semibold text-lg w-full"/>
                    <button className="btn text-lg font-bold" onClick={join}>Join</button>
                </div>}
            </>}
            <div className="mt-14 flex gap-8 flex-wrap">
                {players.map(player => <p className="text-xl font-semibold dark:text-white p-3 bg-slate-300 dark:bg-slate-800 rounded-md shadow-md" key={player.id}>{player.name}</p>)}
            </div>
        </div>
    </>
}

export default GameScreen;
