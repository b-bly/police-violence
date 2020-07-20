import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { About } from './screens/About';
import { Home } from './screens/Home';

interface AppProps {

}

interface AppState {

}

export default class App extends Component<AppProps, AppState> {
   
    render() {
    
        return (
            <Router>
                <Switch>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        );
    }
}