import React, {useState} from "react";
import FormField from "../../component/FormField";
import useTheme from "../../hooks/UseTheme";
import Auth from "../../backend/Auth";
import {useLocation, useNavigate} from "react-router-dom";
import Login from "./Login";

const Confirm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useTheme("light");

    const [email, setEmail] = useState((location.state && location.state.email) || "");
    const [code, setCode] = useState("");

    const submit = () => {
        Auth.confirm(email, code).then(() => {
            navigate("/");
        });
    }

    return <div className="w-screen min-h-screen flex justify-center items-center">
        <div className="w-full max-w-full sm:max-w-sm">
            <h1 className="text-5xl font-bold mb-8">Kahot</h1>
            <div className="bg-white shadow-xl p-8 rounded-lg">
                <div className="h-96">
                    <p className="font-semibold text-2xl mb-12">Confirm your account</p>

                    <p className="font-bold text-md mb-2">Email</p>
                    <FormField getter={email} setter={setEmail} type="text" className="input input-bordered w-full mb-10" placeholder="joemama@urmom.com"/>

                    <p className="font-bold text-md mb-2">Code</p>
                    <FormField getter={code} setter={setCode} type="text" className="input input-bordered w-full mb-12"/>

                    <button className="btn" onClick={submit}>Continue</button>
                </div>
            </div>
        </div>
    </div>
}

export default Confirm;
