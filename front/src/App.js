import {Route, Switch} from "react-router-dom";
import Main from "./components/Main/Main";
import React from "react";
import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";
import Toolbar from "./components/UI/Toolbar/Toolbar";
import './App.css'

const App = () => {
    return (
        <div>
            <Toolbar/>
            <div className="container">
                <div className="container-inner">
                    <Switch>
                        <Route path="/" exact component={Main}/>
                        <Route path="/register" exact component={Register}/>
                        <Route path="/login" exact component={Login}/>
                    </Switch>
                </div>
            </div>
        </div>
    )
};

export default App;

