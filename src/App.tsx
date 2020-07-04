import React, { Component } from 'react';
import { Graph } from './graph';

interface AppProps {

}

interface AppState {

}

export default class App extends Component<AppProps, AppState> {
    render() {
    return (
        <div>
            <Graph />
        </div>
    );
    }
}