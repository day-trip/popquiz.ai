import useUser from "../../hooks/UseUser";
import {useEffect, useState} from "react";
import {Quiz, quizzes} from "../../backend/Tables";
import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import Layout from "../../component/Layout";
import Navbar from "../../component/Navbar";
import useTheme from "../../hooks/UseTheme";

const QuizScreen = () => {
    const id = useLocation().state.id || null;

    const theme = useTheme();

    const user = useUser();
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
         const x = async () => {
             const res = await quizzes.get(id);
             setQuiz(res);
         }

        if (id) {
            x().then();
        }
    }, [id]);

    if (!id) {
        return <Navigate to="/teacher"/>
    }

    return quiz && <>
        <Navbar theme={theme}>
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
        </Navbar>
        <Layout sidebar={<>
            <h1 className="text-2xl font-semibold mb-5">{quiz.title}</h1>
            <p className="text-lg">{quiz.description}</p>
        </>}>
            urmom.com
        </Layout>
    </>
}

export default QuizScreen;
