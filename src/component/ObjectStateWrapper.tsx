import useObjectState from "../hooks/UseObjectState";
import React, {cloneElement, Dispatch, ReactNode, SetStateAction} from "react";

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

interface ObjectStateWrapperProps extends React.HTMLAttributes<HTMLElement> {
    stateArray: [any, Dispatch<SetStateAction<any>>];
    index: number | string;
    prop?: string;
    deletable?: boolean;
    debug?: boolean;
}

const ObjectStateWrapper: React.FC<ObjectStateWrapperProps> = ({stateArray, index, children, prop = "state", deletable = false, debug = false, ...props}) => {
    const state = useObjectState(stateArray, index, deletable, debug);
    if (isFunction(children)) {
        return children(state);
    }
    const p: React.HTMLAttributes<HTMLElement> = {...props};
    p[prop] = state;
    return cloneElement(children, p);
}

export default ObjectStateWrapper;
