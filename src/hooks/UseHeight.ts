import {useCallback, useEffect, useState} from "react";
import {json} from "react-router-dom";


const wh = (): number => {
    return Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
}

const useHeight = (): number => {
    const [height, setHeight] = useState<number>(wh());

    const handler = useCallback(() => {
        setHeight(wh());
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('resize', handler);
        }
    }, []);

    return height;
}

export default useHeight;
