import {Dispatch, SetStateAction, useState} from "react";
import ObjectStateWrapper from "../../component/ObjectStateWrapper";
import FormField from "../../component/FormField";
import {generate, add} from "../../ai/prompts";
import openai from "../../ai/AI";
import TextareaAutosize from 'react-textarea-autosize';
import React from 'react';
import useObjectState from "../../hooks/UseObjectState";
import useTheme from "../../hooks/UseTheme";
import Navbar from "../../component/Navbar";
import Question from "../../Question";
import {quizzes} from "../../backend/Tables";


const CATEGORY_TITLES = [
    "other",
    "math",
    "science",
    "english",
    "social studies",
    "history"
]

const CreateQuiz = () => {
    const theme = useTheme();

    const [title, setTitle] = useState("");

    const [topic, setTopic] = useState("");
    const [qtopic, setQtopic] = useState("");

    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [loadingQuestion, setLoadingQuestion] = useState(false);

    const [questions, setQuestions] = useState<Array<Question>>([]);

    const [category, setCategory] = useState<number>(0);
    const [tags, setTags] = useState<string>("");

    const gen = () => {
        setLoadingQuestions(true);
        openai(generate.replaceAll("$TOPIC", topic)).then((r) => {
            console.log(r);
            setCategory(CATEGORY_TITLES.indexOf(r.category.trim().toLowerCase()) || 0);
            setTags(r.tags.split(',').map((tag: string) => tag.trim()).join(',').toLowerCase() + ',');
            setQuestions(r.questions);
            setLoadingQuestions(false);
        });
        //setQuestions(JSON.parse(`[{"question":"Who was the first man to walk on the moon?","choices":["Neil Armstrong","Buzz Aldrin","John Glenn","Alan Shepard"],"answers":[0]},{"question":"What was the name of the spacecraft that took the first men to the moon?","choices":["Apollo 11","Columbia","Endeavor","Challenger"],"answers":[0]},{"question":"When was the first moon landing?","choices":["July 20th, 1969","July 4th, 1776","April 7th, 1945","October 4th, 1957"],"answers":[0]},{"question":"What flag did Neil Armstrong and Buzz Aldrin plant on the moon?","choices":["The American Flag","The Confederate Flag","The British Flag","The United Nations Flag"],"answers":[0]},{"question":"Which of the following were members of the first moon landing crew?","choices":["Neil Armstrong, Michael Collins, and Edwin Aldrin","Neil Armstrong, Buzz Aldrin, and Charles Duke","Neil Armstrong, Michael Collins, and Charles Duke","Neil Armstrong, Buzz Aldrin, and Edwin Aldrin"],"answers":[0,2]}]`));
    }

    const a = () => {
        console.log(qtopic);
        console.log(add.replaceAll("$TOPIC", topic).replaceAll("$QTOPIC", qtopic));
        setLoadingQuestion(true);
        openai(add.replaceAll("$TOPIC", topic).replaceAll("$QTOPIC", qtopic)).then((r) => {
            const question = r as Question;
            setLoadingQuestion(false);
            console.log(r);
            setQuestions([question, ...questions]);
        });
    }

    const save = () => {
        quizzes.insert({
            title,
            description: topic,
            questions: questions,
            question_count: questions.length,
            category: category,
            tags: tags
        }).then();
    }

    return <>
        <Navbar theme={theme}>
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
        </Navbar>
        <div className="w-full max-w-full sm:mx-auto sm:max-w-3xl">
            <div className="bg-slate-50 dark:bg-slate-800 shadow-md rounded-lg p-7 mb-10">
                <h3 className="text-2xl font-bold mb-7">Lets get started</h3>

                <p className="text-lg font-bold dark:text-sky-500">Step 1</p>
                <p className="text-md font-semibold mb-3">What is your quiz called?</p>
                <div className="max-w-xl mb-1">
                    <FormField getter={title} setter={setTitle} type="text" placeholder="Beach Sand Quiz"
                           className="input input-bordered w-full shadow-sm"/>
                </div>
                <p className="mb-5 text-sm">This is for other people to find your quiz.</p>

                <p className="text-lg font-bold dark:text-sky-500">Step 2</p>
                <p className="text-md font-semibold mb-3">What is your quiz about? <span className="font-bold">(Be specific)</span></p>
                <div className="max-w-xl mb-5">
                    <TextareaAutosize placeholder="The utility of beach sand in concrete and the ethical concerns of collecting it"
                                      className="input input-bordered w-full shadow-sm resize-none" value={topic} onChange={e => {setTopic(e.target.value)}}/>
                </div>

                <p className="text-lg font-bold dark:text-sky-500">Step 3</p>
                <p className="text-md font-semibold mb-3">How many questions do you want?</p>
                <div className="max-w-xl mb-8">
                    <select className="select select-bordered w-full shadow-sm">
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                        <option>25</option>
                    </select>
                </div>

                <button className="btn dark:bg-sky-500 dark:hover:bg-sky-400" onClick={gen} disabled={loadingQuestions || !(title && topic)}>{questions.length > 0 ? "Reg" : "G"}enerate Quiz</button>
            </div>

            {questions.length > 0 && <>
                <div className="bg-slate-50 dark:bg-slate-800 shadow-md rounded-lg p-7 mb-10">
                    <h3 className="text-2xl font-bold mb-7">Customize</h3>
                    <p className="text-md font-semibold mb-3">What would you like to add a specific question about <span className="text-sky-600 dark:text-sky-500">(optional)</span>?</p>
                    <div className="max-w-xl mb-8">
                        <FormField type="text" placeholder="In what ways does the collection of beach sand cause CO2 emissions" className="input input-bordered w-full shadow-sm" getter={qtopic} setter={setQtopic}/>
                    </div>
                    <button className="btn" onClick={a} disabled={loadingQuestion}>Add</button>
                </div>

                {questions.map((question: Question, index: number) => <ObjectStateWrapper stateArray={[questions, setQuestions]} index={index} key={question.question}>
                        <QuestionUI/>
                    </ObjectStateWrapper>
                )}

                <div className="flex justify-end">
                    <button className="btn" onClick={save}>Save</button>
                </div>
            </>}
        </div>
    </>
}

const QuestionUI = ({state}: {state?: [Question, Dispatch<SetStateAction<Question>>]}) => {
    const [question, setQuestion]: [Question, CallableFunction] = state!;
    const [answers, setAnswers] = useObjectState(state!, "answers");

    const toggle = (index: number) => {
        const idx = answers.indexOf(index);
        console.log(idx);
        if (idx >= 0) {
            answers.splice(idx, 1);
        } else {
            answers.push(index);
        }
        console.log(answers)
        setAnswers(answers);
    }

    console.log(answers);

    return <div className="bg-slate-50 dark:bg-slate-800 shadow-md rounded-lg p-7 mb-10">
        <div className="flex justify-between items-center mb-5">
            <p className="text-lg font-semibold">{question.question}</p>
            <button className="btn btn-square btn-ghost" onClick={() => {setQuestion(undefined)}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
            {question.choices.map((choice: string, index: number) =>
                <div className={`${answers.includes(index) ? "bg-slate-500 dark:bg-slate-700 text-slate-200" : "bg-slate-200 dark:bg-slate-900 shadow-lg"} p-4 rounded-md w-fit h-fit flex flex-row transition-transform hover:scale-110 cursor-pointer`} onClick={() => {toggle(index)}} key={choice}>
                    <p className="text-md font-semibold">{choice}</p>
                    {answers.includes(index) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>}
                </div>
            )}
        </div>
        {/*<button className="btn btn-square btn-ghost"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
        </svg></button>*/}
    </div>
}

export default CreateQuiz;
