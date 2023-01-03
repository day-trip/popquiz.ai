import {useEffect, useState} from "react";
import {CognitoUser} from "amazon-cognito-identity-js";
import Auth from "../backend/Auth";

const useUser = (): CognitoUser | null | false => {
    const [user, setUser] = useState<CognitoUser | null | false>(null);

    useEffect(() => {
        if (!user) {
            setUser(Auth.getUser() || false);
        }
    }, [user]);

    return user;
}

export default useUser;
