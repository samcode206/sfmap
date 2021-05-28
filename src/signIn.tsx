import { FormEvent, useState } from 'react';
import supabase from './supabase';
import {useHistory} from 'react-router-dom';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(false); 
    const history = useHistory();

    const onsubmitHandler = async (e : FormEvent) => {
        if (!email.length && !password.length) return; 
        e.preventDefault();
        const { error } = await supabase.auth.signIn({
            email: email,
            password: password
        });
        if (error !== null){
            setError(true); 
            setEmail("");
            setPassword("");
        } else {
            setError(false); 
            history.push("/admin"); 
        }
    };

    const resetForm = (e: FormEvent) : void => {
        e.preventDefault();
        setEmail("");
        setPassword("");
    };

    return <>
    {error && <div className="notification is-danger">Invalid credentials try again</div>}
    <div className="section is-large">
        <form className="container box" style={{maxWidth:"65%"}} onSubmit={onsubmitHandler}>

            <h1 className="title is-3 has-text-centered">Admin</h1>

            <div className="field">
                <label className="label">Email:</label>
                <div className="control">
                    <input type="text" className="input" placeholder="email" 
                    value={email} onChange={(e)=> setEmail(e.target.value)}/>
                </div>
            </div>

            <div className="field">
                <label  className="label">Password:</label>
                <div className="control">
                    <input type="password" className="input" placeholder="password" 
                    value={password} onChange={(e)=> setPassword(e.target.value)}/>
                </div>
            </div>


            <div className="field is-grouped is-grouped-centered">
                <div className="control">
                    <button className="button is-link" onClick={onsubmitHandler}>Login</button>
                </div>
                <div className="control">
                    <button className="button is-light" onClick={resetForm}>Cancel</button>
                </div>
            </div>

        </form>
    </div>
    </>
};