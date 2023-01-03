import {Dispatch, SetStateAction, useLayoutEffect, useState} from "react";

const useTheme = (override?: string): [string, Dispatch<SetStateAction<string>>] => {
    const [theme, setTheme] = useState<string>(override || (localStorage.theme || "light"));

    useLayoutEffect(() => {
        if (document.documentElement.classList.contains("light")) {
            document.documentElement.classList.remove("light");
        }
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
        }
        document.documentElement.classList.add(theme);
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.theme = theme;
    }, [theme]);

    return [theme, setTheme];
}

export default useTheme;
