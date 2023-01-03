import React, {useEffect, useState} from "react";
import Navbar from "../../component/Navbar";
import useTheme from "../../hooks/UseTheme";
import {
    BanknotesIcon,
    BeakerIcon, BookmarkIcon,
    BookOpenIcon,
    HomeIcon,
    NewspaperIcon, PlusIcon,
    VariableIcon
} from "@heroicons/react/24/outline";
import {Link, useNavigate} from "react-router-dom";
import FormField from "../../component/FormField";
import {games, Quiz, quizzes} from "../../backend/Tables";
import {nanoid} from "nanoid";


const CATEGORY_TITLES = [
    "All",
    "Math",
    "Science",
    "English",
    "Social Studies",
    "History"
]

const CATEGORY_ICONS = [
    <HomeIcon className="w-6 h-6"/>,
    <VariableIcon className="w-6 h-6"/>,
    <BeakerIcon className="w-6 h-6"/>,
    <BookOpenIcon className="w-6 h-6"/>,
    <BanknotesIcon className="w-6 h-6"/>,
    <NewspaperIcon className="w-6 h-6"/>
]

const FindScreen = () => {
    const navigate = useNavigate();

    const theme = useTheme();

    const [category, setCategory] = useState<number>(0);
    const [tag, setTag] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [qsearch, setQsearch] = useState<string>("");

    const [tags, setTags] = useState<Array<string>>([]);

    const [results, setResults] = useState<Quiz[]>([]);

    useEffect(() => {
        const statements: Array<string> = [];
        if (category > 0) {
            statements.push(`category = ${category}`);
        }
        if (tag.length > 0) {
            statements.push(`LOWER(tags) LIKE '%${tag.toLowerCase() + ","}%'`);
        }
        if (qsearch.length > 0) {
            statements.push(`(LOWER(title) LIKE '%${qsearch.toLowerCase()}%') OR (LOWER(description) LIKE '%${qsearch.toLowerCase()}%') OR (LOWER(tags) LIKE '%${qsearch.toLowerCase()}%')`);
        }
        quizzes.query(statements).then(r => {
            const res = r as { [key: string]: any }[];
            console.log(r);
            const t: string[] = [];
            res.forEach(x => {
                const tags = x.tags.split(',') as string[];
                tags.forEach(y => {
                    if (y && y.length > 0) {
                        if (!t.includes(y)) {
                            t.push(y);
                        }
                    }
                });
            });
            if (!t.includes(tag)) {
                setTag("");
            }
            setTags(t);
            setResults(res);
        });
    }, [category, tag, qsearch]);

    const s = () => {
        setQsearch(search);
    }

    const cg = (result: Quiz) => {
        const x = async() => {
            const code = nanoid(8).toLowerCase();
            const id = await games.insert({quiz_id: result.id, code}, "id");
            navigate("/game", {state: {id, quizid: result.id, code}});
        }
        x().then();
    }

    return <>
        <Navbar theme={theme}>
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
        </Navbar>
        <div className="lg:grid lg:grid-cols-6 lg:gap-10">
            <div className="col-span-1 mb-12 lg:mb-0">
                <aside className="w-52 px-4 dark:text-slate-100">
                    <h3 className="text-xl font-bold ml-2 mb-4">Find</h3>
                    {CATEGORY_TITLES.map((title, index) => <div className={`mb-2 flex items-center p-3 gap-6 text-md ${category === index ? "font-bold bg-slate-300 dark:bg-slate-700 rounded-lg shadow-sm" : "font-semibold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 hover:rounded-lg hover:shadow-sm"}`} onClick={() => {setCategory(index)}} key={title}>
                        {CATEGORY_ICONS[index]} {title}
                    </div>)}
                    <hr className="border-t border-slate-300 py-3"/>
                    <div className="mb-2 flex items-center p-3 gap-6 text-md font-semibold cursor-pointer hover:bg-slate-300 hover:rounded-lg hover:shadow-sm"><BookmarkIcon className="w-6 h-6"/> Your Quizzes</div>
                    <Link to="/teacher/create" className="mb-2 flex items-center p-3 gap-6 text-md font-semibold cursor-pointer hover:bg-slate-300 hover:rounded-lg hover:shadow-sm"><PlusIcon className="w-6 h-6"/> Create a Quiz</Link>
                </aside>
            </div>
            <div className="col-span-5 px-5 lg:px-0">
                <div className="w-fit max-w-5xl flex justify-start gap-5 mb-5 px-10">
                    <div className={`py-2 h-fit px-3 bg-slate-300 dark:bg-slate-800 ${tag === "" ? "bg-slate-400 dark:bg-slate-700" : "hover:bg-slate-400 dark:hover:bg-slate-700 transition-transform hover:scale-110 cursor-pointer"} rounded-md shadow-md text-sm font-semibold`} onClick={() => {setTag("")}}>All</div>
                    {tags.map(t => <div key={t} className={`p-2 h-fit bg-slate-300 dark:bg-slate-800 ${tag === t ? "bg-slate-400 dark:bg-slate-700" : "hover:bg-slate-400 dark:hover:bg-slate-700 transition-transform hover:scale-110 cursor-pointer"} rounded-md shadow-md text-sm font-semibold`} onClick={() => {setTag(t)}}>{t}</div>)}
                </div>

                <div className="w-full max-w-full sm:mx-auto sm:max-w-3xl">
                    <div className="input-group mb-10">
                        <FormField getter={search} setter={setSearch} type="text" placeholder="Search…" className="input input-bordered shadow-sm w-full" />
                        <button className="btn btn-square" onClick={s}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>

                    {results.length > 0 ? results.map(result => <div key={result.id} className="bg-slate-200 dark:bg-slate-700 p-8 rounded-md shadow-md mb-5">
                        <p className="text-xl font-semibold mb-6 flex justify-start items-center gap-4">{result.title}{/* <button className="btn btn-ghost btn-square">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </button>*/}</p>
                        <p className="mb-8 text-lg">{result.description}</p>
                        <div className="flex justify-start gap-10">
                            <button className="btn styled">Clone Quiz</button>
                            <button className="btn styled bg-sky-500 hover:bg-sky-400 border-none" onClick={() => {cg(result)}}>Create game</button>
                        </div>
                        <Link className="btn styled" to="/teacher/quiz" state={{id: result.id}}>View</Link>
                    </div>) : <p className="text-gray-500 text-md font-semibold">No results</p>}
                </div>
            </div>
        </div>
    </>
}

export default FindScreen;
