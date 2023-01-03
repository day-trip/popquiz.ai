import axios from "axios";


const key = "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";

const openai = async (prompt: string): Promise<{[key: string]: any}> => {
    const body = {
        "model": "text-davinci-003",
        "prompt": prompt,
        "temperature": 0.6,
        "max_tokens": 2650,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    };
    const res = await axios.post("https://api.openai.com/v1/completions", body, {headers: {Authorization: "Bearer " + key}});
    const text = res.data.choices[0].text;
    console.log(text);
    return JSON.parse("{" + text);
}

export default openai;
