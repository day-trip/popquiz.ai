import {useEffect, useState} from "react";

const useObjectState = ([object, setObject], key: number | string, deletable: boolean = false, debug: boolean = false, defaultValue: any = undefined) => {
    const [state, setState] = useState(object[key] === undefined ? defaultValue : object[key]);

    if (debug) {
        console.log(object);
        console.log(key);
        console.log(state);
    }

    useEffect(() => {
        if (deletable && state === undefined) {
            object.splice(key, 1);
            if (debug) {
                console.log("DELETING!");
            }
        } else {
            object[key] = state;
            if (debug) {
                console.log("CHANGE!");
                console.log(state);
            }
        }
        setObject(object);
    }, [state]);

    useEffect(() => {
        setState(object[key]);
    }, [key, object]);

    useEffect(() => {
        if (debug) {
            console.log(object);
        }
    }, [object]);
    
    return [state, setState];
}

export default useObjectState;
