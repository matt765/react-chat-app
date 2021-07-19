import { Route, Switch } from 'react-router-dom';
import { Login, Signup, Chat } from 'components';
import { AuthProvider } from 'context/AuthContext.js';
import { BrowserRouter as Router } from 'react-router-dom';
import React, {  useEffect , useState} from "react";

export const App = () => {
  

    return (
        <div className="app">
            <Router>
                <AuthProvider>
                    <Switch>
                        <Route exact path="/chat" component={Chat} />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
                    </Switch>
                </AuthProvider>
            </Router>
        </div>
    )
}