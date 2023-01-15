import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
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
import {Quiz, quizzes} from "../../backend/Tables";
import useUser from "../../hooks/UseUser";
import {CognitoUser} from "amazon-cognito-identity-js";
import {Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Paper, Typography} from "@mui/material";
import {ThemeContext} from "../../App";
import TeacherNavbar from "../../component/TeacherNavbar";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/solid";


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

    const theme: [string, Dispatch<SetStateAction<string>>] = useContext(ThemeContext) as [string, Dispatch<SetStateAction<string>>];

    const [sideContentVisible, setSideContentVisible] = useState(true);

    const [category, setCategory] = useState<number>(0);
    const [tag, setTag] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [qsearch, setQsearch] = useState<string>("");

    const [creating, setCreating] = useState(false);

    const [tags, setTags] = useState<Array<string>>([]);

    const [results, setResults] = useState<Quiz[]>([]);

    const user = useUser();

    useEffect(() => {
        const x = async () => {
            const statements: Array<string> = [];
            if (category === -1) {
                statements.push(`author = '${(user as CognitoUser).getUsername()}'`);
                console.log(statements);
            }
            if (category > 0) {
                statements.push(`category = ${category}`);
            }
            if (tag.length > 0) {
                statements.push(`LOWER(tags) LIKE '%${tag.toLowerCase() + ","}%'`);
            }
            if (qsearch.length > 0) {
                statements.push(`(LOWER(title) LIKE '%${qsearch.toLowerCase()}%') OR (LOWER(description) LIKE '%${qsearch.toLowerCase()}%') OR (LOWER(tags) LIKE '%${qsearch.toLowerCase()}%')`);
            }

            const r = await quizzes.query(statements)

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
        }
        x().then();
    }, [category, tag, qsearch]);

    const s = () => {
        setQsearch(search);
    }

    return <>
        <TeacherNavbar/>

        <Dialog open={creating} onClose={() => {setCreating(false)}}>
            <DialogTitle id="alert-dialog-title">
                {"Use Google's location service?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button>Disagree</Button>
                <Button autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
        <div className="layout">
            <div>
                <aside className={sideContentVisible ? '' : 'border-none'}>
                    <div className="flex justify-between">
                        <h3 className="text-xl font-bold ml-2 mb-4">Find</h3>
                        <button className="btn btn-sm btn-square btn-ghost sm:invisible" onClick={() => {setSideContentVisible(!sideContentVisible)}}>{sideContentVisible ? <ChevronUpIcon className="w-6 h-6"/> : <ChevronDownIcon className="w-6 h-6"/>}</button>
                    </div>
                    {sideContentVisible && <>
                        {CATEGORY_TITLES.map((title, index) => <div className={`mb-2 flex items-center p-3 gap-6 text-md ${category === index ? "font-bold bg-slate-300 dark:bg-slate-700 rounded-lg shadow-sm" : "font-semibold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 hover:rounded-lg hover:shadow-sm"}`} onClick={() => {setCategory(index)}} key={title}>
                            {CATEGORY_ICONS[index]} {title}
                        </div>)}
                        <hr className="border-t border-slate-300 py-3"/>
                        <div className={`mb-2 flex items-center p-3 gap-6 text-md ${category === -1 ? "font-bold bg-slate-300 dark:bg-slate-700 rounded-lg shadow-sm" : "font-semibold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 hover:rounded-lg hover:shadow-sm"}`} onClick={() => {setCategory(-1)}}><BookmarkIcon className="w-6 h-6"/> Your Quizzes</div>
                        <div onClick={() => {setCreating(true)}} className="flex items-center p-3 gap-6 text-md font-semibold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 hover:rounded-lg hover:shadow-sm"><PlusIcon className="w-6 h-6"/> Create a Quiz</div>
                    </>}
                </aside>
            </div>
            <main>
                {tags.length > 0 && <div className="w-fit max-w-4xl xl:max-w-5xl flex justify-start gap-5 mb-5 sm:px-10 flex-wrap">
                    <Chip label="All" onClick={() => {setTag("")}} color={tag === "" ? "primary" : "default"}/>
                    {tags.map(t => <Chip label={t.split(' ').map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' ')} onClick={() => {setTag(t)}} key={t} color={tag === t ? "primary" : "default"}/>)}
                </div>}

                <div className="w-full max-w-full sm:mx-auto sm:max-w-3xl">
                    <div className="input-group mb-10">
                        <FormField getter={search} setter={setSearch} type="text" placeholder="Search…" className="input styled shadow-sm w-full" />
                        <button className="btn btn-square" onClick={s}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>

                    {results.length > 0 ? results.map(result => <div key={result.id} className="bg-slate-200 dark:bg-slate-700 p-8 rounded-md shadow-md mb-5">
                        <p className="text-xl font-semibold mb-6 flex justify-start items-center gap-4">{result.title}</p>
                        <p className="mb-8 text-lg">{result.description}</p>
                        <Link className="btn btn-primary styled dark:bg-sky-500" to="/teacher/quiz" state={{id: result.id}}>View Quiz</Link>
                    </div>) : <p className="text-gray-500 text-md font-semibold">No results</p>}
                </div>
            </main>
        </div>
    </>
}

export default FindScreen;
