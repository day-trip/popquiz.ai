import {Dispatch, SetStateAction} from "react";

const useSmartArray = <T>(array: T[], setArray: Dispatch<SetStateAction<T[]>>): T[] => {
    return new Proxy(array, {
        set(target: T[], property: number, value: T, receiver: any): boolean {
            const t: T[] = [...target];
            t[property] = value;
            setArray(t);
            return true;
        }
    });
}

export default useSmartArray;
