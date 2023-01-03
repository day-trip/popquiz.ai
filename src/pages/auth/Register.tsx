import React, {useState} from "react";
import FormField from "../../component/FormField";
import useTheme from "../../hooks/UseTheme";
import Auth from "../../backend/Auth";
import {useNavigate} from "react-router-dom";
import Login from "./Login";

const Register = () => {
    const navigate = useNavigate();

    useTheme("light");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    const submit = () => {
        Auth.register(email, password, {nickname}).then((r) => {
            if (r.userConfirmed) {
                navigate("/");
            } else {
                navigate("/auth/confirm", {state: {email}})
            }
        });
    }

    return <div className="w-screen min-h-screen flex justify-center items-center">
        <div className="w-full max-w-full sm:max-w-sm">
            <h1 className="text-5xl font-bold mb-8">Kahot</h1>
            <div className="bg-white shadow-xl p-8 rounded-lg">
                <div className="">
                    <p className="font-semibold text-2xl mb-12">Create a new account</p>

                    <p className="font-bold text-md mb-2">Email</p>
                    <FormField getter={email} setter={setEmail} type="text" className="input input-bordered w-full mb-10" placeholder="joemama@urmom.com"/>

                    <p className="font-bold text-md mb-2">Password</p>
                    <FormField getter={password} setter={setPassword} type="password" className="input input-bordered w-full mb-12"/>

                    <p className="font-bold text-md mb-2">Nickname</p>
                    <FormField getter={nickname} setter={setNickname} type="text" className="input input-bordered w-full mb-12"/>

                    <button className="btn" onClick={submit}>Continue</button>
                </div>
            </div>
        </div>
    </div>
}

export default Register;
