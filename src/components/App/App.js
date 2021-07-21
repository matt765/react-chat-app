import { Route, Switch } from 'react-router-dom';
import { Login, Signup, Chat } from 'components';
import { AuthProvider } from 'context/AuthContext.js';
import { BrowserRouter as Router } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { fb } from "service";

export const App = () => {

    const [mainComponent, setMainComponent] = useState("login")

    useEffect(() => {
        // This hook needs to be here because  GH Pages doesn't allow subdirectories in default, making app unable to refresh on subdomain
        
        fb.auth.onAuthStateChanged((user) => {
            if (user && user.displayName == null) {
                setMainComponent("chat")
            } else if (user && user.displayName !== null) {
                setMainComponent("chat")
            } else {
                setMainComponent("login")
            }
        });
    }, []);

    return (
        <div className="app">
            <Router>
                <AuthProvider>
                    <Switch>
                        {(mainComponent == "login") ?
                            <Route path="/react-chat-app/" component={Login} /> :
                            <Route exact path="/react-chat-app/" component={Chat} />}

                        <Route path="/signup" component={Signup} />
                    </Switch>
                </AuthProvider>
            </Router>
        </div>
    )
}