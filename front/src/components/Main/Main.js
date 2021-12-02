import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import './Main.css'
import {setMessages, setOnlineUsers} from "../../store/actions/actions";


const Main = (props) => {

    const dispatch = useDispatch();

    const ws = useRef(null);

    const user = useSelector(state => state.users.user);
    const users = useSelector(state => state.reducer.onlineUsers);
    const messages = useSelector(state => state.reducer.messages);

    const [data, setData] = useState({
        user: '',
        message: ''
    });

    const [lastMessages, setLastMessages] = useState([]);

    useEffect(() => {
        if (user) {
            setData({...data, user: user.username});
            ws.current = new WebSocket(`ws://localhost:8001/chat?token=${user.token}`);

            ws.current.onmessage = event => {
                const data = JSON.parse(event.data)

                if (data.type === 'NEW_MESSAGE') {
                    try {
                        dispatch(setMessages(data.message));
                    } catch (e) {
                        console.log(e)
                    }
                }

                if (data.type === 'ONLINE_USERS') {
                    try {
                        dispatch(setOnlineUsers(data.onlineUsers));
                    } catch (e) {
                        console.log(e)
                    }
                }

                if (data.type === 'LAST_MESSAGES') {
                    try {
                        setLastMessages(data.messages)
                    } catch (e) {
                        console.log(e)
                    }
                }
            };
        }
    }, [user, dispatch]);

    const printUsers = () => {
        if (users) {
            return users.map((users, index) => {
                return (
                    <span key={index}><b>{users.username}</b></span>
                )
            })
        }
    };

    const printMessages = () => {
        if (messages) {
            return messages.map((message, index) => {
                return (
                    <span key={index}><b>{message.user}:</b> {message.message}</span>
                )
            })
        }
    };


    const printSavedMessages = () => {
        if (lastMessages) {
            return lastMessages.map((message, index) => {
                return (
                    <span key={index}><b>{message.author.username}:</b> {message.title}</span>
                )
            })
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (ws) {
            ws.current.send(JSON.stringify({type: 'CREATE_MESSAGE', data: data}))
        }
        setData({...data, message: ''})
    };

    const logCheck = () => {
        if (user) {
            return (
                <div className="main-block">
                    <fieldset className="online-users">
                        <legend>Online Users</legend>
                        {printUsers()}
                    </fieldset>
                    <div className="chat-room-container">
                        <fieldset className="chat-room">
                            <legend>Chat Room</legend>
                            {printSavedMessages()}
                            {printMessages()}
                        </fieldset>
                        <form onSubmit={sendMessage}>
                            <input value={data.message} onChange={(e) => setData({...data, message: e.target.value})}
                                   type="text"/>
                            <button>Send</button>
                        </form>
                    </div>
                </div>
            )
        }
        return (
            <h1>Please login or register</h1>
        )
    };


    return (
        <div>
            {logCheck()}
        </div>
    );
};


export default Main;