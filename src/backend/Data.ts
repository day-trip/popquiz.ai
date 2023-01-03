import Query from "./Query";
import squel, {Insert, Select, Update} from "squel";
import {DateTime} from "luxon";

class Data {
    private static _endpoint: string;
    static squel: squel.PostgresSquel;
    static init() {
        this._endpoint = "https://co4g3j60ml.execute-api.us-east-1.amazonaws.com/Prod";
        this.squel = squel.useFlavour("postgres");
    }

    static _set(query: Insert | Update, values: {[key: string]: Object}): Insert | Update {
        Object.keys(values).map(k => {
            const v = values[k];
            if (this._isObject(v)) {
                query = query.set(k, JSON.stringify(v));
            } else {
                query = query.set(k, v);
            }
        });
        return query;
    }

    static _where(query: Select, values: Array<string>): Select {
        values.forEach(value => {
            query = query.where(value);
        });
        return query;
    }

    static timestamp(query: Insert | Update, create = false): Insert | Update {
        const time = DateTime.now().toISO();
        if (create) {
            query = query.set("created_at", time);
        }
        return query.set("updated_at", time);
    }

    static _isObject(val: any): boolean {
        if (val === null) { return false;}
        return ( (typeof val === 'function') || (typeof val === 'object') );
    }

    static _tryParseJSONObject (jsonString: string){
        try {
            const o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
                return o;
            }
        }
        catch (e) { }
        return false;
    };

    static _processResult(result: {[key: string]: any}) {
        /*const rows = (result.rows || []);
        rows.map((row: {[key: string]: any}) => {
            Object.keys(row).forEach(k => {
                const col = row[k];
                if (typeof col === 'string' || col instanceof String) {
                    row[k] = col.replaceAll(new RegExp(/([^'])('')([^'])/, 'g'), "$1'$3");
                }
            });
            return row;
        });*/
        return {rows: result.rows || [], fields: result.fields || [], oid: result.oid || null};
    }

    static async _sql(query: Query): Promise<{rows?: Array<{[key: string]: any}>}> {
        console.log("Executing SQL command:\n" + query.toString());
        query.updateOptions({...query.options, parameterCharacter: "POOPMAN", replaceSingleQuotes: true});
        const data = await fetch(this._endpoint + "/sql", {method: "post", body: query.toString()});
        const text = await data.text();
        const json = this._tryParseJSONObject(text);
        if (json) {
            return this._processResult(json);
        }
        throw Error("Exception thrown while executing SQL command!\n" + text);
    }
}

export default Data;
