import Table from "./Table";

type Question = {
    choices: string[],
    answers: number[],
    question: string
}

type Quiz = {
    id?: number,
    title?: string,
    description?: string,
    questions?: Question[],
    question_count?: number,
    author?: string,
    category?: number,
    tags?: string
}

type Game = {
    id?: number,
    quiz_id?: number,
    code?: string
}

const quizzes = new Table<Quiz>("quizzes");
const games = new Table<Game>("games");

export {
    quizzes,
    games
};

export type {
    Quiz,
    Game,
    Question
}
