import useUser from "../../hooks/UseUser";
import {useEffect, useState} from "react";
import {games, Quiz, quizzes} from "../../backend/Tables";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import React from "react";
import Navbar from "../../component/Navbar";
import useTheme from "../../hooks/UseTheme";
import {nanoid} from "nanoid";
import {CognitoUser} from "amazon-cognito-identity-js";
import {Switch} from "@mui/material";
import {CheckIcon} from "@heroicons/react/24/solid";
import TeacherNavbar from "../../component/TeacherNavbar";

const QuizScreen = () => {
    const id = useLocation().state.id || null;
    const navigate = useNavigate();

    const theme = useTheme();

    const user = useUser();

    const [quiz, setQuiz] = useState<Quiz | null>(null);

    const [owner, setOwner] = useState(false);

    useEffect(() => {
         const x = async () => {
             const res = await quizzes.get(id);
             setQuiz(res);
         }

        if (id) {
            x().then();
        }
    }, [id]);

    useEffect(() => {
        if (user && quiz) {
            setOwner(user.getUsername() === quiz.author);
            console.log(user.getUsername());
            console.log(quiz.author);
        }
    }, [user, quiz]);

    if (!id) {
        return <Navigate to="/teacher"/>
    }

    const cg = () => {
        const x = async() => {
            const code = nanoid(8).toLowerCase();
            const id = await games.insert({quiz_id: quiz!.id, code}, "id");
            navigate("/game", {state: {id, quizid: quiz!.id, code}});
        }
        x().then();
    }

    const clone = () => {
        const x = async() => {
            const q: Quiz = {...quiz};
            delete q.id;
            q.author = (user as CognitoUser).getUsername();
            const i = await quizzes.insert(q, "id");
            navigate(`/teacher/quiz`, {state: {id: i}})
        }
        x().then();
    }

    console.log(quiz);

    return quiz && <>
        <TeacherNavbar/>
        <div className="layout layout-lg">
            <div>
                <aside>
                    <h3 className="text-3xl font-bold ml-2 mb-12">{quiz.title}</h3>
                    <p className="text-xl mb-14">{quiz.description}</p>
                    <div className="flex justify-start gap-10">
                        <button className="btn styled" onClick={() => {clone()}}>Clone Quiz</button>
                        <button className="btn styled bg-sky-500 hover:bg-sky-400 border-none" onClick={() => {cg()}}>Create game</button>
                    </div>
                </aside>
            </div>
            <main>
                <div className="w-full max-w-full sm:mx-auto sm:max-w-4xl">
                    {quiz.questions!.map(question => <div key={question.question} className="bg-slate-200 dark:bg-slate-700 p-8 rounded-md shadow-md mb-5">
                        <div className="flex justify-between items-start mb-5">
                            <h3 className="text-2xl">{question.question}</h3>
                            {owner && <Switch/>}
                        </div>
                        <div className="ml-10">
                            {question.choices.map((choice: string, index: number) => <div className="p-2 flex items-center gap-8" key={index}>
                                {owner ? <button className="btn btn-square btn-ghost btn-md"><CheckIcon className={`w-6 h-6 ${question.answers.includes(index) ? 'text-green-700 border-b border-green-500' : 'opacity-30'}`}/></button> : (question.answers.includes(index) && <CheckIcon className="w-6 h-6 text-green-700"/>)}
                                <p className="text-lg">{choice}</p>
                            </div>)}
                        </div>
                    </div>)}
                </div>
            </main>
        </div>
    </>
}

export default QuizScreen;
