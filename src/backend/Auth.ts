import {
    AuthenticationDetails, CognitoAccessToken, CognitoIdToken,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool, CognitoUserSession, ISignUpResult
} from 'amazon-cognito-identity-js';

import Q from "q";


class Auth {
    static pool: CognitoUserPool;

    static init() {
        this.pool = new CognitoUserPool({
            UserPoolId: "us-east-1_dI0FCJVGc",
            ClientId: "19bkdkep7915r1gp1hnccq7sl4"
        });
    }

    static _createAttributeList(attributes: {[key: string]: string}): CognitoUserAttribute[] {
        const attr: CognitoUserAttribute[] = [];
        Object.keys(attributes).forEach(x => {
            const y = attributes[x];
            attr.push(new CognitoUserAttribute({
                Name: x,
                Value: y
            }));
        });
        return attr;
    }

    static _createCognitoUser(username: string): CognitoUser {
        return new CognitoUser({Pool: this.pool, Username: username});
    }

    static _createAuthenticationDetails(username: string, password: string): AuthenticationDetails {
        return new AuthenticationDetails({Username: username, Password: password});
    }

    static async login(email: string, password: string): Promise<CognitoUserSession> {
        const d = Q.defer<CognitoUserSession>();

        const user = this._createCognitoUser(email);
        user.authenticateUser(this._createAuthenticationDetails(email, password), {
            onSuccess: (result) => {
                d.resolve(result);
            },
            onFailure: (err) => {
                d.reject(err);
            }
        });

        return d.promise;
    }

    static async register(email: string, password: string, attributes: {[key: string]: string}): Promise<ISignUpResult> {
        const d = Q.defer<ISignUpResult>();

        this.pool.signUp(email, password, this._createAttributeList({'email': email, ...attributes}), [], (err, result) => {
            if (err) {
                d.reject(err);
                return;
            }
            d.resolve(result);
        });

        return d.promise;
    }

    static async confirm(email: string, code: string): Promise<any> {
        const d = Q.defer<any>();

        const user = this._createCognitoUser(email);
        user.confirmRegistration(code, true, (err, result) => {
            if (err) {
                d.reject(err);
                return;
            }
            d.resolve(result);
        });

        return d.promise;
    }

    static async logout() {
        const d = Q.defer();

        const user = this.getUser();
        if (user) {
            user.signOut(() => {
                d.resolve();
            });
        }

        return d.promise;
    }

    static getUser() {
        return this.pool.getCurrentUser();
    }

    static async getToken(user: CognitoUser, type: 'ACCESS' | 'ID'): Promise<CognitoAccessToken | CognitoIdToken> {
        const d = Q.defer<CognitoAccessToken | CognitoIdToken>();

        user.getSession((err?: Error | null, session?: CognitoUserSession) => {
            if (err) {
                d.reject(err);
                return;
            }
            d.resolve(type === "ACCESS" ? session!.getAccessToken() : session!.getIdToken());
        });

        return d.promise;
    }

    static async getGroups(user: CognitoUser) {
        return (await this.getToken(user, "ACCESS")).payload['cognito:groups'];
    }
}

export default Auth;
