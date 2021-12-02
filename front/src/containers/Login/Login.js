import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {loginUser} from "../../store/actions/usersAction";
import './Login.css';

const Login = () => {
    const dispatch = useDispatch();

    const [user, setUser] = useState({
        username: '',
        password: ''
    });

    const inputChangeHandler = e => {
        const {name, value} = e.target;

        setUser(prevState => ({...prevState, [name]: value}));
    };

    const submitFormHandler = e => {
        e.preventDefault();
        dispatch(loginUser({...user}));
    };

    return (
        <div>
            <form onSubmit={submitFormHandler} className="authorization">
                <h2>Login</h2>
                <input name="username" value={user.username} onChange={e => (inputChangeHandler(e))} type="text" placeholder="Username" autoComplete="on"/>
                <input name="password" value={user.password} onChange={e => (inputChangeHandler(e))} type="password" placeholder="Password" autoComplete="on"/>
                <button>Send</button>
            </form>
        </div>
    );
};

export default Login;